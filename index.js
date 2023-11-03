#!/usr/bin/env node

import { join } from 'node:path'
import { fork } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { createReadStream } from 'node:fs'
import { createInterface } from 'node:readline'

import variationsStream from 'variations-stream'

import Constants from './constants.js'
import ArgsParser from './argsParser.js'
import JWTValidator from './jwtValidator.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const numberFormatter = Intl.NumberFormat('en', { notation: 'compact' }).format

const {
  token,
  alphabet,
  maxLength,
  dictionaryFilePath
} = new ArgsParser()

const { isTokenValid, algorithm } = JWTValidator.validateToken(token)

if (!isTokenValid) {
  process.exit(Constants.EXIT_CODE_FAILURE)
}

const timeTaken = (startTime) => (new Date().getTime() - startTime) / 1000

const printResult = function (startTime, attempts, result) {
  if (result) {
    console.log('SECRET FOUND:', result)
  } else {
    console.log('SECRET NOT FOUND')
  }
  console.log('Time taken (sec):', timeTaken(startTime))
  console.log('Total attempts:', attempts)
}

const [header, payload, signature] = token.split('.')
const content = `${header}.${payload}`

let chunk = []
let attempts = 0
let isStreamClosed = false
const startTime = new Date().getTime()
const childProcesses = []

if (dictionaryFilePath) {
  const lineReader = createInterface({
    input: createReadStream(dictionaryFilePath)
  })

  lineReader.on('error', function () {
    console.log(`Unable to read the dictionary file "${dictionaryFilePath}" (make sure the file path exists)`)
    process.exit(Constants.EXIT_CODE_FAILURE)
  })
  lineReader.on('line', addToQueue)
  lineReader.on('close', closeStream)
} else {
  variationsStream(alphabet, maxLength)
    .on('data', addToQueue)
    .on('end', closeStream)
}

function closeStream () {
  // purge remaining items in chunk
  purgeQueue()
  isStreamClosed = true
}

function purgeQueue () {
  // save chunk and reset it
  forkChunk(chunk)
  chunk = []
}

function addToQueue (comb) {
  chunk.push(comb)
  if (chunk.length >= Constants.CHUNK_SIZE) {
    purgeQueue()
  }
}

function forkChunk (chunk) {
  const child = fork(join(__dirname, 'process-chunk.js'))
  childProcesses.push(child)
  child.send({ chunk, content, signature, algorithm })
  child.on('message', function (result) {
    attempts += chunk.length
    if (result === null && attempts % (Constants.CHUNK_SIZE * 5) === 0) {
      const speed = numberFormatter(Math.trunc(attempts / timeTaken(startTime)))
      console.log(`Attempts: ${attempts} (${speed}/s last attempt was '${chunk[chunk.length - 1]}')`)
    }
    if (result) {
      // secret found, print result and exit
      printResult(startTime, attempts, result)
      process.exit(Constants.EXIT_CODE_SUCCESS)
    }
  })

  child.on('exit', checkFinished)
}

function checkFinished () {
  // check if all child processes have finished, and if so, exit
  childProcesses.pop()
  if (isStreamClosed && childProcesses.length === 0) {
    printResult(startTime, attempts)
    process.exit(Constants.EXIT_CODE_FAILURE)
  }
}
