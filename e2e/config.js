const defaultPassword = 'Password12!';
const judgePassword = 'Hmcts1234';
const iacDefaultPassword = 'AldgateT0wer';

module.exports = {
  idamStub: {
    enabled: process.env.IDAM_STUB_ENABLED || false,
    url: 'http://localhost:5555'
  },
  url: {
  /*  manageCase: process.env.URL || 'http://localhost:3333',
    authProviderApi: process.env.SERVICE_AUTH_PROVIDER_API_BASE_URL || 'http://localhost:4502',
    ccdDataStore: process.env.CCD_DATA_STORE_URL || 'http://localhost:4452',
    dmStore: process.env.DM_STORE_URL || 'http://dm-store:8080',
    idamApi: process.env.IDAM_API_URL || 'http://localhost:5000',
    civilService: process.env.CIVIL_SERVICE_URL || 'http://localhost:4000',
    generalApplication: process.env.CIVIL_GENERAL_APPLICATIONS_URL  || 'http://localhost:4550',
    waTaskMgmtApi: process.env.WA_TASK_MGMT_URL || 'http://wa-task-management-api-aat.service.core-compute-aat.internal'*/

    // wa demo url's
    manageCase:  'https://manage-case-wa-int.demo.platform.hmcts.net/',
    authProviderApi: 'http://rpe-service-auth-provider-demo.service.core-compute-demo.internal',
    ccdDataStore: 'http://ccd-data-store-api-demo.service.core-compute-demo.internal',
    dmStore:'http://dm-store-demo.service.core-compute-demo.internal',
    idamApi: 'https://idam-api.demo.platform.hmcts.net',
    civilService: 'http://civil-service-demo.service.core-compute-demo.internal',
    waTaskMgmtApi: 'http://wa-task-management-api-demo.service.core-compute-demo.internal',
    generalApplication: 'http://civil-general-applications-demo.service.core-compute-demo.internal'
  },
  s2s: {
    microservice: 'civil_service',
    secret: process.env.S2S_SECRET || 'AABBCCDDEEFFGGHH'
  },
  s2sForXUI: {
    microservice: 'xui_webapp',
    secret: process.env.XUI_S2S_SECRET || 'AABBCCDDEEFFGGHH'
  },
  judgeLocalUser: {
    password: defaultPassword,
    email: '4924246EMP-@ejudiciary.net',
    type: 'judge',
    roleCategory: 'JUDICIAL',
    regionId: '4'
  },
  judgeUser: {
    password: judgePassword,
    email: '4924246EMP-@ejudiciary.net',
    type: 'judge',
    roleCategory: 'JUDICIAL',
    regionId: '4'
  },
  applicantSolicitorUser: {
    password: defaultPassword,
    email: 'hmcts.civil+organisation.1.solicitor.1@gmail.com',
    type: 'applicant_solicitor'
  },
  defendantSolicitorUser: {
    password: defaultPassword,
    email: 'hmcts.civil+organisation.2.solicitor.1@gmail.com',
    type: 'defendant_solicitor'
  },
  secondDefendantSolicitorUser: {
    password: defaultPassword,
    email: 'hmcts.civil+organisation.3.solicitor.1@gmail.com',
    type: 'defendant_solicitor'
  },
  judgeUserWithRegionId1:
  // local env does not have the same users than preview/demo/etc
    process.env.ENVIRONMENT ? {
      password: judgePassword,
      email: '4917924EMP-@ejudiciary.net',
      type: 'judge',
      roleCategory: 'JUDICIAL',
      regionId: '1'
    } : {
      password: defaultPassword,
      email: 'judge-civil-02@example.com',
      type: 'judge',
      roleCategory: 'JUDICIAL',
      regionId: '1'
    },
  judgeUserWithRegionId4: {
    password: judgePassword,
    email: '4925359EMP-@ejudiciary.net',
    type: 'judge',
    roleCategory: 'JUDICIAL',
    regionId: '4'
  },
  hearingCenterAdminWithRegionId1: {
    email: 'ga_hearing_centre_admin_r1@justice.gov.uk',
    password: defaultPassword,
    type: 'hearing-center-admin',
    roleCategory: 'ADMIN',
    regionId: '1'
  },
  tribunalCaseworkerWithRegionId4: {
    email: 'tribunal_caseworker_region4@justice.gov.uk',
    password: defaultPassword,
    type: 'tribunal-caseworker',
    roleCategory: 'LEGAL_OPERATIONS',
    regionId: '4'
  },
  tribunalCaseworkerWithRegionId: {
    email: 'ga_tribunal_legal_caseworker_national@justice.gov.uk',
    password: defaultPassword,
    type: 'tribunal-caseworker',
    roleCategory: 'LEGAL_OPERATIONS',
    regionId: '1'
  },
  nbcAdminWithRegionId4: {
    email: 'CIVIL_WA_func_test_demo_user10@justice.gov.uk',
    password: defaultPassword,
    type: 'national-business-centre',
    roleCategory: 'ADMIN',
    regionId: '4'
  },
  nbcAdminWithRegionId1: {
    email: 'ga_nbc_admin_national@justice.gov.uk',
    password: defaultPassword,
    type: 'national-business-centre',
    roleCategory: 'ADMIN',
    regionId: '1'
  },
  adminUser: {
    password: defaultPassword,
    email: 'civil-admin@mailnesia.com',
    type: 'admin'
  },
  definition: {
    jurisdiction: 'CIVIL',
    caseType: 'CIVIL',
    caseTypeGA: 'GENERALAPPLICATION'
  },
  iacLeadershipJudge: {
    password: judgePassword,
    email: '330127EMP-@ejudiciary.net',
    type: 'judge',
    roleCategory: 'JUDICIAL'
  },
  iacLegalOpsUser: {
    password: iacDefaultPassword,
    email: 'CRD_func_test_demo_stcwuser1@justice.gov.uk',
    type: 'legalOps',
    roleCategory: 'LEGAL_OPERATIONS'
  },
  iacAdminUser: {
    password: iacDefaultPassword,
    email: 'CRD_func_test_demo_adm21@justice.gov.uk',
    type: 'admin',
    roleCategory: 'ADMIN'
  },
  waTaskIds: {
    nbcUserReviewGA :'ReviewApplication',
    judgeDecideOnApplication: 'JudgeDecideOnApplication',
    legalAdvisorDecideOnApplication: 'LegalAdvisorDecideOnApplication',
    scheduleApplicationHearing: 'ScheduleApplicationHearing',
    reviewApplicationOrder: 'ReviewApplicationOrder',
    judgeRevisitApplication: 'JudgeRevisitApplication',
    reviewRevisitedApplication: 'ReviewRevisitedApplication',
    legalAdvisorRevisitApplication: 'LegalAdvisorRevisitApplication',
    reviewSpecificAccessRequestJudiciary: 'reviewSpecificAccessRequestJudiciary',
    reviewSpecificAccessRequestLegalOps: 'reviewSpecificAccessRequestLegalOps',
    reviewSpecificAccessRequestAdmin: 'reviewSpecificAccessRequestAdmin',
  },
  TestOutputDir: process.env.E2E_OUTPUT_DIR || 'test-results/functional',
  TestForAccessibility: process.env.TESTS_FOR_ACCESSIBILITY === 'true',
  runningEnv: process.env.ENVIRONMENT,
  runWAApiTest: process.env.RUN_WA_API_TEST == 'true' || false,
  claimantSolicitorOrgId: process.env.ENVIRONMENT == 'demo' ? 'B04IXE4' : 'Q1KOKP2',
  defendant1SolicitorOrgId: process.env.ENVIRONMENT == 'demo' ? 'DAWY9LJ' : '79ZRSOU',
  defendant2SolicitorOrgId: process.env.ENVIRONMENT =='demo' ? 'LCVTI1I' : 'H2156A0',
  claimantSelectedCourt: 'Central London County Court - THOMAS MORE BUILDING, ROYAL COURTS OF JUSTICE, STRAND, LONDON - WC2A 2LL',
  defendantSelectedCourt: 'Central London County Court - THOMAS MORE BUILDING, ROYAL COURTS OF JUSTICE, STRAND, LONDON - WC2A 2LL',
  defendant2SelectedCourt: 'Barnet Civil and Family Centre - ST MARY\'S COURT, REGENTS PARK ROAD - N3 1BQ',
};
