#!/bin/bash
set -ex

echo "Running FE tests on tests on ${ENVIRONMENT} env"


echo "Running API tests on tests on ${ENVIRONMENT} env"
yarn test:api
