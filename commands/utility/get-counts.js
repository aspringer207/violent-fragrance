import { SlashCommandBuilder } from "@discordjs/builders";

const { getCounts } = require( "../../functions/getCounts" )
module.exports = {data: new SlashCommandBuilder().setName('get-counts').setDescription('get database counts by rarity'),
    async execute(interaction) {
        await interaction.deferReply()
        const counts = await getCounts()
        const countMap = counts.map(row => `Rarity: ${row.flower_rarity} | Count: ${row.count}`)
        await interaction.editReply(countMap.join(`
            
            `));            
    }
}