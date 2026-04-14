
const createProcessString = require("./createProcessString")

async function getFlowerID(flowerName, exactMap, processMap){
const processName = createProcessString(flowerName);
const [a, b] = await Promise.all([exactMap, processMap]);
if (a.has(flowerName)){
    return a.get(flowerName)
}
if (b.has(processName)){
    return b.get(processName)
}
console.warn('no matching name found')


}

module.exports = getFlowerID;