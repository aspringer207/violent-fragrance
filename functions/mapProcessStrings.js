const createProcessString = require("./createProcessString");

function mapProcessStrings(map) {
  if (!(map instanceof Map)) {
    throw new TypeError(`argument ${map} is not a valid Map object`);
  }
  const processMap = new Map();
  map.forEach((key, value) => processMap.set(key, createProcessString(value)));
  return processMap;
}
module.exports = mapProcessStrings;
