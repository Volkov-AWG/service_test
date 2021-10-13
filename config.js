const merge = require('deepmerge');

const config = {
  COMMON: {
    opus: {
      auth: process.env.OPUS_AUTH
    },
    db: {
      user: process.env.DB_USER,
      pass: process.env.DB_PASS
    },
    dbOpusRegress: {
      user: process.env.DB_OPUS_REGRESS_USER,
      pass: process.env.DB_OPUS_REGRESS_PASS
    },
    dbStoreRepo: {
      user: process.env.DB_STORE_REPO_USER,
      pass: process.env.DB_STORE_REPO_PASS
    },
    dbFamily: {
      user: process.env.DB_FAMILY_USER,
      pass: process.env.DB_FAMILY_PASS
    },
    dbChords: {
      user: process.env.DB_CHORDS_USER,
      pass: process.env.DB_CHORDS_PASS
    },
    dbPimUpdateLog: {
      user: process.env.DB_UPDATE_LOG_USER,
      pass: process.env.DB_UPDATE_LOG_PASS
    },
    mongo: {
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASS,
      certFileName: 'client-cert.pem', // latest working for local debugging is 'lmru-ca.pem'
      keyFileName: 'client-key.pem' // latest working for local debugging is 'client-lmru-2020.pem'
    },
    delivery: {
      rabbitAuth: process.env.DELIVERY_RABBIT_AUTH
    },
    eligibilityOptions: {
      allStoresAuth: process.env.ELIGIBILITY_IN_ALL_STORES,
      reinitAllAuth: process.env.ELIGIBILITY_REINIT_ALL,
      reinitInRegionsAuth: process.env.ELIGIBILITY_REINIT_IN_REGIONS,
      reinitProductsInRegionsAuth: process.env.ELIGIBILITY_REINIT_PRODUCTS_IN_REGIONS
    },
    rabbitOptions: {
      auth: process.env.RABBIT_AUTH,
      certPath: '/ssl/rabbit'
    },
    maskrepositoryOptions: {
      auth: process.env.MASKREPOSITORY_AUTH
    },
    mediarepositoryOptions: {
      auth: process.env.MEDIAREPOSITORY_AUTH
    },
    akeneoOptions: {
      username: process.env.AKENEO_USER,
      password: process.env.AKENEO_PASS,
      initialAuthorization: process.env.AKENEO_AUTH
    },
    chordsOptions: {
      'x-api-key': process.env.CHORDS_X_API_KEY,
      jwksPrivateKey: process.env.CHORDS_JWKS_PRIVATE_KEY
    },
    contentHubOptions: {
      admin: process.env.CONTENT_HUB_ADMIN_AUTH
    },
    mappingCrudOptions: {
      admin: process.env.MAPPING_CRUD_ADMIN_AUTH
    },
    stagingAreaOptions: {
      admin: 'Basic YWRtaW46aDdeZ0RiMTNIYjg2Jg=='
    },
    productrepoOptions: {
      byRangeAuth: process.env.PRODUCTREPOSITORY_BY_RANGE_AUTH
    },
    pricerepositoryOptions: {
      auth: process.env.PRICEREPOSITORY_AUTH
    },
    storerepoOptions: {
      auth: process.env.STOREREPO_AUTH
    },
    receiver: {
      auth: process.env.RECEIVER_AUTH
    },
    familyOptions: {
      auth: process.env.FAMILY_AUTH,
      editorAuth: process.env.FAMILY_EDITOR_AUTH
    },
    variantsOptions: {
      auth: process.env.VARIANTS_AUTH
    },
    artmagRepoOptions: {
      auth: process.env.ARTMAGREPOSITORY_AUTH
    },
    substitutesOptions: {
      auth: process.env.SUBSTITUTES_AUTH
    },
    visibilityOptions: {
      auth: process.env.VISIBILITY_AUTH
    },
    complementsOptions: {
      auth: process.env.COMPLEMENTS_AUTH
    },
    suggestionsOptions: {
      auth: process.env.SUGGESTIONS_AUTH
    },
    elasticsearchOptions: {
      auth: process.env.SE_ELASTICSEARCH_AUTH
    },
    queues: {
      deliveryStoreEligibility: 'delivery.availability.store.eligibility',
      deliveryProductEligibility: 'delivery.availability.product.eligibility',
      visibilityEligibility: 'visibility.eligibility',
      regionVisibility: 'region.visibility',
      storeEligibility: 'store.eligibility',
      storeStockRepository: 'store.stockRepository',
      eligibilityCommand: 'eligibility-command.recalculate',
      priceOrigin: 'originPrice.priceRepository',
      priceStore: 'store.priceRepository',
      priceRegion: 'region.priceRepository',
      priceNewDay: 'store_newday.priceRepository',
      productRepo: 'originProductItem.productrepository',
      stockEligibility: 'stock.eligibility',
      productFamily: 'productItem.family',
      originProductItemFeatureProductrepo: 'originProductItemFeature.productrepository',
      originProductItemProductrepo: 'originProductItem.productrepository',
      familyProduct: 'family.productrepository',
      familyRecalculation: 'familyRecalculation.family',
      productItemVisibility: 'productItem.visibility',
      priceInRegionDeactivationVisibility: 'priceInRegion.deactivation.visibility',
      priceInRegionActivationVisibility: 'priceInRegion.activation.visibility',
      familyVisibility: 'family.visibility',
      mediaVisibility: 'media.visibility',
      productItemChords: 'productItem.chords-management'
    },
    exchanges: {
      store: 'store',
      stock: 'stock',
      visibility: 'visibility',
      region: 'region',
      newDay: 'store_newday',
      storeEligibility: 'storeEligibility.output',
      originStock: 'originStock',
      originProductItem: 'originProductItem',
      priceOrigin: 'originPrice',
      familyRecalculation: 'familyRecalculation'
    },
    topics: {
      stockAvailability: 'eligibility_stock',
      complementsGenerator: 'data.search.complements.json.test',
      substitutes: 'data.search.substitutes.json.test'
    },
    vhosts: {
      delivery: '/'
    }
  },

  PROD: {
    opus: 'https://webtopdata2.lmru.opus.adeo.com:5000',
    searchEngine: 'https://apps-emb.lmru.adeo.com/opus/api/search-engine',
    family: 'http://prulmcoembo05.int.adeo.com:11200',
    eligibility: 'http://prulmcoembo01.int.adeo.com:11037'
  },

  PROD_A: {
    searchEngine: 'https://apps-emb.lmru.adeo.com/opus/api/search-engine-a'
  },

  PROD_B: {
    searchEngine: 'https://apps-emb.lmru.adeo.com/opus/api/search-engine-b'
  },

  PPROD: {
    opus: 'https://aopus-core2.lmru.opus.adeo.com:3000',
    db: {
      host: 'arulmcoembb03.int.adeo.com',
      port: '11090',
      dbName: 'opus'
    },
    dbOpusRegress: {
      host: 'arulmdbopui21.int.adeo.com',
      port: '5432',
      dbName: 'opus'
    },
    dbStoreRepo: {
      host: 'arulmcoembb02.int.adeo.com',
      port: '6432',
      dbName: 'storerepository'
    },
    productrepository: 'https://aapps-emb.lmru.adeo.com/opus/api',
    searchEngine: 'https://aapps-emb.lmru.adeo.com/opus/api/search-engine',
    elasticSearch: 'http://o-elastic-db-5.p-search-engine-827.x2.cloud.lmru.tech:9200',
    suggestions: 'https://aapps-emb.lmru.adeo.com/opus/api/search-suggestions',
    searchScore: 'http://arulmcoembo04.int.adeo.com:11170',
    searchCustomSorts: 'http://arulmcoembo05.int.adeo.com:11171',
    rabbit: 'http://arulmcoembb01.int.adeo.com:11095',
    kafka: 'o-kfkstr-st02.hq.ru.corp.leroymerlin.com:9092',
    family: 'http://arulmcoembo08.int.adeo.com:11200',
    families: 'http://arulmcoembo01.int.adeo.com:11046/v1',
    eligibility: 'http://arulmcoembo01.int.adeo.com:11037',
    visibility: 'http://arulmcoembo05.int.adeo.com:11130',
    stockrepository: 'http://arulmcoembo03.int.adeo.com:11034',
    storeRepo: 'http://arulmcoembo05.int.adeo.com:11137',
    orchestrator: 'https://aapps-emb.lmru.adeo.com/opus/api',
    maskrepository: 'http://arulmcoembo02.int.adeo.com:11054',
    pricerepository: 'http://arulmcoembo02.int.adeo.com:11134',
    delivery: {
      rabbit: 'http://arulmcoembr01.int.adeo.com:11292',
      home: 'http://arulmcoembw10.int.adeo.com:10214',
      pickup: 'http://arulmcoembw09.int.adeo.com:10217',
      pickupPoint: 'http://arulmcoembw09.int.adeo.com:10229'
    },
    streams: {
      akeneo: 'https://akeneo-stage-marketplace-stage.apps.lmru.tech',
      mas: 'https://assortment-service-api-marketplace-stage.apps.lmru.tech'
    }
  },

  PPROD_05: {
    suggestions: 'http://arulmcoembo05.int.adeo.com:11183'
  },

  PPROD_A: {
    searchEngine: 'https://aapps-emb.lmru.adeo.com/opus/api/search-engine-a',
    elasticSearch: 'http://o-elastic-db-1.p-search-engine-827.x2.cloud.lmru.tech:9200',
    suggestions: 'https://aapps-emb.lmru.adeo.com/opus/api/search-suggestions-a',
    searchScore: 'http://arulmcoembo07.int.adeo.com:11170'
  },

  PPROD_B: {
    searchEngine: 'https://aapps-emb.lmru.adeo.com/opus/api/search-engine-b',
    elasticSearch: 'http://o-elastic-db-2.p-search-engine-827.x2.cloud.lmru.tech:9200',
    suggestions: 'https://aapps-emb.lmru.adeo.com/opus/api/search-suggestions-b',
    searchScore: 'http://arulmcoembo05.int.adeo.com:11170'
  },

  PERF: {
    opus: 'https://aopus-core2.lmru.opus.adeo.com:3000',
    db: {
      host: 'arulmcoembb23.int.adeo.com',
      port: '11090',
      dbName: 'opus'
    },
    dbStoreRepo: {
      host: 'arulmcoembb22.int.adeo.com',
      port: '6432',
      dbName: 'storerepository'
    },
    productrepository: 'https://arulmcoembn01.int.adeo.com/lopus-perf/api',
    searchEngine: 'https://aapps-emb.lmru.adeo.com/lopus-perf/api/search-engine',
    suggestions: 'https://aapps-emb.lmru.adeo.com/lopus-perf/api/search-suggestions',
    rabbit: 'http://arulmcoembb22.int.adeo.com:11095',
    family: 'http://arulmcoembo21.int.adeo.com:11200',
    families: 'http://arulmcoembo21.int.adeo.com:11046/v1',
    eligibility: 'https://arulmcoembn01.int.adeo.com/lopus-perf/api/productEligibility',
    visibility: 'https://arulmcoembn01.int.adeo.com/lopus-perf/api',
    stockrepository: 'https://arulmcoembn01.int.adeo.com/lopus-perf/api',
    storerepository: 'https://arulmcoembn01.int.adeo.com/lopus-perf/api',
    orchestrator: 'https://arulmcoembn01.int.adeo.com/lopus-perf/api',
    translit: 'https://arulmcoembn01.int.adeo.com/lopus-perf/api',
    maskrepository: 'http://arulmcoembo22.int.adeo.com:11054',
    variants: 'https://arulmcoembn01.int.adeo.com/lopus-perf/api',
    pricerepository: 'http://arulmcoembo05.int.adeo.com:11134',
    artmag: 'http://arulmcoembo27.int.adeo.com:11011',
    complements: 'http://arulmcoembo22.int.adeo.com:11019',
    delivery: {
      rabbit: 'http://arulmcoembb22.int.adeo.com:11095',
      home: 'http://arulmcoembw10.int.adeo.com:10214',
      pickup: 'http://arulmcoembw09.int.adeo.com:10217',
      pickupPoint: 'http://arulmcoembw09.int.adeo.com:10229'
    },
    mongo: {
      host: 'orulmcoembo03.lmru.adeo.com:11102',
      certPath: '/ssl/mongo',
      certFileName: 'client-all.pem'
    }
  },

  TEST: {
    opus: 'https://rrulmcoopuc11.int.adeo.com:3000',
    db: {
      host: 'rrulmcoembb01.int.adeo.com',
      port: '11090',
      dbName: 'opus'
    },
    dbOpusRegress: {
      host: 'rrulmdbopui11.int.adeo.com',
      port: '5432',
      dbName: 'opus'
    },
    dbStoreRepo: {
      host: 'rrulmcoembb01.int.adeo.com',
      port: '6432',
      dbName: 'storerepository'
    },
    dbFamily: {
      host: 'rrulmcoembb01.int.adeo.com',
      port: '6432',
      dbName: 'family'
    },
    productrepository: 'https://rapps-emb.lmru.adeo.com/opus/api',
    searchEngine: 'https://rapps-emb.lmru.adeo.com/opus/api/search-engine',
    suggestions: 'http://search-suggestions',
    searchDefinitionSubstitutes: 'https://orchestrator-searchdemo-develop-apim-stage.apps.lmru.tech',
    rabbit: 'http://rrulmcoembb01.int.adeo.com:11093',
    kafka: 't-kfkstr-st01.hq.ru.corp.leroymerlin.com:9092',
    family: 'http://rrulmcoembo03.int.adeo.com:11200',
    families: 'http://rrulmcoembo01.int.adeo.com:11046/v1',
    eligibility: 'http://rrulmcoembo04.int.adeo.com:11037',
    visibility: 'http://rrulmcoembo03.int.adeo.com:11130',
    stockrepository: 'http://rrulmcoembo04.int.adeo.com:11034',
    storerepository: 'http://rrulmcoembo04.int.adeo.com:11137',
    orchestrator: 'https://rapps-emb.lmru.adeo.com/opus/api',
    variants: 'http://rrulmcoembo03.int.adeo.com:11179',
    maskrepository: 'http://rrulmcoembo04.int.adeo.com:11054',
    translit: 'https://opus-opus2-796-opp-stage.apps.lmru.tech',
    pricerepository: 'http://rrulmcoembo01.int.adeo.com:11134',
    artmag: 'http://rrulmcoembo05.int.adeo.com:11011',
    complements: 'http://rrulmcoembo02.int.adeo.com:11019',
    delivery: {
      rabbit: 'http://rrulmcoembr01.int.adeo.com:11292',
      home: 'http://rrulmcoembw08.int.adeo.com:10214',
      pickup: 'http://rrulmcoembw08.int.adeo.com:10217',
      pickupPoint: 'http://rrulmcoembw08.int.adeo.com:10229'
    },
    streams: {
      akeneo: 'https://akeneo-test-marketplace-dev.apps.lmru.tech',
      mas: 'https://assortment-service-api-marketplace-dev.apps.lmru.tech',
      topics: {
        modelRepository: {
          characteristicGroup: 'test-pim-cluster-INTERNAL-PIM-FRAS-P1-C2-PRODUCT-DESCRIPTIVE-CHARACTERISTIC-GROUP-UPDATE-LOG-V1',
          characteristic: 'dev-cluster-INTERNAL-PIM-FRAS-P1-C2-PRODUCT-DESCRIPTIVE-CHARACTERISTIC-UPDATE-LOG-V1',
          characteristicQualityRule: 'dev-cluster-INTERNAL-PIM-FRAS-P1-C2-PRODUCT-DESCRIPTIVE-CHARACTERISTIC-QUALITY-RULE-UPDATE-LOG-V1',
          category: 'test-pim-cluster-INTERNAL-PIM-FRAS-P1-C2-PRODUCT_MODEL_CATEGORY-UPDATE-LOG-V1',
          model: 'dev-cluster-INTERNAL-PIM-FRAS-P1-C2-PRODUCT-DESCRIPTIVE-MODEL-UPDATE-LOG-V1',
          value: 'dev-cluster-INTERNAL-PIM-FRAS-P1-C2-PRODUCT-DESCRIPTIVE-CHARACTERISTIC-VALUE-UPDATE-LOG-V1'
        },
        productRepository: {
          product: 'test-pim-cluster-INTERNAL-PIM-FRAS-P1-C2-PRODUCT-UPDATE-LOG-V1'
        }
      }
    }
  },

  TEST_A: {
    searchEngine: 'https://rapps-emb.lmru.adeo.com/opus/api/search-engine-a',
    akeneo: 'https://akeneo4-test-marketplace-dev.apps.lmru.tech'
  },

  TEST_B: {
    searchEngine: 'https://rapps-emb.lmru.adeo.com/opus/api/search-engine-b'
  },

  KUBER_PPROD: {
    searchCustomSorts: 'https://search-preprod-nav-stage.apps.lmru.tech/search-custom-sorts',
    searchEngine: 'https://search-preprod-nav-stage.apps.lmru.tech/search-engine',
    searchScore: 'https://search-preprod-nav-stage.apps.lmru.tech/search-scoring',
    suggestions: 'https://search-preprod-nav-stage.apps.lmru.tech/search-suggestions',
    elasticSearch: 'http://o-elastic-db-5.p-search-engine-827.x2.cloud.lmru.tech:9200',
    searchDataAnalyzer: 'https://search-preprod-nav-stage.apps.lmru.tech/search-data-analyzer',
    searchServices: 'https://search-preprod-nav-stage.apps.lmru.tech/search-services',
    searchSynonyms: 'https://search-preprod-nav-stage.apps.lmru.tech/search-synonyms',
    searchRecommendation: 'https://search-preprod-nav-stage.apps.lmru.tech/search-recommendation-collections'
  },

  KUBER: {
    db: {
      host: `postgresql.${process.env.NAMESPACE}`,
      dbName: 'opus'
    },
    dbStoreRepo: {
      host: `postgresql.${process.env.NAMESPACE}`,
      dbName: 'storerepository'
    },
    dbFamily: {
      host: `postgresql.${process.env.NAMESPACE}`,
      dbName: 'family'
    },
    dbChords: {
      host: `postgresql.${process.env.NAMESPACE}`,
      dbName: 'chords'
    },
    dbPimUpdateLog: {
      host: `postgresql.${process.env.NAMESPACE}`,
      dbName: 'pim_updatelog'
    },
    artmag: `http://artmagrepository.${process.env.NAMESPACE}`,
    productrepository: `http://productrepository.${process.env.NAMESPACE}`,
    searchCustomSorts: `http://search-custom-sorts.${process.env.NAMESPACE}`,
    searchEngine: `http://search-engine.${process.env.NAMESPACE}`,
    searchScore: `http://search-scoring.${process.env.NAMESPACE}`,
    suggestions: `http://search-suggestions.${process.env.NAMESPACE}`,
    elasticSearch: 'http://o-elastic-db-3.p-search-engine-827.x2.cloud.lmru.tech:9200',
    searchDataAnalyzer: `http://search-data-analyzer.${process.env.NAMESPACE}`,
    searchDefinitionSubstitutes: 'https://orchestrator-searchdemo-develop-apim-stage.apps.lmru.tech',
    searchServices: `http://search-services.${process.env.NAMESPACE}`,
    searchSynonyms: `http://search-synonyms.${process.env.NAMESPACE}`,
    searchRecommendation: `http://search-recommendation-collections.${process.env.NAMESPACE}`,
    rabbit: `http://rabbitmq-headless.${process.env.NAMESPACE}:15672`,
    rabbitDiscovery: `http://rabbitmq-headless.${process.env.NAMESPACE}:15672`,
    family: `http://family.${process.env.NAMESPACE}`,
    kafka: `kafka.${process.env.NAMESPACE}:9092`,
    eligibility: `http://eligibility-calculator.${process.env.NAMESPACE}`,
    visibility: `http://visibility.${process.env.NAMESPACE}`,
    stockrepository: `http://stockrepository.${process.env.NAMESPACE}`,
    storerepository: `http://storerepository.${process.env.NAMESPACE}`,
    orchestrator: `http://offerorchestrator.${process.env.NAMESPACE}`,
    variants: `http://variants.${process.env.NAMESPACE}`,
    pricerepository: `http://pricerepository.${process.env.NAMESPACE}`,
    translit: `http://transliteration.${process.env.NAMESPACE}`,
    maskrepository: `http://maskrepository.${process.env.NAMESPACE}`,
    mediarepository: `http://mediarepository.${process.env.NAMESPACE}`,
    complements: `http://search-complements-generator.${process.env.NAMESPACE}`,
    substitutes: `http://search-substitutes.${process.env.NAMESPACE}`,
    receivers: 'http:/',
    mountebank: `http://mountebank.${process.env.NAMESPACE}:2525`,
    streams: {
      contentHub: `http://content-hub.${process.env.NAMESPACE}`,
      stagingArea: 'https://staging-area-crud-dev-f5i63t.priv.nprd.pcdp.adeo.cloud',
      workerSequoya: `http://worker-sequoya.${process.env.NAMESPACE}`,
      chords: `http://chords-management.${process.env.NAMESPACE}`,
      mappingCrud: `http://mapping-crud.${process.env.NAMESPACE}`,
      modelRepository: `http://model-repository.${process.env.NAMESPACE}`,
      productRepository: `http://product-repository.${process.env.NAMESPACE}`,
      dataValidator: `http://data-validator.${process.env.NAMESPACE}`,
      productUpdater: `http://product-updater.${process.env.NAMESPACE}`,
      chordsBff: `http://chords-bff.${process.env.NAMESPACE}`,
      topics: {
        modelRepository: {
          characteristicGroup: 'characteristic_group_update_log',
          characteristic: 'dev-cluster-INTERNAL-PIM-FRAS-P1-C2-PRODUCT-DESCRIPTIVE-CHARACTERISTIC-UPDATE-LOG-V1',
          characteristicQualityRule: 'dev-cluster-INTERNAL-PIM-FRAS-P1-C2-PRODUCT-DESCRIPTIVE-CHARACTERISTIC-QUALITY-RULE-UPDATE-LOG-V1',
          category: 'product_model_category_update_log',
          model: 'dev-cluster-INTERNAL-PIM-FRAS-P1-C2-PRODUCT-DESCRIPTIVE-MODEL-UPDATE-LOG-V1',
          value: 'dev-cluster-INTERNAL-PIM-FRAS-P1-C2-PRODUCT-DESCRIPTIVE-CHARACTERISTIC-VALUE-UPDATE-LOG-V1'
        },
        productRepository: {
          product: 'product-update-topic'
        }
      }
    },
    delivery: {
      rabbit: `http://rabbitmq-headless.${process.env.NAMESPACE}:15672`
    },
    mongo: {
      host: `mongodb-headless.${process.env.NAMESPACE}:27017`,
      certPath: '/ssl/mongo'
    }
  },

  LOCAL_TO_KUBER: {
    artmag: `https://${process.env.HOSTNAME}/artmagrepository`,
    productrepository: `https://${process.env.HOSTNAME}/productrepository`,
    rabbit: `https://rabbitmq-${process.env.HOSTNAME}`,
    rabbitDiscovery: 'http://localhost:11096', // will require port forwarding, rabbitmq-headless
    family: `https://${process.env.HOSTNAME}/family`,
    kafka: 'localhost:9092', // is deployed to ns with external access, check ip address in services tab in kuber dashboard
    mediarepository: `https://${process.env.HOSTNAME}/mediarepository`,
    eligibility: `https://${process.env.HOSTNAME}/eligibility-calculator`,
    stockrepository: `https://${process.env.HOSTNAME}/stockrepository`,
    orchestrator: `https://${process.env.HOSTNAME}/offerorchestrator`,
    maskrepository: `https://${process.env.HOSTNAME}/maskrepository`,
    suggestions: `https://${process.env.HOSTNAME}/search-suggestions`,
    searchScore: `https://${process.env.HOSTNAME}/search-scoring`,
    searchCustomSorts: `https://${process.env.HOSTNAME}/search-custom-sorts`,
    searchEngine: `https://${process.env.HOSTNAME}/search-engine`,
    elasticSearch: 'http://o-elastic-db-4.p-search-engine-827.x2.cloud.lmru.tech:9200',
    searchDataAnalyzer: `https://${process.env.HOSTNAME}/search-data-analyzer`,
    searchServices: `https://${process.env.HOSTNAME}/search-services`,
    searchSynonyms: `https://${process.env.HOSTNAME}/search-synonyms`,
    searchRecommendation: `https://${process.env.HOSTNAME}/search-recommendation-collections`,
    receivers: `https://${process.env.HOSTNAME}/`,
    translit: `http://${process.env.HOSTNAME}/transliteration`,
    pricerepository: `https://${process.env.HOSTNAME}/pricerepository`,
    visibility: `https://${process.env.HOSTNAME}/visibility`,
    substitutes: `https://${process.env.HOSTNAME}/search-substitutes`,
    complements: `https://${process.env.HOSTNAME}/search-complements-generator`,
    variants: `https://${process.env.HOSTNAME}/variants`,
    storerepository: `https://${process.env.HOSTNAME}/storerepository`,
    streams: {
      contentHub: `https://${process.env.HOSTNAME}/content-hub`,
      workerSequoya: `https://${process.env.HOSTNAME}/worker-sequoya`,
      chords: `https://${process.env.HOSTNAME}/chords-management`,
      mappingCrud: `https://${process.env.HOSTNAME}/mapping-crud`,
      modelRepository: `https://${process.env.HOSTNAME}/model-repository`,
      productRepository: `https://${process.env.HOSTNAME}/product-repository`,
      dataValidator: `https://${process.env.HOSTNAME}/data-validator`,
      productUpdater: `https://${process.env.HOSTNAME}/product-updater`,
      chordsBff: `https://${process.env.HOSTNAME}/chords-bff`,
      topics: {
        modelRepository: {
          characteristicGroup: 'characteristic_group_update_log',
          characteristic: 'characteristic_update_log',
          characteristicQualityRule: 'dev-cluster-INTERNAL-PIM-FRAS-P1-C2-PRODUCT-DESCRIPTIVE-CHARACTERISTIC-QUALITY-RULE-UPDATE-LOG-V1',
          category: 'product_model_category_update_log',
          model: 'product_descriptive_model_update_log',
          value: 'characteristic_value_update_log'
        },
        productRepository: {
          product: 'product-update-topic'
        }
      }
    },
    mountebank: 'http://localhost:2525',
    delivery: {
      rabbit: `https://rabbitmq-${process.env.HOSTNAME}`
    },
    db: {
      host: 'localhost',
      dbName: 'opus'
    },
    dbStoreRepo: {
      host: 'localhost',
      dbName: 'storerepository'
    },
    dbFamily: {
      host: 'localhost',
      dbName: 'family'
    },
    dbChords: {
      host: 'localhost',
      dbName: 'chords',
      port: 5432,
      user: process.env.DB_CHORDS_USER,
      pass: process.env.DB_CHORDS_PASS
    },
    dbPimUpdateLog: {
      host: 'localhost',
      dbName: 'pim_updatelog',
      port: 6432,
      user: process.env.DB_UPDATE_LOG_USER,
      pass: process.env.DB_UPDATE_LOG_PASS
    },
    mongo: {
      host: 'localhost:10001', // specify mongodb-headless as a service when forward ports
      certPath: '<path_to_mongo_cert_folder>'
    }
  }
};

process.env.ENV = 'KUBER';

if (undefined !== process.env.ENV) {
  module.exports = merge(config[process.env.ENV], config.COMMON);
} else {
  throw new Error('ENV variable should be specified!');
}
