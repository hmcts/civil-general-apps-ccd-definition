#!/bin/bash
set -ex

echo "Running FE tests on tests on ${ENVIRONMENT} env"
yarn test:master-e2e-tests

