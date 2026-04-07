const fs = require("fs");
const getFlowerList = require ("./functions/getFlowerList");
async function test(newGuildieName, newGuildieFlowers) {
getFlowerList().then((result) => {
    const flowerMap = new Map(result.map((x) => [x.flower_name, x.flower_id]));
    const mappedFlowers = newGuildieFlowers.map((x) => {
        if (flowerMap.has(x)) {
            return flowerMap.get(x);
        } else {
            console.log(`Flower ${x} not found in database.`);
            return null;
        }
    });
    fs.writeFile(`personal_${newGuildieName}.json`, JSON.stringify(mappedFlowers.filter(x => x !== null)), (err) => {
        if (err) {
            console.error("Error writing file:", err);
        } else {
            console.log("File written successfully.");
        }
});}).catch((error) => {
    console.error("Error fetching flower list:", error);
});}
module.exports = test;