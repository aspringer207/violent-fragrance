const SlashCommandBuilder = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user-info")
    .setDescription("get discord id"),
  async execute(interaction) {
    // Get the user who ran the command
    const commandUser = interaction.user;
    const commandUserId = commandUser.id;

    await interaction.reply(
      `You are: ${commandUser.tag}, ID: ${commandUserId}`,
    );
  },
};
