#!/bin/bash
set -ex

echo "Running Nightly Functional tests on ${ENVIRONMENT} env"

if [ ${ENVIRONMENT} == demo ]; then
  yarn test:fullfunctional
else
  yarn test
fi
