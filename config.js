const { removeTrailingSlashes } = require('./utils');
const fs = require('fs');

const INDEXD = 'INDEXD';
const CLOUD_FRONT = 'CLOUD_FRONT';
const LOCAL = 'LOCAL';
const PUBLIC_S3 = 'PUBLIC_S3';
const DUMMY = 'DUMMY';

const config = {
  INDEXD,
  CLOUD_FRONT,
  LOCAL,
  PUBLIC_S3,
  DUMMY,
  source: process.env.URL_SRC || DUMMY,
  backendUrl: removeTrailingSlashes(process.env.BACKEND_URL),
  version: process.env.VERSION,
  date: process.env.DATE
};

if (config.source) {
  config.source = config.source.toUpperCase();
} else {
  const err = 'URL_SRC is not set!';
  console.error(err);
  throw err;
}


if (!config.version) {
  config.version = 'Version not set'
}

if (!config.date) {
  config.date = new Date();
}

function readPrivateKey(keyPath) {
  return fs.readFileSync(keyPath, 'utf8');
}

switch (config.source) {
  case INDEXD:
    config.indexDUrl = removeTrailingSlashes(process.env.INDEXD_URL);
    if (!config.indexDUrl) {
      throw "INDEXD_URL is not set!";
    }
    break;
  case CLOUD_FRONT:
    config.cfUrl = removeTrailingSlashes(process.env.CF_URL);
    config.cfKeyPairId = process.env.CF_KEY_PAIR_ID;
    config.cfPrivateKey = readPrivateKey(process.env.CF_PRIVATE_KEY);
    config.urlExpiresInSeconds = process.env.URL_EXPIRES_IN_SECONDS
    if (!config.cfUrl) {
      throw "CF_URL is not set!";
    }
    if (!config.cfKeyPairId) {
      throw "CF_KEY_PAIR_ID is not set!";
    }
    if (!config.cfPrivateKey) {
      throw "CF_PRIVATE_KEY is not set!";
    }
    if (!config.backendUrl) {
      const err = 'BACKEND_URL is not set!';
      console.error(err);
      throw err;
    }
    break;
  case LOCAL:
    // Todo: add local support here
    break;
  case PUBLIC_S3:
    // Todo: add public S3 support here
    break;
  case DUMMY:
    break;
  default:
    const err = `Unknown Source: '${config.source}'`;
    console.error(err);
    throw err;
}

module.exports = config;
