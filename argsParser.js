import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import Constants from './constants.js'

export default class ArgsParser {
  constructor () {
    this.args = yargs(hideBin(process.argv))
      .usage(
        'Usage: jwt-cracker -t <token> [-a <alphabet>] [--min <minLength>] [--max <maxLength>]'
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
      .option('min', {
        describe: 'Minimum length of the secret. Note: 1<= min',
        default: Constants.DEFAULT_MIN_SECRET_LENGTH
      })
      .option('max', {
        describe: 'Maximum length of the secret. Note: min <= max',
        default: Constants.DEFAULT_MAX_SECRET_LENGTH
      })
      .check(argv => {
        if (argv.min < 1 || argv.max < argv.min) {
          throw new Error('Invalid min or max arguments. Remember: 1<= min <= max')
        }
        return true
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

  get minLength () {
    return this.args.min
  }

  get maxLength () {
    return this.args.max
  }
}
