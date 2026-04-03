const { SlashCommandBuilder } = require("discord.js");
const flowerList = require("../../flowerList");
const flowerMap = require("../../flowerMap");
const memberMap = require("../../memberMap");
const createFlowerEntry = require("../../functions/createFlowerEntry");
const createProcessString = require("../../functions/createProcessString")

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
      let flowerID;
      if (flowerMap.has(flowerName)){
        flowerID = flowerMap.get(flowerName)
      }
      else if(flowerList.map((x)=> createProcessString(x[0])).includes(createProcessString(flowerName))){ 
        const flowerNameProcessStrings = flowerList.map((x)=> createProcessString(x[0]));
        const idx = flowerNameProcessStrings.findIndex((val) => val === createProcessString(flowerName))
        flowerID = flowerList[idx][1];
        await createFlowerEntry(tcfID, flowerID)

      } else {
        throw new ReferenceError("Flower not found in database.")
      }
      await createFlowerEntry(tcfID, flowerID);

      
      const response = `How luxurious! You can grow ${flowerName}! Thank you for the update, ${interaction.user.tag}!`
      await interaction.editReply(response);


    } catch (error) {
      if (error instanceof ReferenceError){
        console.error("Reference ERROR:", error);
       await interaction.editReply(
        `I don't recognize that flower, sorry. Try typing the name again, or run the /flower-list command to find the name in the list.`,
      );
      } else if (error.code === "23505"){
        await interaction.editReply(
          `Silly goose! You already have that flower. Oh well, better a silly goose than a crazy duck!`,
        );
      } else
      {
        console.error("SQL ERROR:", error);
      console.error("Node ERROR:", error);
      await interaction.editReply(
        `This command is still in development, but Andrea is working hard to get it up and running! Please be patient and don't yell at her. I am a nice bot.`,
      );}
    }
  },
};
