#!/bin/bash
set -ex

echo "Running FE and API tests on tests on ${ENVIRONMENT} env"
# this requires update later on when we need different tests to run on each environment. .for example enhancements test only on preview

if [ ${ENVIRONMENT} == preview ]; then
  yarn test:non-prod-e2e-tests
else
  yarn test:master-e2e-tests
  yarn test:api
fi
