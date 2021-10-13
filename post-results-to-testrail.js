if (!process.env.TESTRAIL_AUTH) {
  throw new Error('No auth token passed.');
}

const fs = require('fs');
const axios = require('axios');
const merge = require('deepmerge');

const report = fs.readFileSync('mochawesome-report/mochawesome.json');
const reportJson = JSON.parse(report);
let testSuites = reportJson.suites || reportJson.results[0];

if (testSuites) {
  testSuites = testSuites.suites;
} else {
  throw new Error('Test results not found!');
}

// statuses
const STATUS_PASSED = 1;
const STATUS_FAILED = 5;
const STATUS_SKIPPED = 8;
const STATUS_RETEST = 4;

// common
const PROJECT_ID = '9';
const BASE_URL = 'https://elbrus.testrail.net/index.php?';

const testRail = axios.create({
  baseURL: `${BASE_URL}/api/v2`,
  headers: {
    'Content-Type': 'application/json',
    Authorization: process.env.TESTRAIL_AUTH
  }
});

const createNewRunBody = (caseIds, name = 'Test Run') => {
  const date = () => {
    const now = new Date();

    now.setHours(now.getHours() + 3);

    const datePart = `${now.getDate()}.${now.getMonth() < 9 ? `0${now.getMonth() + 1}` : now.getMonth() + 1}.${now.getFullYear()}`;
    const timePart = `${now.getHours()}:${now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes()}`;

    return `${datePart} ${timePart}`;
  };

  return {
    suite_id: 248,
    name: `${name} | ${date()}`,
    assignedto_id: 1,
    include_all: false,
    case_ids: caseIds,
    description: process.env.BUILD_URL ? process.env.BUILD_URL : '',
    refs: process.argv[3] ? process.argv[3] : ''
  };
};

const getCaseFromTitle = title => (title.match(/C(\d+)/)
  ? title.match(/C(\d+)/)[1]
  : null);

const getTestStatus = (entity) => {
  if (entity.pass) {
    return STATUS_PASSED;
  }

  if (entity.fail) {
    return STATUS_FAILED;
  }

  if (entity.skipped || entity.pending) {
    return STATUS_SKIPPED;
  }

  return STATUS_PASSED;
};

const stepResultFrom = (entity) => {
  let errMessage = '';

  if (Object.keys(entity.err).length > 0) {
    const { err } = entity;

    errMessage = [err.message ? `##Message##\n${err.message}` : '',
      err.estack ? `##Stack##\n${err.estack}` : '',
      err.diff ? `##Diff##\n${err.diff}` : ''].join('\n');
  }

  return {
    content: `##${entity.title}##\n\n${errMessage}`.replace(/C\d+(\s+)?/gi, '').trim(),
    status_id: getTestStatus(entity)
  };
};

// Cases:
//   a) success hooks, success steps - test is green
//   b) success hooks, at least one test or step failed - test is red
//   c) success hooks, at least one test or step pending, but others - succeed - test is green
//   d) success hooks, all steps pending - test is brown
//   e) at least one before hook failed - test is yellow (retest)
//   f) at least one after hook failed - test is red

const testResult = (caseId, entity, beforeHooks = [], afterHooks = []) => {
  const stepResults = entity.tests
    ? entity.tests.map(test => stepResultFrom(test))
    : [stepResultFrom(entity)];

  const failedBeforeHooksCount = beforeHooks.filter(hook => hook.status_id === STATUS_FAILED).length;
  const failedAfterHooksCount = afterHooks.filter(hook => hook.status_id === STATUS_FAILED).length;
  const skippedResultsCount = stepResults.filter(stepResult => stepResult.status_id === STATUS_SKIPPED).length;
  const passedResultsCount = stepResults.filter(stepResult => stepResult.status_id === STATUS_PASSED).length;
  const failedResultsCount = stepResults.filter(stepResult => stepResult.status_id === STATUS_FAILED).length;

  let status_id = STATUS_FAILED;

  if (failedBeforeHooksCount) {
    status_id = STATUS_RETEST;
  } else if (!failedAfterHooksCount) {
    if (passedResultsCount && !failedResultsCount) {
      status_id = STATUS_PASSED;
    } else if (skippedResultsCount === stepResults.length) {
      status_id = STATUS_SKIPPED;
    }
  }

  return {
    version: '',
    defects: '',
    elapsed: entity.duration,
    comment: `Case: [${caseId}](${BASE_URL}/cases/view/${caseId})`,
    status_id,
    custom_step_results: beforeHooks.concat(stepResults).concat(afterHooks)
  };
};

const parseSuites = (suites, cases = {}, hooksBefore = [], hooksAfter = [], caseId = null) => {
  let id;
  const testCases = cases;

  suites.forEach((suite) => {
    id = caseId || getCaseFromTitle(suite.title);

    const beforeHooks = hooksBefore.concat(suite.beforeHooks.map(hook => stepResultFrom(hook)));
    const afterHooks = hooksAfter.concat(suite.afterHooks.map(hook => stepResultFrom(hook)).reverse());

    if (id) {
      if (!testCases[id]) {
        testCases[id] = {};
      }

      if (suite.tests.length > 0) {
        testCases[id] = merge(testCases[id], testResult(id, suite, beforeHooks, afterHooks));
      } else {
        return parseSuites(suite.suites, testCases, beforeHooks, afterHooks, id);
      }
    } else {
      suite.tests.forEach((test) => {
        id = getCaseFromTitle(test.title);

        if (id) {
          testCases[id] = testResult(id, test, beforeHooks, afterHooks);
        }
      });
    }

    return parseSuites(suite.suites, testCases, beforeHooks, afterHooks);
  });

  return testCases;
};

{
  const cases = parseSuites(testSuites);

  if (!Object.keys(cases).length) {
    console.info('No test results generated. Nothing to post to Test Rail');
  } else {
    const caseIds = Object.keys(cases);

    const requestBody = process.argv[2]
      ? createNewRunBody(caseIds, process.argv[2])
      : createNewRunBody(caseIds);

    testRail.post(`/add_run/${PROJECT_ID}`, requestBody)
      .then(async (response) => {
        const { data } = response;

        console.info(`New test run created ID ${data.id} - ${data.url}`);

        for (const caseId of caseIds) {
          await testRail.post(`/add_result_for_case/${data.id}/${caseId}`, cases[caseId])
            .then(() => {
              console.info(`Test result of ${caseId} posted to run ${data.id}`);
            })
            .catch((err) => {
              const { error } = err.response.data;

              console.error(`Unable to post result of case  ${caseId} to run ${data.id}: ${error}`);
            });
        }
      })
      .catch((err) => {
        const { error } = err.response.data;

        console.error(`Failed to create test run - ${error ? error.toLowerCase() : JSON.stringify(err.response)}:`);

        caseIds.forEach((caseId) => {
          testRail.get(`/get_case/${caseId}`)
            .catch(() => {
              console.error(`\tCase ID ${caseId} doesn't exist.`);
            });
        });
      });
  }
}
