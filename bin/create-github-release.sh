#!/usr/bin/env bash

getNextReleaseVersion() {
  repoName=$1
  currentVersion=$(curl --silent "https://api.github.com/repos/hmcts/${repoName}/releases/latest" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
  IFS='.' read -a versionParts <<< "$currentVersion"
  patchVersion=$((versionParts[2] + 1))
  echo "${versionParts[0]}.${versionParts[1]}.${patchVersion}"
}

getToken() {
  az keyvault secret show --vault-name infra-vault-nonprod --name hmcts-github-apikey --query value -o tsv
}

createNewRelease() {
  repoName=$1
  token=$(getToken)
  nextReleaseVersion=$(getNextReleaseVersion $1)

  curl \
    -X POST \
    -H "Accept: application/vnd.github.v3+json" \
    -H "Authorization: token ${token}" \
    https://api.github.com/repos/hmcts/${repoName}/releases \
    -d "{\"tag_name\":\"${nextReleaseVersion}\",\"name\":\"${repoName}-v${nextReleaseVersion}\",\"body\":\"${BUILD_URL}\"}" \
    | docker run --rm --interactive ghcr.io/jqlang/jq:latest '.id'
}

uploadReleaseAsset() {
  repoName=$1
  releaseId=$2
  assetName=$3
  token=$(getToken)

  curl \
    -X POST \
    -H "Authorization: token ${token}" \
    -H "Content-Type: application/zip" \
    --data-binary @$assetName \
    https://uploads.github.com/repos/hmcts/${repoName}/releases/${releaseId}/assets?name=${assetName}
}

if [ -z "$BUILD_URL" ]; then
  echo "Error: this script should only be run by Jenkins"
  exit 1
fi

zip -r civil-general-apps-ccd-definition.zip ga-ccd-definition
zip -r civil-general-apps-e2e.zip e2e codecept.conf.js package.json steps.d.ts yarn.lock saucelabs.conf.js
zip -r civil-screenshots.zip output
ls -lash
#cp build/github-release/civil-general-apps-ccd-aat.xlsx civil-general-apps-ccd-aat.xlsx
#cp build/github-release/civil-general-apps-ccd-aat.xlsx civil-general-apps-ccd-aat.xlsx
#az login --identity
#releaseId=$(createNewRelease civil-general-apps-ccd-definition)

uploadReleaseAsset civil-general-apps-ccd-definition $releaseId civil-general-apps-ccd-definition.zip
uploadReleaseAsset civil-general-apps-ccd-definition $releaseId civil-general-apps-e2e.zip
#uploadReleaseAsset civil-general-apps-ccd-definition $releaseId civil-general-apps-ccd-aat.xlsx
#uploadReleaseAsset civil-general-apps-ccd-definition $releaseId civil-general-apps-ccd-prod.xlsx
#uploadReleaseAsset civil-general-apps-ccd-definition $releaseId civil-general-apps-screenshots.zip

rm civil-general-apps-ccd-definition.zip
rm civil-general-apps-e2e.zip
#rm civil-general-apps-ccd-aat.xlsx
