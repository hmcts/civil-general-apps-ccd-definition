#!/bin/bash
set -ex

echo "Running FE tests on tests on ${ENVIRONMENT} env"
yarn test:nightly-e2e-tests
