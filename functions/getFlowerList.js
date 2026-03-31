const sql = require("../db");
async function getFlowerList() {
    try {
        const flowerList = await sql`
        select flower_id, flower_name, flower_rarity from tcf.flowers
        `
        return flowerList
    } catch (error) {
        console.error("SQL ERROR:", error);
        console.error("Node ERROR:", error);
        throw error;
    }
}
module.exports = getFlowerList