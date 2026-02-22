const { Events,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder,
	MessageFlags,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle
} = require('discord.js');

const { canOpenTicket } = require('../utils/antiSpam');

// const ARCHIVE_CHANNEL_ID = '1474975474085265429';
// const STAFF_CHANNEL_ID = '716229951548031006';
const ARCHIVE_CHANNEL_ID = '1475259486787862641';
const STAFF_CHANNEL_ID = '1475262427103760444';

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {


		if (interaction.isButton()) {
			// Création du message avec le bouton pour ouvrir un ticket
			if (interaction.customId === 'ticket_open') {
				await interaction.showModal(buildTicketModal());
			}
			// Gestion de la fermeture du ticket
			if (interaction.customId.startsWith('ticket_close_')) {
				const userId = interaction.customId.split('_')[2];

				const archiveChannel = interaction.guild.channels.cache.get(ARCHIVE_CHANNEL_ID);

				if (archiveChannel) {
					const closedEmbed = EmbedBuilder.from(interaction.message.embeds[0])
						.setTitle('🔒 Ticket clôturé')
						.setColor(0xed4245)
						.setFooter({ text: `Clôturé par ${interaction.user.tag} • ${new Date().toLocaleString('fr-FR')}` });

					// Envoie dans le salon d'archive
					await archiveChannel.send({
						embeds: [closedEmbed],
					});
				}else {
					console.error(`Ticket : ${userId} - Salon d'archive introuvable !`);
				}

				// Supprime le message original dans le salon staff
				await interaction.message.delete();

				// Confirme à l'utilisateur (éphémère car le message est supprimé)
				await interaction.reply({
					content: '✅ Ticket clôturé et archivé.',
					ephemeral: true,
				});
			}
		}

		// Modale de ticket
		if (interaction.isModalSubmit()) {
			if (interaction.customId === 'ticket_modal') {
				if (!canOpenTicket(interaction.user.id)) {
					return interaction.reply({
						content: "⏳ Tu dois attendre 24h avant d’ouvrir un autre ticket.",
						ephemeral: true
					});
				}

				const age = interaction.fields.getTextInputValue('ageInput');
				const hours = interaction.fields.getTextInputValue('hoursInput');
				const rpname = interaction.fields.getTextInputValue('nameInput');

				const staffChannel = interaction.guild.channels.cache.get(STAFF_CHANNEL_ID);

				if (!staffChannel) {
					return interaction.reply({
						content: "Un problème est survenu lors de la création du ticket. Le salon de staff est introuvable.",
						ephemeral: true,
					});
				}

				const guild = interaction.guild;

				// ID ROLE STAFF A MODIFIER
				// const staffRoleId = '716219155086311445';
				const staffRoleId = '897514660297850911';

				console.log(interaction.user.id);

				const embed = new EmbedBuilder()
					.setTitle('📩 Nouveau ticket')
					.addFields(
						{ name: 'Utilisateur', value: `${interaction.user}`, inline: false },
						{ name: 'Âge', value: age, inline: true },
						{ name: 'Heures', value: hours, inline: true },
						{ name: 'Nom RP', value: rpname || 'Non renseigné', inline: false },
					)
					.setColor(0x57f287);


				const closeButton = new ButtonBuilder()
					.setCustomId(`ticket_close_${interaction.user.id}`)
					.setLabel('🔒 Clôturer le ticket')
					.setStyle(ButtonStyle.Danger);

				const buttonRow = new ActionRowBuilder().addComponents(closeButton);

				await staffChannel.send({
					content: `Nouveau ticket de ${interaction.user}`,
					embeds: [embed],
					components: [buttonRow],
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
		.setLabel("Quel est ton âge ?")
		.setStyle(TextInputStyle.Short);

	const hoursInput = new TextInputBuilder()
		.setCustomId('hoursInput')
		.setLabel("Combien as-tu d'heures de jeu ?")
		.setStyle(TextInputStyle.Short);

	const nameInput = new TextInputBuilder()
		.setCustomId('nameInput')
		.setLabel("As-tu déjà un nom RP ? Si oui, lequel ?")
		.setStyle(TextInputStyle.Short)
		.setRequired(false);

	modal.addComponents(
		new ActionRowBuilder().addComponents(ageInput),
		new ActionRowBuilder().addComponents(hoursInput),
		new ActionRowBuilder().addComponents(nameInput)
	);

	return modal;
}