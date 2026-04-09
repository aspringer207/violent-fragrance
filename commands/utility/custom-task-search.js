const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("custom-task-search")
    .setDescription(
      "Specify parameters to search for the tasks you want to see!",
    ).addStringOption((option) =>
      option
        .setName("minimum-rarity")
        .setDescription(
          "Choose a minimum rarity tier to exclude more common flowers.",
        ).setRequired(true)
        .addChoices(
          { name: "N", value: "N" },
          { name: "R", value: "R" },
          { name: "SR", value: "SR" },
          { name: "SSR", value: "SSR" },
          { name: "UR", value: "UR" },
        ).setRequired(true)
    ).addBooleanOption((option) => 
        option
        .setName('include-rarer')
        .setDescription('Include flowers of a higher rarity level than the selected tier')
        .setRequired(true)
    )
    .addBooleanOption((option) => 
        option
        .setName('questing-only')
        .setDescription('Search only for flowers from players with quests left.')
        .setRequired(true)
    )
    .addStringOption((option) =>    
        option
        .setName('sorting-behavior')
        .setDescription('Choose how your search results are ordered')
        .addChoices(
            {name: "most-rare-first", value: "rdesc"},
            {name: "least-rare-first", value: "rasc"},
            {name: "most-accessible-first", value: "pdesc"},
            {name: "least-accessible-first", value: "pasc"}
        ).setRequired(true)
    )
    ,
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};
