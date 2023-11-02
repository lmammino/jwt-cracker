import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import Constants from './constants.js'

export default class ArgsParser {
  constructor () {
    this.args = yargs(hideBin(process.argv))
      .usage(
        'Usage: jwt-cracker -t <token> [-a <alphabet>] [--max <maxLength>] [-d <dictionaryFile>]'
      )
      .option('t', {
        alias: 'token',
        type: 'string',
        describe: 'HMAC-SHA JWT token to crack',
        demandOption: true
      })
      .option('a', {
        alias: 'alphabet',
        type: 'string',
        describe: 'Alphabet to use for the brute force'
      })
      .option('max', {
        describe: 'Maximum length of the secret'
      })
      .option('d', {
        alias: 'dictionary',
        type: 'string',
        describe: 'Password file to use instead of the brute force',
        conflicts: 'a'
      })
      .help()
      .alias('h', 'help')
      .wrap(yargs.terminalWidth).argv
  }

  get token () {
    return this.args.token
  }

  get alphabet () {
    return this.args.alphabet || Constants.DEFAULT_ALPHABET
  }

  get maxLength () {
    return this.args.max || Constants.DEFAULT_MAX_SECRET_LENGTH
  }

  get dictionaryFilePath () {
    return this.args.dictionary
  }
}
