#!/bin/bash
set -ex

echo "Running FE regression tests on ${ENVIRONMENT} env"
if [ ${ENVIRONMENT} == aat ]; then
  yarn playwright-install
  yarn test:regression-e2e-tests
fi
