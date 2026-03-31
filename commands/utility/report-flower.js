const { SlashCommandBuilder } = require("discord.js");
const { default: getFlowerList } = require("../../functions/getFlowerList");
const { default: createProcessString } = require("../../functions/createProcessString");

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
    )
    .addStringOption((option) =>
      option
        .setName("rarity")
        .setDescription("flower rarity")
        .setRequired(true)
        .addChoices(
          { name: "N", value: "N" },
          { name: "R", value: "R" },
          { name: "SR", value: "SR" },
          { name: "SSR", value: "SSR" },
          { name: "UR", value: "UR" },
        ),
    ),
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const flowerName = interaction.options.getString("flower");
      const flowerRarity = interaction.options.getString("rarity");
      const flowers = await getFlowerList()
      const filteredFlowers = flowers.filter(x => x.flower_rarity === flowerRarity)
      const flowerNameList = filteredFlowers.map((row)=> row.flower_name).map((flower) => flower.map(createProcessString(flower)))
      if (!flowerNameList.includes(createProcessString(flowerName))) {
        await interaction.editReply(
          `Hmm, I couldn't find that flower in the database. Please check your spelling and try again! If you think this is a mistake, please contact Andrea.`,
        );
        return
      }
      else {
        const flower = filteredFlowers.find((row) =>row.flower_name === flowerName)
        const member = await getMemberList().find((row) => row.discord_id === interaction.user.id.toString())
        await sql`
        insert into tcf.member_flowers (
          member_id, flower_id
        ) values (
          ${member.tcf_id}, ${flower.flower_id}
        )
        `
      }
    } catch (error) {
      console.error("SQL ERROR:", error);
      console.error("Node ERROR:", error);
      await interaction.editReply(
        `This command is still in development, but Andrea is working hard to get it up and running! Please be patient and don't yell at her. I am a nice bot.`,
      );
    }
  },
};
