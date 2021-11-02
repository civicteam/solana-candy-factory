#!/usr/bin/env bash
set -e
set -u

if [ "${STAGE}" == "prod" ]; then
  DISTRIBUTION=E24ZR0P856T8YZ
  BUCKET=candy.identity.com
elif [ ${STAGE} == "preprod" ]; then
  DISTRIBUTION=???
  BUCKET=explorer-preprod.identity.com
elif [ ${STAGE} == "dev" ]; then
  DISTRIBUTION=???
  BUCKET=explorer-dev.identity.com
fi

npx deploy-aws-s3-cloudfront --non-interactive --source out --bucket ${BUCKET} --destination ${STAGE} --distribution ${DISTRIBUTION}

