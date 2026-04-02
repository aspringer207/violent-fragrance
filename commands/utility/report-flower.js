const { SlashCommandBuilder } = require("discord.js");
const sql = require("../../db");
const flowerMap = require("../../flowerMap");
const memberMap = require("../../memberMap");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report-flower")
    .setDescription(
      "Use this to report that you are able to grow a specific flower.",
    )
    .addStringOption((option) =>
      option
        .setName("flower")
        .setDescription("A new flower to add to the database. Spelling counts!")
        .setRequired(true),
    ),
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const flowerName = interaction.options.getString("flower");
      const memberID = interaction.user.id
      const tcfID = memberMap.get(memberID)
      const flowerID = flowerMap.get(flowerName)
      
      await sql`
      insert into tcf.member_flowers (member_id, flower_id)
      values (${tcfID}, ${flowerID})
      `
      const response = `How luxurious! You can grow ${flowerName}! Thank you for the update, ${interaction.user.tag}!`
      await interaction.editReply(response);


    } catch (error) {
      console.error("SQL ERROR:", error);
      console.error("Node ERROR:", error);
      await interaction.editReply(
        `This command is still in development, but Andrea is working hard to get it up and running! Please be patient and don't yell at her. I am a nice bot.`,
      );
    }
  },
};
