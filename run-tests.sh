#!/bin/bash

run='default'
path='tests'
timeout=365000
runCommand="mocha-parallel-tests"
exclude=""

if [ ! -z "$1" ]; then
  path="$path/$1"
  run=${1////-}
fi

if [[ $1 == *"eligibility"* ]]; then
  timeout=1850000
fi

if [[ $1 == *"orchestrator"* ]]; then
  timeout=900000
fi

if [[ $1 == "pricerepository"* ]]; then
  if [[ $1 == "pricerepository/reinit" ]]; then
    timeout=7200000
  else
    exclude="!(C3244627)"
  fi
fi

if [[ $1 == *"receivers"* || \
      $1 == *"storerepository"*  || \
      $1 == *"orchestrator"*  || \
      $1 == *"complements-generator"* || \
      $1 == *"eligibility-calculator/perf"* || \
      $1 == *"syndication-platform"* || \
      $1 == *"family"*
      ]]; then
  runCommand="mocha"
fi

echo "Running tests with '$runCommand' command"
env NODE_PATH=. node_modules/.bin/$runCommand \
  --reporter mochawesome \
  "$path/**/$exclude*.js" \
  --timeout $timeout \
  --exit

testResult=$?

#if [[ $ENV != "KUBER" || $1 == *"eligibility/perf"* ]]; then
#  node post-results-to-testrail.js functional-$run
#fi

exit $testResult
