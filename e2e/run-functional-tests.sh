#!/bin/bash
set -ex

export CCD_UI_TESTS=true
if [ ${ENVIRONMENT} == preview ]; then
  echo "Running non prod tests on tests on ${ENVIRONMENT} env"
  yarn test:e2e-nonprod
else
  echo "Running FE tests on tests on ${ENVIRONMENT} env"
  yarn test:master-e2e-tests
fi
