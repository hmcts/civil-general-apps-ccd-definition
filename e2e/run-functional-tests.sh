#!/bin/bash
set -ex

echo "Running Functional tests on ${ENVIRONMENT} env"
# this requires update later on when we need different tests to run on each environment. .for example enhancements test only on preview
yarn test:e2e

