const { SlashCommandBuilder } = require("discord.js");
const sql = require("../../source/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("task-info")
    .setDescription("suggests tasks for optimal points and completion outcomes")
    .addStringOption((option) =>
      option
        .setName("rarity")
        .setDescription("Limit your search to a specific rarity")
        .addChoices(
          { name: "N", value: "N" },
          { name: "R", value: "R" },
          { name: "SR", value: "SR" },
          { name: "SSR", value: "SSR" },
          { name: "UR", value: "UR" },
        ),
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const rarity = interaction.options.getString("rarity");

    const responseInfo = rarity === null ? await sql`
        select tcf.flowers.flower_name as flower, tcf.flowers.flower_rarity as rarity,
        count(tcf.flowers.flower_name) as "can complete"
        from tcf.member_flowers
        join tcf.flowers on tcf.member_flowers.flower_id = tcf.flowers.flower_id
        join tcf.questing_status on tcf.member_flowers.member_id = tcf.questing_status.tcf_id
        where tcf.questing_status.actively_questing = true
        group by (tcf.flowers.flower_rarity, tcf.flowers.flower_name)
        order by "rarity" DESC
		limit 15;
      ` : await sql`
        select tcf.flowers.flower_name as flower, tcf.flowers.flower_rarity as rarity,
        count(tcf.flowers.flower_name) as "can complete"
        from tcf.member_flowers
        join tcf.flowers on tcf.member_flowers.flower_id = tcf.flowers.flower_id
        join tcf.questing_status on tcf.member_flowers.member_id = tcf.questing_status.tcf_id
        where tcf.questing_status.actively_questing = true and tcf.flowers.flower_rarity = ${rarity}
        group by (tcf.flowers.flower_rarity, tcf.flowers.flower_name)
        order by "can complete" DESC 
		limit 15;
      `;

    const response = responseInfo
      .map((row) => `${row.flower} (${row.rarity}): ${row["can complete"]}`)
      .join("\n");
    await interaction.editReply(response);
  },
};
