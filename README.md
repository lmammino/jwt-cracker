 ![npm](https://img.shields.io/npm/dt/jwt-cracker.svg)
 [![npm](https://img.shields.io/npm/v/jwt-cracker.svg)](https://www.npmjs.com/package/jwt-cracker)
 [![Rawsec's CyberSecurity Inventory](https://inventory.raw.pm/img/badges/Rawsec-inventoried-FF5050_flat.svg)](https://inventory.raw.pm/tools.html#jwt-cracker)
 [![GitHub stars](https://img.shields.io/github/stars/lmammino/jwt-cracker.svg)](https://github.com/lmammino/jwt-cracker/stargazers)
 [![GitHub license](https://img.shields.io/github/license/lmammino/jwt-cracker.svg)](https://github.com/lmammino/jwt-cracker/blob/master/LICENSE)

# jwt-cracker

Simple HS256, HS384 & HS512 JWT token brute force cracker.

Effective only to crack JWT tokens with weak secrets.
**Recommendation**: Use strong long secrets or RS256 tokens.


## Install

With npm:

```bash
npm install --global jwt-cracker
```


## Usage

From command line:

```bash
jwt-cracker -t <token> [-a <alphabet>] [--max <maxLength>] [-d <dictionaryFilePath>] [-f]
```

Where:

* **token**: the full HS256-512 JWT token string to crack
* **alphabet**: the alphabet to use for the brute force (default: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
* **maxLength**: the max length of the string generated during the brute force (default: 12)
* **dictionaryFilePath**: path to a list of passwords (one per line) to use instead of brute force
* **force**: force script to execute when the token isn't valid

## Requirements

This script requires Node.js version 16.0.0 or higher

## Example

Cracking the default [jwt.io example](https://jwt.io):

```bash
jwt-cracker -t eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ -a abcdefghijklmnopqrstuwxyz --max 6
```

It takes about 2 hours in a Macbook Pro (2.5GHz quad-core Intel Core i7).

Or using a list of passwords taken from https://github.com/danielmiessler/SecLists

```bash
jwt-cracker -t eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ -d darkweb2017-top10000.txt
```

It takes less than a second.

## Contributing

Everyone is very welcome to contribute to this project.
You can contribute just by submitting bugs or suggesting improvements by
[opening an issue on GitHub](https://github.com/lmammino/jwt-cracker/issues).


## License

Licensed under [MIT License](LICENSE). © Luciano Mammino.
