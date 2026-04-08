const sql = require('../source/db')

async function getCounts() {
    try {
        return await sql`
        select * from tcf.flower_counts
        `
    } catch (error) {
        

        console.error("SQL ERROR:", error);
        console.error("Node ERROR:", error);
        throw error;
    }
}

module.exports = getCounts