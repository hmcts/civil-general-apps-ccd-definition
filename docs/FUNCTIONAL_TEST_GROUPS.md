# Functional Test Groups

This document describes the functional test groups and GitHub labels used to run specific test suites in the CI/CD pipeline.

## Overview

Functional tests are organized into groups based on functionality. You can run specific test groups by applying GitHub labels to your Pull Request.

## Available Functional Test Groups

### 1. After SDO Orders Tests (`@after-sdo-orders`)
- **GitHub Label**: `pr_ft_after-sdo-orders`
- **Description**: Tests for General Application orders after Standard Directions Order (SDO)
- **Command**: `yarn test:ft-after-sdo-orders`
- **Test Files**:
  - Tests tagged with `@after-sdo-orders`

### 2. Before SDO Orders Tests (`@before-sdo-orders`)
- **GitHub Label**: `pr_ft_before-sdo-orders`
- **Description**: Tests for General Application orders before Standard Directions Order (SDO)
- **Command**: `yarn test:ft-before-sdo-orders`
- **Test Files**:
  - Tests tagged with `@before-sdo-orders`

### 3. Before SDO General Tests (`@before-sdo-general`)
- **GitHub Label**: `pr_ft_before-sdo-general`
- **Description**: General tests for scenarios before Standard Directions Order (SDO)
- **Command**: `yarn test:ft-before-sdo-general`
- **Test Files**:
  - Tests tagged with `@before-sdo-general`

### 4. Before SDO Work Allocation Tests (`@before-sdo-wa`)
- **GitHub Label**: `pr_ft_before-sdo-wa`
- **Description**: Work Allocation tests for scenarios before Standard Directions Order (SDO)
- **Command**: `yarn test:ft-before-sdo-wa`
- **Test Files**:
  - Tests tagged with `@before-sdo-wa`

## How to Use

### Running Specific Test Groups in PRs

1. Add one or more GitHub labels to your PR:
   - `pr_ft_after-sdo-orders` - Run After SDO Orders tests
   - `pr_ft_before-sdo-orders` - Run Before SDO Orders tests
   - `pr_ft_before-sdo-general` - Run Before SDO General tests
   - `pr_ft_before-sdo-wa` - Run Before SDO Work Allocation tests

2. The CI pipeline will automatically detect these labels and run only the specified test groups.

3. You can combine multiple labels to run multiple test groups:
   - Example: Adding both `pr_ft_after-sdo-orders` and `pr_ft_before-sdo-orders` will run both test groups

### Running All Tests

To run all functional tests regardless of labels, add the `runAllFunctionalTests` label to your PR.

### Running Tests Locally

You can run specific test groups locally using the following commands:

```bash
# Run After SDO Orders tests
yarn test:ft-after-sdo-orders

# Run Before SDO Orders tests
yarn test:ft-before-sdo-orders

# Run Before SDO General tests
yarn test:ft-before-sdo-general

# Run Before SDO Work Allocation tests
yarn test:ft-before-sdo-wa

# Run all functional tests
yarn test:e2e-nonprod
```

## Test Tagging Convention

All functional tests use the following tagging convention:

- `@regression` - Marks the test as a regression test
- `@after-sdo-orders` - After SDO Orders test
- `@before-sdo-orders` - Before SDO Orders test
- `@before-sdo-general` - Before SDO General test
- `@before-sdo-wa` - Before SDO Work Allocation test

Example:
```javascript
Feature('Before SDO GA - Orders @regression');

Scenario('GA order before SDO @e2e-tests @regression @before-sdo-orders', async ({ I, api }) => {
  // Test implementation
});
```

## Implementation Details

### Jenkinsfile_CNP

The `getFunctionalTestsGroups()` function extracts GitHub labels starting with `pr_ft_` and passes them to the test runner:

```groovy
def getFunctionalTestsGroups() {
  def githubApi = new GithubAPI(this)
  def functionalTestGroups = []
  for (label in githubApi.getLabelsbyPattern(env.BRANCH_NAME, "pr_ft_")) {
    functionalTestGroups.add(label.substring(6, label.length()))
  }
  return functionalTestGroups.join(",")
}
```

### run-functional-tests.sh

The script builds a regex pattern to match tests with both `@regression` and the specific group tag:

```bash
run_functional_test_groups() {
  pr_ft_groups=$(echo "$PR_FT_GROUPS" | awk '{print tolower($0)}')
  
  regex_pattern=""
  IFS=',' read -ra ft_groups_array <<< "$pr_ft_groups"

  for ft_group in "${ft_groups_array[@]}"; do
      if [ -n "$regex_pattern" ]; then
          regex_pattern+="|"
      fi
      regex_pattern+="((?=.*@regression)(?=.*@$ft_group))"
  done

  command="yarn test:e2e-nonprod --grep '$regex_pattern'"
  eval "$command"
}
```

## Adding New Test Groups

To add a new functional test group:

1. **Tag your tests** with the appropriate tags:
   ```javascript
   Feature('My Feature @regression');
   Scenario('My test @e2e-tests @regression @mygroup', async ({ I, api }) => {
     // Test implementation
   });
   ```

2. **Add a new npm script** in `package.json`:
   ```json
   "test:ft-mygroup": "MOCHAWESOME_REPORTFILENAME=ft-mygroup FUNCTIONAL=true npx codeceptjs run-workers --suites 10 --grep '((?=.*@regression)(?=.*@mygroup))' --reporter mocha-multi --verbose"
   ```

3. **Create a GitHub label**: `pr_ft_mygroup`

4. **Update this documentation** to include the new test group

## Troubleshooting

### Tests not running with label

- Ensure the label follows the pattern `pr_ft_<groupname>`
- Verify the test files have both `@regression` and `@<groupname>` tags
- Check the Jenkins console output for the regex pattern being used

### All tests running instead of specific group

- Verify the `PR_FT_GROUPS` environment variable is set correctly in Jenkinsfile_CNP
- Check that the label was applied before the build started
- Ensure the `runAllFunctionalTests` label is not present on the PR
