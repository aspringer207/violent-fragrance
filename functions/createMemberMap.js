const getMemberList = require('./getMemberList');
async function createMemberMap() {
    try {
        const memberList = await getMemberList();
        return new Map(memberList.map(x => [x.member_id, x.tcf_id]));
    } catch (error) {
        console.error("Error creating member map:", error);
        throw error;
    }
}

module.exports = createMemberMap;
