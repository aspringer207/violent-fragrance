const createFlowerMap = require("./createFlowerMap");
const createProcessString = require("./createProcessString");

async function createProcessMap() {
  const processMap = new Map();
  await createFlowerMap().then((result) =>
    result.forEach((value, key) => {
      const newKey = createProcessString(key);
      processMap.set(newKey, value);
    }),
  );
  return processMap;
}
module.exports = createProcessMap;
