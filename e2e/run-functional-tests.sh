#!/bin/bash
set -ex

echo "Running Functional tests on ${ENVIRONMENT} env"

if [ ${ENVIRONMENT} == preview ] || [ ${ENVIRONMENT} == demo ]
then
  yarn test:functional
else
  yarn test
fi
