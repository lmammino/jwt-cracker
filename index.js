#!/usr/bin/env node

import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { fork } from 'node:child_process'
import variationsStream from 'variations-stream'
import ArgsParser from './argsParser.js'
import JWTValidator from './jwtValidator.js'
import Constants from './constants.js'

const __dirname = fileURLToPath(new URL('.',
  import.meta.url))

const args = new ArgsParser()

const token = args.token
const alphabet = args.alphabet
const minLength = args.minLength
const maxLength = args.maxLength

const validToken = JWTValidator.validateToken(token)

if (!validToken) {
  process.exit(Constants.EXIT_CODE_FAILURE)
}

const printResult = function (startTime, attempts, result) {
  if (result) {
    console.log('SECRET FOUND:', result)
  } else {
    console.log('SECRET NOT FOUND')
  }
  console.log('Time taken (sec):', (new Date().getTime() - startTime) / 1000)
  console.log('Attempts:', attempts)
}

const [header, payload, signature] = token.split('.')
const content = `${header}.${payload}`

const startTime = new Date().getTime()
let attempts = 0
const chunkSize = 20000
let chunk = []

variationsStream(alphabet, maxLength)
  .on('data', function (comb) {
    if (comb.length >= minLength) {
      chunk.push(comb)
      if (chunk.length >= chunkSize) {
        // save chunk and reset it
        forkChunk(chunk)
        chunk = []
      }
    }
  })
  .on('end', function () {
    printResult(startTime, attempts)
    process.exit(Constants.EXIT_CODE_FAILURE)
  })

function forkChunk (chunk) {
  const child = fork(join(__dirname, 'process-chunk.js'))
  child.send({ chunk, content, signature })
  child.on('message', function (result) {
    attempts += chunkSize
    if (result === null && attempts % 100000 === 0) {
      console.log('Attempts:', attempts)
    }
    if (result) {
      // secret found, print result and exit
      printResult(startTime, attempts, result)
      process.exit(Constants.EXIT_CODE_SUCCESS)
    }
  })

  child.on('exit', function () {
    // check if all child processes have finished, and if so, exit
    checkFinished()
  })
}

function checkFinished () {
  // check if all child processes have finished, and if so, exit
}
