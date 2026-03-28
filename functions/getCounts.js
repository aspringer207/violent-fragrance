const sql = require("../db")

async function getCounts() {
    try {
        const counts = await sql`
        select * from tcf.flower_counts
        `
        return counts
    } catch (error) {

        console.error("SQL ERROR:", error);
        console.error("Node ERROR:", error);
    }
}

module.exports = getCounts