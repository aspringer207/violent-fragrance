const getFlowerList = require("./functions/getFlowerList");
const fs = require('node:fs').promises;

getFlowerList()
  .then((flowerList) => {
    const data = flowerList.map((flower) => [flower.flower_name, flower.flower_id]);
    return fs.writeFile('flowers.json', JSON.stringify(data, null, 2));
  })
  .then(() => console.log('Flowers written to flowers.json'))
  .catch((error) => console.error("Node ERROR:", error));