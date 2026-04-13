const sql = require('../source/db');
async function createFlowerEntry(memberID, flowerID){
  try {
    console.log(memberID, flowerID)
    const result = await sql`
      insert into tcf.member_flowers (member_id, flower_id)
      values (${memberID}, ${flowerID})
      returning *
      `
    console.log(result)
    return result[0];
  } catch (error) {
    console.error("SQL ERROR:", error);
    throw error;
    
  }
    
}

module.exports = createFlowerEntry