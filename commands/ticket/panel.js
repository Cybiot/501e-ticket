const {
	SlashCommandBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	EmbedBuilder,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ticket-panel')
		.setDescription('Publier le panneau de ticket'),

	async execute(interaction) {
		if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
			return interaction.reply({
				content: "❌ Tu n'as pas la permission d'utiliser cette commande.",
				ephemeral: true
			});
		}
		const embed = new EmbedBuilder()
			.setTitle('🎫 Support')
			.setDescription('Clique sur le bouton pour .')
			.setColor(0x2b2d31);

		const button = new ButtonBuilder()
			.setCustomId('ticket_open')
			.setLabel('Ouvrir un ticket')
			.setStyle(ButtonStyle.Primary);

		const row = new ActionRowBuilder().addComponents(button);

		await interaction.reply({
			content: 'Panneau envoyé.',
			ephemeral: true
		});

		await interaction.channel.send({
			embeds: [embed],
			components: [row],
		});
	},
};