const { Events,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder,
	MessageFlags,
	EmbedBuilder
} = require('discord.js');

const { canOpenTicket } = require('../utils/antiSpam');

const STAFF_CHANNEL_ID = '716229951548031006';

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		// Création du message avec le bouton pour ouvrir un ticket
		if (interaction.isButton()) {
			if (interaction.customId === 'ticket_open') {
				await interaction.showModal(buildTicketModal());
			}
		}

		// Modale de ticket
		if (interaction.isModalSubmit()) {
			if (interaction.customId === 'ticket_modal') {
				if (!canOpenTicket(interaction.user.id)) {
					return interaction.reply({
						content: "⏳ Tu dois attendre avant d’ouvrir un autre ticket.",
						ephemeral: true
					});
				}

				const age = interaction.fields.getTextInputValue('ageInput');
				const hours = interaction.fields.getTextInputValue('hoursInput');
				const rpname = interaction.fields.getTextInputValue('nameInput');

				const staffChannel = interaction.guild.channels.cache.get(STAFF_CHANNEL_ID);

				if (!staffChannel) {
					return interaction.reply({
						content: "❌ Salon staff introuvable. Vérifie l'ID.",
						ephemeral: true,
					});
				}

				const guild = interaction.guild;

				// ID ROLE STAFF A MODIFIER
				const staffRoleId = '716219155086311445';

				console.log(interaction.user.id);

				const embed = new EmbedBuilder()
					.setTitle('📩 Nouveau ticket')
					.addFields(
						{ name: 'Utilisateur', value: `${interaction.user}`, inline: false },
						{ name: 'Âge', value: age, inline: true },
						{ name: 'Heures', value: hours, inline: true },
						{ name: 'Nom RP', value: rpname, inline: false },
					)
					.setColor(0x57f287);

				await staffChannel.send({
					content: `Nouveau ticket de ${interaction.user}`,
					embeds: [embed],
				});

				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({
						content: `✅ Ticket créé`,
						ephemeral: true,
					});
				} else {
					await interaction.reply({
						content: `✅ Ticket créé`,
						ephemeral: true,
					});
				}
			}
		}

		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: 'There was an error while executing this command!',
					flags: MessageFlags.Ephemeral,
				});
			} else {
				await interaction.reply({
					content: 'There was an error while executing this command!',
					flags: MessageFlags.Ephemeral,
				});
			}
		}
	},
};


function buildTicketModal() {
	const modal = new ModalBuilder()
		.setCustomId('ticket_modal')
		.setTitle('Ticket');

	const ageInput = new TextInputBuilder()
		.setCustomId('ageInput')
		.setLabel("Quel est votre âge ?")
		.setStyle(TextInputStyle.Short);

	const hoursInput = new TextInputBuilder()
		.setCustomId('hoursInput')
		.setLabel("Heures de jeu ?")
		.setStyle(TextInputStyle.Short);

	const nameInput = new TextInputBuilder()
		.setCustomId('nameInput')
		.setLabel("Nom RP ?")
		.setStyle(TextInputStyle.Short);

	modal.addComponents(
		new ActionRowBuilder().addComponents(ageInput),
		new ActionRowBuilder().addComponents(hoursInput),
		new ActionRowBuilder().addComponents(nameInput)
	);

	return modal;
}