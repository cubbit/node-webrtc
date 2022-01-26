#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint no-process-env:0, no-process-exit:0 */
'use strict';

const { spawnSync } = require('child_process');

async function main(exit) {
  const args = ['install'];

  if (process.env.DEBUG) {
    args.push('--debug');
  }

  if (process.env.TARGET_ARCH) {
    args.push('--target_arch=' + process.env.TARGET_ARCH);
  }

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
}

module.exports = main;

if (require.main === module) {
  main(true);
}
