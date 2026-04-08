const { SlashCommandBuilder } = require("discord.js");
const sql = require("../../source/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-questing")
    .setDescription("Set your questing status")
    .addBooleanOption((option) =>
      option
        .setName("is-questing")
        .setDescription(
          "Set to true if you are currently questing, false if you are not.",
        )
        .setRequired(true),
    ),
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const isQuesting = interaction.options.getBoolean("is-questing");
      await sql`
        update tcf.questing_status
        set actively_questing = ${isQuesting}
        where tcf_id = (select tcf_id from tcf.members where discord_id =${interaction.user.id}::text
        LIMIT 1)
        returning *
      `;
      await interaction.editReply(
        `Your questing status has been updated to ${isQuesting}.`,
      );
    } catch (error) {
      console.error("SQL ERROR:", error);
      console.error("Node ERROR:", error);
      await interaction.followUp(`Could not update questing status. Sorry!`);
    }
  },
};
