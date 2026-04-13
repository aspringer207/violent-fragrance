const { SlashCommandBuilder } = require("discord.js");
const sql = "../../source/db";
const mapProcessStrings = "../../functions/mapProcessStrings";
const getFlowerList = require("../../functions/getFlowerList");

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
      let flowerList = await getFlowerList()
        .then((response) =>
          response.map((row) => [row.flower_name, row.flower_id]),
        )
        .then((responseArray) => new Map(responseArray));
      const validInput = flowerList.has(flower);
      const flowerID = validInput
        ? flowerList.get(flower)
        : mapProcessStrings(flowerList).get(flower);
      await sql`
      insert into tcf.member_flowers (tcf_id, flower_id)
      select tcf.members.tcf_id, ${flowerID}
      from tcf.members
      where tcf.members.discord_id = ${dc}::text
      `;
      interaction.editReply(
        `How luxurious! It's been noted that you can grow ${flower}! Thank you!`,
      );
    } catch (error) {
      if (error.code === "23505") {
        console.warn("duplicate flower");
        console.table({
          userName: dc,
          userInput: flower,
          errorName: error.name,
          errorCode: error.code,
          errorMessage: error.message,
        });

        await interaction.editReply(
          `Silly goose! You already have that flower. Better a silly goose than a creepy duck!`,
        );
        return;
      }
      // ReferenceError (unrecognized flower) or other top-level errors
      if (error instanceof ReferenceError) {
        console.warn("unrecognized flower");
        console.table({
          userInput: interaction.options.getString("flower"),
          errorName: error.name,
          errorMessage: error.message,
        });

        await interaction.editReply(
          `I don't recognize that flower, sorry. Try typing the name again, or run /list-flowers to see the full list.`,
        );
        return;
      }
      console.error("SQL ERROR:", error);
      console.error("Node ERROR:", error);

      await interaction.followUp(`Could not insert flower. Sorry!`);
    }
  },
};
