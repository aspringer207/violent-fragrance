const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('task-info').setDescription('suggests tasks for optimal points and completion outcomes'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};