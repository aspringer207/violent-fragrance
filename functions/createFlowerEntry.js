const sql = require('../source/db');
async function createFlowerEntry(memberID, flowerID){
  console.log('trying to create flower entry')
    const result = await sql`
      insert into tcf.member_flowers (member_id, flower_id)
      values (${memberID}, ${flowerID})
      returning *
      `
    console.table(result)
}

module.exports = createFlowerEntry