#!/bin/bash
set -ex

echo "Running API tests on tests on ${ENVIRONMENT} env"
yarn test:e2e-multiparty
