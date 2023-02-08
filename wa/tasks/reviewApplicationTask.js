module.exports = {
    name: 'Review Application for multiple types',
    type: 'ReviewApplication',
    task_title: 'Review Application for multiple types',
    location_name: 'County Court Money Claims Centre',
    location: '192280',
    execution_type: 'Case Management Task',
    jurisdiction: 'CIVIL',
    region: '4',
    case_type_id: 'GENERALAPPLICATION',
    case_category: 'Civil',
    auto_assigned: false,
    case_management_category: 'Civil',
    work_type_id: 'routine_work',
    work_type_label: 'Routine work',
    permissions: { values: [ 'Read', 'Own', 'Manage', 'Cancel', 'Complete', 'Claim', 'Assign', 'Unassign' ] },
    description: '[ReviewApplication](/cases/case-details/${[CASE_REFERENCE]})',
    role_category: 'ADMIN'
};
