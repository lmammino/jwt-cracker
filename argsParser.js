import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import Constants from './constants.js'

export default class ArgsParser {
  constructor () {
    this.args = yargs(hideBin(process.argv))
      .usage(
        'Usage: jwt-cracker -t <token> [-a <alphabet>] [--max <maxLength>] [-f]'
      )
      .option('t', {
        alias: 'token',
        type: 'string',
        describe: 'HS256 JWT token to crack',
        demandOption: true
      })
      .option('a', {
        alias: 'alphabet',
        type: 'string',
        describe: 'Alphabet to use for the brute force',
        default: Constants.DEFAULT_ALPHABET
      })
      .option('max', {
        describe: 'Maximum length of the secret',
        default: Constants.DEFAULT_MAX_SECRET_LENGTH
      })
      .option('f', {
        alias: 'force',
        type: 'boolean',
        describe: 'Skip token validation'
      })
      .help()
      .alias('h', 'help').argv
  }

  get token () {
    return this.args.token
  }

  get alphabet () {
    return this.args.alphabet
  }

  get maxLength () {
    return this.args.max
  }

  get force () {
    return this.args.force
  }
}
