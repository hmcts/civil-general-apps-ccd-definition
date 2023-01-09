#!/bin/bash
set -ex

echo "Running Smoke tests on ${ENVIRONMENT} env"

if [ ${ENVIRONMENT} == preview ] || [ ${ENVIRONMENT} == demo ]; then
  yarn test:smoke
else
  yarn test
fi
