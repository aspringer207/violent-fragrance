const { SlashCommandBuilder } = require("discord.js");
const sql = require("../../source/db"); // <-- FIXED
const getFlowerID = require("../../functions/getFlowerID");
const createFlowerMap = require("../../functions/createFlowerMap");
const createProcessMap = require("../../functions/createProcessMap");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report-flower")
    .setDescription("Report that you can grow a specific flower.")
    .addStringOption((option) =>
      option
        .setName("flower")
        .setDescription("The flower you can grow. Spelling counts!")
        .setRequired(true),
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const flower = interaction.options.getString("flower");
    const dc = interaction.user.id;

    try {
      const exactMap = createFlowerMap();
      const processMap = createProcessMap();

      // getFlowerID can throw ReferenceError → now caught properly
      const flowerID = await getFlowerID(flower, exactMap, processMap);

      // SQL insert
      await sql`
        insert into tcf.member_flowers (member_id, flower_id)
        select tcf.members.tcf_id, ${flowerID}
        from tcf.members
        where tcf.members.discord_id = ${dc}::text
      `;

      await interaction.editReply(
        `How luxurious! It's been noted that you can grow ${flower}! Thank you!`
      );

    } catch (error) {
      // Duplicate flower
      if (error.code === "23505") {
        console.warn("duplicate flower");
        console.table({
          userName: dc,
          userInput: flower,
          errorName: error.name,
          errorCode: error.code,
          errorMessage: error.message,
        });

        return interaction.editReply(
          `Silly goose! You already have that flower. Better a silly goose than a creepy duck!`
        );
      }

      // Unrecognized flower (ReferenceError from getFlowerID)
      if (error instanceof ReferenceError) {
        console.warn("unrecognized flower");
        console.table({
          userInput: flower,
          errorName: error.name,
          errorMessage: error.message,
        });

        return interaction.editReply(
          `I don't recognize that flower, sorry. Try typing the name again, or run /list-flowers to see the full list.`
        );
      }

      // Other SQL or Node errors
      console.error("SQL ERROR:", error);
      console.error("Node ERROR:", error);

      return interaction.followUp(`Could not insert flower. Sorry!`);
    }
  },
};
