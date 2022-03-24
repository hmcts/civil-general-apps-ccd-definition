#!/usr/bin/env bash

definition_input_dir=$(realpath 'ga-ccd-definition')
definition_output_file="$(realpath ".")/build/ccd-development-config/ccd-civil-general-apps-dev.xlsx"
params="$@"


./bin/utils/import-ccd-definition-dev.sh "${definition_input_dir}" "${definition_output_file}" "${params}"
