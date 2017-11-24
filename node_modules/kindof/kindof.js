if (typeof module != "undefined") module.exports = kindof

function kindof(obj) {
  if (obj === undefined) return "undefined"
  if (obj === null) return "null"

  switch (Object.prototype.toString.call(obj)) {
    case "[object Boolean]": return "boolean"
    case "[object Number]": return "number"
    case "[object String]": return "string"
    case "[object RegExp]": return "regexp"
    case "[object Date]": return "date"
    case "[object Array]": return "array"
    default: return typeof obj
  }
}
