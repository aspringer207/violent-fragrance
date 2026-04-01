const sql = require("../db");
async function getMemberList(){
    try {
        const result = await sql`
        select * from tcf.members
        `
        return result
    } catch (error) {
        console.error("SQL ERROR:", error);
        console.error("Node ERROR:", error);
        throw error;
    }
}
module.exports = getMemberList