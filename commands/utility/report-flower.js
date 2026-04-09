const { SlashCommandBuilder } = require("discord.js");
const memberMap = require("../../functions/createMemberMap");
const createFlowerEntry = require("../../functions/createFlowerEntry");
const createProcessString = require("../../functions/createProcessString");
const getFlowerList = require("../../functions/getFlowerList");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report-flower")
    .setDescription("Report that you can grow a specific flower.")
    .addStringOption(option =>
      option
        .setName("flower")
        .setDescription("The flower you can grow. Spelling counts!")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const flowerName = interaction.options.getString("flower");
      const memberID = interaction.user.id;

      // Nickname fallback
      const userNickname =
        interaction.member?.nickname ?? interaction.user.username;

      // Get TCF ID
      const tcfID = await memberMap()
        .then(map => map.get(memberID))
        .catch(error => {
          console.error("Error retrieving tcfID from memberMap:", error);
          throw error;
        });

      // Load flower list once
      const flowerList = await getFlowerList();
      const flowerMap = new Map(
        flowerList.map(x => [x.flower_name, x.flower_id])
      );

      let flowerID;

      // 1. Exact match
      if (flowerMap.has(flowerName)) {
        flowerID = flowerMap.get(flowerName);
      }

      // 2. Processed-string match
      else {
        const processedInput = createProcessString(flowerName);
        const processedList = flowerList.map(x =>
          createProcessString(x.flower_name)
        );

        const idx = processedList.findIndex(val => val === processedInput);

        if (idx === -1) {
          throw new ReferenceError("Flower not found in database.");
        } else {
          flowerID = flowerList[idx].flower_id;
        }
      }

      // 3. Insert once — clean and predictable
      try {
        const response = await createFlowerEntry(tcfID, flowerID);

        await interaction.editReply(
          `So prestigious! You can grow ${response.flower_name}! Thank you for the update, ${userNickname}!`
        );
      } catch (error) {
        // Duplicate flower
        if (error.code === "23505") {
          console.log("duplicate flower");
          console.table({
            userName: userNickname,
            userInput: flowerName,
            errorName: error.name,
            errorCode: error.code,
            errorMessage: error.message,
          });

          await interaction.editReply(
            `Silly goose! You already have that flower. Better a silly goose than a creepy duck!`
          );
          return;
        }

        // Unknown DB error
        console.log("unknown error");
        console.table({
          userName: userNickname,
          userInput: flowerName,
          errorName: error.name,
          errorCode: error.code,
          errorMessage: error.message,
        });

        await interaction.editReply(
          "Command failed due to an unknown error."
        );
      }
    } catch (error) {
      // ReferenceError (unrecognized flower) or other top-level errors
      if (error instanceof ReferenceError) {
        console.log("unrecognized flower");
        console.table({
          userInput: interaction.options.getString("flower"),
          errorName: error.name,
          errorMessage: error.message,
        });

        await interaction.editReply(
          `I don't recognize that flower, sorry. Try typing the name again, or run /list-flowers to see the full list.`
        );
        return;
      }

      // Fallback
      console.error("SQL ERROR:", error);
      console.error("Node ERROR:", error);

      await interaction.followUp(
        `This command is still in development, but Andrea is working hard to get it up and running! Please be patient and don't yell at her. I am a nice bot.`
      );
    }
  },
};
