const defaultPassword = 'Password12!';
const judgePassword = 'Hmcts1234';

module.exports = {
  idamStub: {
    enabled: process.env.IDAM_STUB_ENABLED || false,
    url: 'http://localhost:5555'
  },
  url: {
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
  hearingCenterAdminWithRegionId4: {
    email: 'hearing_center_admin_region4@justice.gov.uk',
    password: defaultPassword,
    type: 'hearing-center-admin',
    roleCategory: 'ADMIN',
    regionId: '4'
  },
  tribunalCaseworkerWithRegionId4: {
    email: 'tribunal_caseworker_region4@justice.gov.uk',
    password: defaultPassword,
    type: 'tribunal-caseworker',
    roleCategory: 'LEGAL_OPERATIONS',
    regionId: '4'
  },
  nbcAdminWithRegionId4: {
    email: 'CIVIL_WA_func_test_demo_user10@justice.gov.uk',
    password: defaultPassword,
    type: 'national-business-centre',
    roleCategory: 'ADMIN',
    regionId: '4'
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
  waTaskIds: {
    nbcUserReviewGA :'ReviewApplication',
    listingOfficerCaseProgressionTask: 'transferCaseOffline',
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
