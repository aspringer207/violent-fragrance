const sql = require('../source/db');
async function createFlowerEntry(memberID, flowerID){
    return await sql`
      insert into tcf.member_flowers (member_id, flower_id)
      values (${memberID}, ${flowerID})
      returning *
      `
}

module.exports = createFlowerEntry