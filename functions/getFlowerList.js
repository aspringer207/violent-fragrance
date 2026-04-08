const sql = require("../source/db");
async function getFlowerList() {
    try {
        return await sql`
        select * from tcf.flowers
        `
    } catch (error) {
        console.error("SQL ERROR:", error);
        console.error("Node ERROR:", error);
        throw error;
    }
}
module.exports = getFlowerList