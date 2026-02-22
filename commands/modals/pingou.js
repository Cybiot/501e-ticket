const {
	SlashCommandBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pingou')
		.setDescription('Ouvrir un ticket'),

	async execute(interaction) {

		const modal = new ModalBuilder()
			.setCustomId('myModal')
			.setTitle('My Modal');

		const ageInput = new TextInputBuilder()
			.setCustomId('ageInput')
			.setLabel("Quel est votre âge ?")
			.setStyle(TextInputStyle.Short)
			.setPlaceholder('Entrez votre âge');

		const hoursInput = new TextInputBuilder()
			.setCustomId('hoursInput')
			.setLabel("Combien d'heures de jeu avez-vous ?")
			.setStyle(TextInputStyle.Short)
			.setPlaceholder('Entrez vos heures de jeu');
		
		const nameInput = new TextInputBuilder()
			.setCustomId('nameInput')
			.setLabel("Avez-vous un nom RP ? Si oui, lequel ?")
			.setStyle(TextInputStyle.Short)
			.setPlaceholder('Entrez votre nom RP');

		const row1 = new ActionRowBuilder().addComponents(ageInput);
		const row2 = new ActionRowBuilder().addComponents(hoursInput);
		const row3 = new ActionRowBuilder().addComponents(nameInput);

		modal.addComponents(row1, row2, row3);

		await interaction.showModal(modal);
	},
};