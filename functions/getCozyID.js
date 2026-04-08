const sql = require('../source/db');
async function getCozyID(discordID) {
    try{
        const result = await sql`
            select cozy_id from tcf.members where discord_id = ${discordID}
        `;
        return result[0]?.cozy_id;
    } catch (error) {
        console.error("Error fetching Cozy ID:", error);
        throw error;
    }
}
module.exports = getCozyID