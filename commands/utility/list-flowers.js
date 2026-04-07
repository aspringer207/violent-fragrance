const { SlashCommandBuilder } = require("discord.js");
const getFlowerList = require("../../functions/getFlowerList");
const groupy = require("../../functions/groupy");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("list-flowers")
    .setDescription("See all existing flowers in the database."),
  async execute(interaction) {
    try {
      await interaction.deferReply();
      const flowerList = await getFlowerList();
      const flowerMap = flowerList.map((row) => [
        row.flower_rarity,
        row.flower_name,
      ]);
      const chunks = groupy(flowerMap);

      await interaction.editReply(`
        Bart help us! Here are the current flowers in the database:
        Flower Rarity | Flower Name`);
      for (const chunk of chunks) {
        await interaction.followUp(`${chunk}`);
      }
    } catch (error) {
      console.error("SQL ERROR:", error);
      console.error("Node ERROR:", error);
      await interaction.editReply(`Sorry, something went wrong.`);
    }
  },
};
