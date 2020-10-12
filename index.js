#!/usr/bin/env node

"use strict";

const crypto = require('crypto');
const variationsStream = require('variations-stream');
const pkg = require('./package');

const defaultAlphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const defaultMaxLength = 12;
const token = process.argv[2];
const alphabet = process.argv[3] || defaultAlphabet;
const maxLength = Number(process.argv[4]) || defaultMaxLength;

if (typeof(token) === 'undefined' || token === '--help') {
  console.log(
`jwt-cracker version ${pkg.version}

  Usage:
    jwt-cracker <token> [<alphabet>] [<maxLength>]

    token       the full HS256 jwt token to crack
    alphabet    the alphabet to use for the brute force (default: ${defaultAlphabet})
    maxLength   the max length of the string generated during the brute force (default: ${defaultMaxLength})
`
);
  process.exit(0);
}

const generateSignature = function(content, secret) {
  return (
    crypto.createHmac('sha256', secret)
      .update(content)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
  );
};

const printResult = function(startTime, attempts, result) {
  if (result) {
    console.log('SECRET FOUND:', result);
  } else {
    console.log('SECRET NOT FOUND');
  }
  console.log('Time taken (sec):', ((new Date).getTime() - startTime)/1000);
  console.log('Attempts:', attempts);
};

const [header, payload, signature] = token.split('.');
const content = `${header}.${payload}`;

const startTime = new Date().getTime();
let attempts = 0;
variationsStream(alphabet, maxLength)
  .on('data', function(comb) {
    attempts++;
    const currentSignature = generateSignature(content, comb);
    if (attempts%100000 === 0) {
      console.log('Attempts:', attempts);
    }
    if (currentSignature == signature) {
      printResult(startTime, attempts, comb);
      process.exit(0);
    }
  })
  .on('end', function(){
    printResult(startTime, attempts);
    process.exit(1);
  })
;
