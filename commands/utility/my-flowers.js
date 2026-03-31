const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const chunky = require("../../functions/chunky");
const sql = require("../../db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("my-flowers")
    .setDescription("View the flowers you have.")
    .addBooleanOption((option) =>
      option
        .setName("private")
        .setDescription(
          "Choose this option to have the bot reply to you privately instead of in the channel.",
        )
        .setRequired(false),
    ),
  async execute(interaction) {
    const privateInteraction = interaction.options.getBoolean("private");
    const discordID = interaction.user.id;
    if ((privateInteraction)) {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    } else {
      await interaction.deferReply();
    }
    try {
      const flowerReport = await sql`
        select
          tcf.flowers.flower_name
        from
          tcf.flowers
        join
          tcf.member_flowers
          on tcf.flowers.flower_id = tcf.member_flowers.flower_id
        join
          tcf.members
          on tcf.member_flowers.member_id = tcf.members.tcf_id
        where
          tcf.members.discord_id = ${discordID.toString()}
      `;
      const processedReport = flowerReport
        .map((row) => row.flower_name)
        .join(", ");
      const replyChunks = chunky(processedReport);
      await interaction.editReply(
        `How luxurious! Here are the flowers you currently have:`,
      );
      for (const i of replyChunks) {
        if ((privateInteraction)) {
          interaction.followUp({
            content: `${i}`,
            flags: MessageFlags.Ephemeral,
          });
        } else {
          interaction.followUp(`${i}`);
        }
      }
    } catch (error) {
      console.error("SQL ERROR:", error);
      console.error("Node ERROR:", error);
      await interaction.editReply(
        `Sorry, something went wrong.`,
      );
    }
  },
};
