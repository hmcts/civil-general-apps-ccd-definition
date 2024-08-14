#!/bin/bash
set -ex

export CCD_UI_TESTS=true
if [ ${ENVIRONMENT} == aat ]; then
  echo "Running FE tests on tests on ${ENVIRONMENT} env"
  yarn test:master-e2e-tests
  echo "Running non prod tests on tests on ${ENVIRONMENT} env"
  yarn test:apie2e-nonprod
  echo "Running API tests on tests on ${ENVIRONMENT} env"
  yarn test:api
else
  echo "Running FE regression tests on ${ENVIRONMENT} env"
  yarn test:regression-e2e-tests
fi
