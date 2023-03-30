export default class Constants {
  static get DEFAULT_ALPHABET () {
    return 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  }

  static get DEFAULT_MAX_SECRET_LENGTH () {
    return 12
  }

  static get MAX_CHUNK_SIZE () {
    return 20000
  }

  static get EXIT_CODE_SUCCESS () {
    return 0
  }

  static get EXIT_CODE_FAILURE () {
    return 1
  }
}
