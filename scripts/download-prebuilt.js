#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint no-process-env:0, no-process-exit:0 */
'use strict';

const { spawnSync } = require('child_process');
const os = require('os');
const https = require('https');

const fs = require('fs');
const path = require('path');

const modulePath = path.resolve(__dirname, '..');
const bindingsPath = path.resolve(modulePath, 'build', 'Release', 'wrtc.node');

function download(url, destination) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const file = fs.createWriteStream(destination);
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', reject);
  });
}

async function main(exit) {
  const args = ['install'];

  if (process.env.DEBUG) {
    args.push('--debug');
  }

  if (process.env.TARGET_ARCH) {
    args.push('--target_arch=' + process.env.TARGET_ARCH);
  }

  // if (os.platform() === 'darwin' && os.arch() === 'arm64') {
  //   const url = 'https://cubbit.s3.eu-central-1.amazonaws.com/node-webrtc/0.4.7-dev/darwin/arm64/wrtc.node';

  //   console.log('Apple Silicon CPU detected. Downloading prebuilt for darwin-arm64 from', url);
  //   if (!fs.existsSync(bindingsPath)) {
  //     fs.mkdirSync(path.dirname(bindingsPath), { recursive: true });
  //   }

  //   await download(url, bindingsPath);
  //   console.log('Downloaded prebuilt for darwin-arm64 at', bindingsPath);
  // }
  // else {
  let { status } = spawnSync('node-pre-gyp', args, {
    shell: true,
    stdio: 'inherit'
  });

  if (status) {
    if (!exit) {
      throw new Error(status);
    }

    process.exit(1);
  }
  // }
}

module.exports = main;

if (require.main === module) {
  main(true);
}
