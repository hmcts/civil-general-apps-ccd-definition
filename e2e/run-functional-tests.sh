#!/bin/bash
set -ex

export CCD_UI_TESTS=true
if [ ${ENVIRONMENT} == preview ]; then
  echo "Running FE tests on tests on ${ENVIRONMENT} env"
  yarn test:e2e-multiparty
else
  echo "Running FE tests on tests on ${ENVIRONMENT} env"
  yarn test:master-e2e-tests
  echo "Running API tests on tests on ${ENVIRONMENT} env"
  yarn test:api
fi
