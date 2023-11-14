import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { DEFAULT_ALPHABET, DEFAULT_MAX_SECRET_LENGTH } from './constants.js'

export default class ArgsParser {
	constructor() {
		this.args = yargs(hideBin(process.argv))
			.usage(
				'Usage: jwt-cracker -t <token> [-a <alphabet>] [--max <maxLength>] [-d <dictionaryFile>] [-f]',
			)
			.option('t', {
				alias: 'token',
				type: 'string',
				describe: 'HMAC-SHA JWT token to crack',
				demandOption: true,
			})
			.option('a', {
				alias: 'alphabet',
				type: 'string',
				describe: 'Alphabet to use for the brute force',
				default: DEFAULT_ALPHABET,
			})
			.option('max', {
				describe: 'Maximum length of the secret',
				default: DEFAULT_MAX_SECRET_LENGTH,
			})
			.option('d', {
				alias: 'dictionary',
				type: 'string',
				describe: 'Password file to use instead of the brute force',
			})
			.option('f', {
				alias: 'force',
				type: 'boolean',
				describe: 'Skip token validation',
			})
			.help()
			.wrap(yargs.terminalWidth)
			.alias('h', 'help').argv
	}

	get token() {
		return this.args.token
	}

	get alphabet() {
		return this.args.alphabet
	}

	get maxLength() {
		return this.args.max
	}

	get force() {
		return this.args.force
	}

	get dictionaryFilePath() {
		return this.args.dictionary
	}
}
