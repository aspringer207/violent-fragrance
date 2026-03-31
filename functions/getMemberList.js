const sql = require("../db");
async function getMemberList(){
    try {
        return await sql`
        select (member_id) from tcf.members
        `
    } catch (error) {
        console.error("SQL ERROR:", error);
        console.error("Node ERROR:", error);
        throw error;
    }
}
module.exports = getMemberList