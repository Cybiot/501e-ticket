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
			.setTitle('🎫 Demander son affectation')
			.setDescription(`
				Bonjour volontaire !

				Si tu souhaites rejoindre notre régiment, avant toute chose, je t'invite à lire le message suivant : <#482601015070425113>

				Ensuite, il te suffit de soumettre ton dossier en cliquant sur l'icône ci-dessous en répondant d'abord à quelques questions.

				Une fois cela fait, un recruteur passera s'occuper de toi. N'hésite pas à laisser un petit message pour te présenter ou simplement à poser les questions que tu veux.

				Prêt à rejoindre l'aventure ?
				`)
			.setColor(0x2b2d31);

		const button = new ButtonBuilder()
			.setCustomId('ticket_open')
			.setLabel('Postuler')
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