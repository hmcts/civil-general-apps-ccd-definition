# Functional Test Groups Implementation Summary

This document summarizes the changes made to implement functional test grouping with GitHub label-based test execution.

## Changes Made

### 1. Test File Updates

Updated test files to include appropriate tags for functional test grouping:

#### Files Modified (Examples):
- `e2e/tests/ui_tests/ga_smoke_test.js`
  - Added `@ga` tags
  
- `e2e/tests/ui_tests/cp_tests/1v1GeneralApplication_test.js`
  - Added `@ga` tags to all scenarios
  
- `e2e/tests/ui_tests/multiparty-ga-tests/1v2_ConsentOrders_test.js`
  - Added `@multiparty` tags
  
- `e2e/tests/ui_tests/wa_tests/1v1_Unspec_GA_WA_scheduleHearing_test.js`
  - Added `@wa` tags to all scenarios

### 2. Package.json Updates

Added new npm scripts for running specific functional test groups:

```json
"test:e2e-after-sdo-orders": "MOCHAWESOME_REPORTFILENAME=e2e-after-sdo-orders FUNCTIONAL=true npx codeceptjs run-workers --suites 10 --grep @e2e-after-sdo-orders --reporter mocha-multi --verbose",
"test:e2e-before-sdo-orders": "MOCHAWESOME_REPORTFILENAME=e2e-before-sdo-orders FUNCTIONAL=true npx codeceptjs run-workers --suites 10 --grep @e2e-before-sdo-orders --reporter mocha-multi --verbose",
"test:e2e-before-sdo-general": "MOCHAWESOME_REPORTFILENAME=e2e-before-sdo-general FUNCTIONAL=true npx codeceptjs run-workers --suites 10 --grep @e2e-before-sdo-general --reporter mocha-multi --verbose",
"test:e2e-before-sdo-wa": "MOCHAWESOME_REPORTFILENAME=e2e-before-sdo-wa FUNCTIONAL=true npx codeceptjs run-workers --suites 10 --grep @e2e-before-sdo-wa --reporter mocha-multi --verbose"
```

### 3. Jenkinsfile_CNP Updates

Added functional test group detection logic:

```groovy
def getFunctionalTestsGroups() {
  def githubApi = new GithubAPI(this)
  def functionalTestGroups = []
  for (label in githubApi.getLabelsbyPattern(env.BRANCH_NAME, "pr_ft_")) {
    functionalTestGroups.add(label.substring(6, label.length()))
  }
  return functionalTestGroups.join(",")
}

env.PR_FT_GROUPS = getFunctionalTestsGroups()
```

Updated the `onPR` section to set the `PR_FT_GROUPS` environment variable:

```groovy
onPR {
    // ... existing config ...
    env.PR_FT_GROUPS = getFunctionalTestsGroups()
    loadVaultSecrets(secrets);
}
```

### 4. Documentation

Created comprehensive documentation:

- **docs/FUNCTIONAL_TEST_GROUPS.md**: Complete guide on functional test groups, GitHub labels, and usage
- **README.md**: Updated with functional test groups section and link to detailed documentation
- **docs/IMPLEMENTATION_SUMMARY.md**: This file - summary of all changes

## GitHub Labels to Create

The following GitHub labels should be created in the repository:

1. `pr_ft_after-sdo-orders` - Run After SDO Orders tests
2. `pr_ft_before-sdo-orders` - Run Before SDO Orders tests
3. `pr_ft_before-sdo-general` - Run Before SDO General tests
4. `pr_ft_before-sdo-wa` - Run Before SDO Work Allocation tests

## Test Group Definitions

### After SDO Orders Tests (@e2e-after-sdo-orders)
- General Application orders after Standard Directions Order (SDO)
- Post-SDO order workflows

### Before SDO Orders Tests (@e2e-before-sdo-orders)
- General Application orders before Standard Directions Order (SDO)
- Pre-SDO order workflows

### Before SDO General Tests (@e2e-before-sdo-general)
- General scenarios before Standard Directions Order (SDO)
- Pre-SDO general workflows

### Before SDO Work Allocation Tests (@e2e-before-sdo-wa)
- Work Allocation scenarios before Standard Directions Order (SDO)
- Pre-SDO WA task management

## How It Works

1. **Developer adds GitHub label** to PR (e.g., `pr_ft_after-sdo-orders`)
2. **Jenkinsfile detects label** via `getFunctionalTestsGroups()` function
3. **Environment variable set**: `PR_FT_GROUPS=after-sdo-orders`
4. **run-functional-tests.sh** builds regex pattern: `@e2e-after-sdo-orders`
5. **CodeceptJS runs** only tests matching the `@e2e-after-sdo-orders` tag

## Benefits

1. **Faster CI/CD**: Run only relevant tests for your changes
2. **Flexible**: Combine multiple labels to run multiple test groups
3. **Maintainable**: Easy to add new test groups
4. **Consistent**: Follows the same pattern as the reference repository

## Next Steps

To complete the implementation:

1. **Create GitHub labels** in the repository settings:
   - `pr_ft_after-sdo-orders`
   - `pr_ft_before-sdo-orders`
   - `pr_ft_before-sdo-general`
   - `pr_ft_before-sdo-wa`

2. **Verify all test files** has appropriate group tag

3. **Test the implementation** by:
   - Creating a test PR
   - Adding a functional test group label
   - Verifying only the specified tests run

4. **Monitor and adjust** based on team feedback

## Maintenance

When adding new tests:

1. Add appropriate tags to the Feature and Scenario declarations
2. Ensure the group tag (e.g., `@e2e-after-sdo-orders`) are present
3. Update documentation if creating a new test group

## Comparison with Reference Implementation

This implementation follows the same pattern as the reference repository:

- ✅ GitHub labels with `pr_ft_` prefix
- ✅ Conditional execution in shell script
- ✅ Jenkinsfile integration with GithubAPI
- ✅ Support for multiple test groups via comma-separated labels

## Files Modified

1. `e2e/tests/ui_tests/ga_smoke_test.js` (example)
2. `e2e/tests/ui_tests/cp_tests/1v1GeneralApplication_test.js` (example)
3. `e2e/tests/ui_tests/multiparty-ga-tests/1v2_ConsentOrders_test.js` (example)
4. `e2e/tests/ui_tests/wa_tests/1v1_Unspec_GA_WA_scheduleHearing_test.js` (example)
5. `package.json`
6. `Jenkinsfile_CNP`
8. `README.md`

## Files Created

1. `docs/FUNCTIONAL_TEST_GROUPS.md`
2. `docs/IMPLEMENTATION_SUMMARY.md`
