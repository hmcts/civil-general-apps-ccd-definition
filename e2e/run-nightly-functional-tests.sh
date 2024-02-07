#!/bin/bash
set -ex

echo "Running FE regression tests on ${ENVIRONMENT} env"
yarn playwright install
if [ ${ENVIRONMENT} == demo ]; then
  yarn test:regression-e2e-tests
fi
