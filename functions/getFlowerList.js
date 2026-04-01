const sql = require("../db");
async function getFlowerList() {
    try {
        const flowerList = await sql`
        select * from tcf.flowers
        `
        return flowerList
    } catch (error) {
        console.error("SQL ERROR:", error);
        console.error("Node ERROR:", error);
        throw error;
    }
}
module.exports = getFlowerList