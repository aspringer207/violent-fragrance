const createProcessString = require("./createProcessString");

function mapProcessStrings(map) {
  if (!(map instanceof Map)){
    console.warn('Warning! not a map.')
  }
  const logger = []
  const processMap = new Map();
  map.forEach((key, value) => {
    processMap.set(key, createProcessString(value))
    logger.push([key, value])
  });
  console.table(logger)
  return processMap;
}
module.exports = mapProcessStrings;
