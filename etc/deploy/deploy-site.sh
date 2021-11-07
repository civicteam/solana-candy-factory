#!/usr/bin/env bash
set -e
set -u

if [ "${STAGE}" == "prod" ]; then
  DISTRIBUTION=???
  BUCKET=candy.civic.finance
elif [ ${STAGE} == "preprod" ]; then
  DISTRIBUTION=???
  BUCKET=candy-preprod.civic.finance
elif [ ${STAGE} == "dev" ]; then
  DISTRIBUTION=???
  BUCKET=candy-dev.civic.finance
fi

npx deploy-aws-s3-cloudfront --non-interactive --source out --bucket ${BUCKET} --destination ${STAGE} --distribution ${DISTRIBUTION}

