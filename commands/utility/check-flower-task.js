const { SlashCommandBuilder } = require("discord.js");
const sql = require("../../source/db");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("check-flower-task")
    .setDescription(
      "Search a specific flower to see how many members can complete it.",
    )
    .addStringOption((option) =>
      option
        .setName("flower")
        .setDescription("The name of the flower to search for")
        .setRequired(true),
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const flowerName = interaction.options.getString("flower");
    const result = await sql`
select
  count(*)
from
  tcf.member_flowers
  join tcf.flowers on tcf.flowers.flower_id = tcf.member_flowers.flower_id
  join tcf.questing_status on tcf.member_flowers.member_id = tcf.questing_status.tcf_id
where
  tcf.questing_status.actively_questing
  and (tcf.flowers.flower_name = ${flowerName})
    `;
    const count = result[0].count;
    await interaction.editReply(
      `There are ${count} members who can complete the ${flowerName} task.`,
    );
  },
};
