#!/bin/bash
set -ex

export CCD_UI_TESTS=true

echo "Running FE tests on tests on ${ENVIRONMENT} env"
yarn test:regression-e2e-tests
