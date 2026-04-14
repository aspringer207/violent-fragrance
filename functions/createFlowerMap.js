const getFlowerList = require("./getFlowerList");

async function createFlowerMap() {
  const flowerList = await getFlowerList()
    .then((result) =>
      result.map((record) => [record.flower_name, record.flower_id]),
    )
    .then((resultArr) => new Map(resultArr));

  return flowerList;
}
module.exports = createFlowerMap;
