#!/usr/bin/env node

import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { fork } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import variationsStream from 'variations-stream'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const pkg = JSON.parse(await readFile(new URL('./package.json', import.meta.url)))
const defaultAlphabet =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const defaultMaxLength = 12
const token = process.argv[2]
const alphabet = process.argv[3] || defaultAlphabet
const maxLength = Number(process.argv[4]) || defaultMaxLength

if (typeof token === 'undefined' || token === '--help') {
  console.log(
    `jwt-cracker version ${pkg.version}

  Usage:
    jwt-cracker <token> [<alphabet>] [<maxLength>]

    token       the full HS256 jwt token to crack
    alphabet    the alphabet to use for the brute force (default: ${defaultAlphabet})
    maxLength   the max length of the string generated during the brute force (default: ${defaultMaxLength})
`
  )
  process.exit(0)
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
    chunk.push(comb)
    if (chunk.length >= chunkSize) {
      // save chunk and reset it
      forkChunk(chunk)
      chunk = []
    }
  })
  .on('end', function () {
    printResult(startTime, attempts)
    process.exit(1)
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
      process.exit(0)
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
