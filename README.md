# jwt-cracker

Simple HS256 JWT token brute force cracker.

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
jwt-cracker <token> [<alphabet>] [<maxLength>]
```

Where:

* **token**: the full HS256 JWT token string to crack
* **alphabet**: the alphabet to use for the brute force (default: "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789")
* **maxLength**: the max length of the string generated during the brute force (default: 12)


## Contributing

Everyone is very welcome to contribute to this project.
You can contribute just by submitting bugs or suggesting improvements by
[opening an issue on GitHub](https://github.com/lmammino/jwt-cracker/issues).


## License

Licensed under [MIT License](LICENSE). © Luciano Mammino.
