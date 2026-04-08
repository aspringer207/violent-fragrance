const { SlashCommandBuilder } = require("discord.js");
const memberMap = require("../../functions/createMemberMap");
const createFlowerEntry = require("../../functions/createFlowerEntry");
const createProcessString = require("../../functions/createProcessString");
const getFlowerList = require("../../functions/getFlowerList");

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
      const memberID = interaction.user.id;
      const userNickname = interaction.member.nick
        ? interaction.member.nick
        : interaction.user.username;
      const tcfID = memberMap.get(memberID);
      let flowerID;

      const flowerList = await getFlowerList().then((result) =>
        result.map((x) => [x.flower_name, x.flower_id]),
      );
      const flowerMap = await getFlowerList().then(
        (result) => new Map(result.map((x) => [x.flower_name, x.flower_id])),
      );

      if (flowerMap.has(flowerName)) {
        flowerID = flowerMap.get(flowerName);
      } else if (
        flowerList
          .map((x) => createProcessString(x[0]))
          .includes(createProcessString(flowerName))
      ) {
        const flowerNameProcessStrings = flowerList.map((x) =>
          createProcessString(x[0]),
        );
        const idx = flowerNameProcessStrings.findIndex(
          (val) => val === createProcessString(flowerName),
        );
        flowerID = flowerList[idx][1];
        await createFlowerEntry(tcfID, flowerID);
      } else {
        throw new ReferenceError("Flower not found in database.");
      }
      await createFlowerEntry(tcfID, flowerID)
        .then((response) =>
          interaction.editReply(
            `So prestigious! You can grow ${response.flower_name}! Thank you for the update, ${userNickname}!`,
          ),
        )
        .catch(async (error) => {
          if (error.code === "23505") {
            const duplicateFlowerLog = {
              userName: userNickname,
              userInput: flowerName,
              errorName: error.name,
              errorCode: error.code,
              errorMessage: error.message,
            };
            console.table(duplicateFlowerLog);
            await interaction.editReply(
              `Silly goose! You already have that flower. Oh well, better a silly goose than a creepy duck!`,
            );
            return;
          }
          if (error instanceof ReferenceError) {
            const unrecognizedFlowerLog = {
              userName: userNickname,
              userInput: flowerName,
              errorName: error.name,
              errorCode: error.code,
              errorMessage: error.message,
            };
            console.table(unrecognizedFlowerLog);
            await interaction.editReply(
              `I don't recognize that flower, sorry. Try typing the name again, or run the /list-flowers command to find the name in the list.`,
            );
            return;
          }
          const unknownErrorLog = {
            userName: userNickname,
            userInput: flowerName,
            errorName: error.name,
            errorCode: error.code,
            errorMessage: error.message,
          };
          console.table(unknownErrorLog);
          await interaction.editReply('Command failed due to an unknown error.');
        });
    } catch (error) {
      console.error("SQL ERROR:", error);
      console.error("Node ERROR:", error);
      await interaction.followUp(
        `This command is still in development, but Andrea is working hard to get it up and running! Please be patient and don't yell at her. I am a nice bot.`,
      );
    }
  },
};
