class Util {
  static regExpEsc(str) {
    return str.replace(Util.REGEXPESC, "\\$&")
  }
  static get wait () {
    return require('util').promisify(setTimeout)
  }
  static get REGEXPESC () {
    return /[-/\\^$*+?.()|[\]{}]/g
  }
}

module.exports = Util