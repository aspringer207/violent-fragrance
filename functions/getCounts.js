const sql = require("../db")
const logger = require("../logger")

async function getCounts() {
    try {
        const counts = await sql`
        select * from tcf.flower_counts
        `
        return counts
    } catch (error) {
        logger.error("SQL ERROR:", error);
        logger.error("Node ERROR:", error);
        console.error("SQL ERROR:", error);
        console.error("Node ERROR:", error);
    }
}

module.exports = getCounts