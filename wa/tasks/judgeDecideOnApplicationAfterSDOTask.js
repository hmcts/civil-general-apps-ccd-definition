module.exports = {
  name: 'Application for multiple types',
  type: 'JudgeDecideOnApplication',
  task_title: 'Application for multiple types',
  location_name: '???',
  location: '???',
  execution_type: 'Case Management Task',
  jurisdiction: 'CIVIL',
  region: '???',
  case_type_id: 'GENERALAPPLICATION',
  case_category: 'Civil',
  auto_assigned: false,
  case_management_category: 'Civil',
  work_type_id: 'decision_making_work',
  work_type_label: '???',
  permissions: { values: [ 'Read', 'Own', 'Manage', 'Cancel' ] },
  description: '[JudgeDecideOnApplication](/cases/case-details/${[CASE_REFERENCE]}/trigger/MAKE_DECISION/MAKE_DECISIONGAJudicialDecision)',
  role_category: 'JUDICIAL'
};
