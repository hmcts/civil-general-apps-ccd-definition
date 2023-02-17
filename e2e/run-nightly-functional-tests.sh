#!/bin/bash
set -ex

echo "Running Nightly FE and API tests on ${ENVIRONMENT} env"
if [ ${ENVIRONMENT} == demo ]; then
  yarn test:nightly-e2e-tests
  yarn test:nightly-api-tests
fi
