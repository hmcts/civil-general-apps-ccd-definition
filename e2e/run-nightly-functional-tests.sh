#!/bin/bash
set -ex

echo "Running Nightly FE tests on ${ENVIRONMENT} env"
if [ ${ENVIRONMENT} == demo ]; then
  yarn test:nightly-e2e-tests
fi
