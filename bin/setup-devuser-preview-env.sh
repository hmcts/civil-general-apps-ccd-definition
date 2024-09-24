ccdBranch=${1:-master}
camundaBranch=${2:-master}
dmnBranch=${3:-master}
waStandaloneBranch=${4:-master}

echo "Loading Environment Variables"
source ./bin/variables/load-dev-user-preview-environment-variables.sh
echo "Importing Roles to the CCD pod"
./bin/add-roles.sh
echo "Importing Camunda definitions"
./bin/pull-latest-camunda-files.sh ${camundaBranch}
echo "Importing CCD definitions"
./bin/import-ccd-definition.sh "-e *-prod.json,*-shuttered.json" ${ccdBranch}
rm -rf $(pwd)/build

echo "Importing GA CCD definitions"
./bin/build-release-ccd-definition.sh preview
ccdDefinitionFilePath="$(pwd)/build/ccd-release-config/civil-ccd-preview.xlsx"
./bin/utils/ccd-import-definition.sh ${ccdDefinitionFilePath}

echo "Importing Camunda definitions"
./bin/pull-latest-dmn-files.sh ${dmnBranch}
./bin/pull-latest-camunda-wa-files.sh ${waStandaloneBranch}

rm -rf $(pwd)/camunda

echo "ENV variables set for devuser-preview environment."
echo "XUI_URL: $XUI_WEBAPP_URL"
