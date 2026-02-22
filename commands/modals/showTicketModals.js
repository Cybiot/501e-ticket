const { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('showticketmodals')
        .setDescription('Show the ticket modal.'),
    
    async execute(interaction) {
        // if (interaction.customId === "ticket") {
            const modal = new Modal()
                .setCustomId('ticketModal')
                .setTitle('Ouvrir un ticket');
            const ageInput = new TextInputComponent()
                .setCustomId('age')
                .setLabel("Quel est votre âge ?")
                .setStyle('SHORT')
                .setRequired(true);
            modal.addComponents(firstActionRow);
            const heureDeJeuInput = new TextInputComponent()
                .setCustomId('heuredejeu')
                .setLabel("Combien d'heures de jeu avez-vous ?")
                .setStyle('SHORT')
            const nomRPInput = new TextInputComponent()
                .setCustomId('nomrp')
                .setLabel("Avez-vous un nom RP ? Si oui, lequel ?")
                .setStyle('SHORT')
                .setRequired(true);
            const firstActionRow = new MessageActionRow().addComponents(ageInput);
            const secondActionRow = new MessageActionRow().addComponents(heureDeJeuInput);
            const thirdActionRow = new MessageActionRow().addComponents(nomRPInput);
            
            modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

            await interaction.showModal(modal);
        // }
    }
};
