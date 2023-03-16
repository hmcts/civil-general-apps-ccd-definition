#!/bin/bash
set -ex

echo "Running FE and API tests on tests on ${ENVIRONMENT} env"
# this requires update later on when we need different tests to run on each environment. .for example non-prod test only on preview
yarn test:api
