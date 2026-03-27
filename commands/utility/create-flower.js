const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create")
    .setDescription("Add a flower to the database.")
    .addStringOption((option) =>
      option
        .setName("create-flower")
        .setDescription("A new flower to add to the database. Spelling counts!")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("rarity")
        .setDescription("flower rarity")
        .setRequired(true)
        .addChoices(
          { name: "Normal", value: "N" },
          { name: "Rare", value: "R" },
          { name: "Super Rare", value: "SR" },
          { name: "Super Super Rare", value: "SSR" },
          { name: "Ultra Rare", value: "UR" },
        ),
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply();
      const flowerName = interaction.options.getString("flower");
      const flowerRarity = interaction.options.getString("rarity");

      const newRecord = await sql`
			insert into tcf.flowers (
				flower_name, flower_rarity
			) values(
				${flowerName}, ${flowerRarity}
			)

			returning *
			`;
      interaction.editReply(`So prestigious! I added the following record to the database. 
				flower_id: ${newRecord[0].flower_id},
				flower_name: ${newRecord[0].flower_name},
				flower_rarity: ${newRecord[0].flower_rarity},
				date_added: ${newRecord[0].date_added}
				`);
    } catch (error) {
      await interaction.editReply(
        "Andrea doesn't have this one working yet, but she'll get there eventually! Don't yell. I am nice.",
      );
      logger.error("SQL ERROR:", error);
      logger.error("Node ERROR:", error);
      console.error("SQL ERROR:", error);
      console.error("Node ERROR:", error);
    }
  },
};
