const { Client, Collection, MessageEmbed, Intents, MessageActionRow, MessageButton } = require('discord.js');
const { TOKEN, PREFIX, ETAT, MDPBDD } = require("./config-lib1.js");
// const { Sequelize } = require('sequelize');


const client = new Client({intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'GUILD_EMOJIS_AND_STICKERS', 'GUILD_INTEGRATIONS', 'GUILD_MESSAGE_REACTIONS']});

// const sequelize = new Sequelize("liberte", "bot", MDPBDD, {
//     dialect: "mysql",
//     host: "localhost",
//     logging: false
// });

client.on("interactionCreate", async interaction => {
    if(!interaction.isButton()) return;

    // Si le bouton selectionné a l'id ticket
    // Si c'est une ouverture de ticket :
    if(interaction.customId == "ticket"){
        // let infos = await sequelize.query(`SELECT COUNT(id) AS count FROM tickets WHERE id_membre = '${interaction.user.id}' AND statut = 1`);
        if(infos[0][0].count >= 1) return interaction.reply({content: ":x: Vous devez d'abord fermer les tickets ouverts avant de pouvoir en ouvrir d'autres !", ephemeral: true});

        // let infosTickets = await sequelize.query("SELECT MAX(id) AS num FROM tickets");
        var num = infosTickets[0][0].num + 1;
        let guild = client.guilds.cache.get(interaction.message.guildId);
        let user = interaction.user;
        let channel = await guild.channels.create(`ticket-${num}`, {
            type: 'text',
            parent: "768225279675203655",
            permissionOverwrites: [{
                    id: user.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                },
                {
                    id: '686019294978637824',
                    deny: ['VIEW_CHANNEL'],
                    allow: ["SEND_MESSAGES"]
                },
                {
                    id: '791438430533058570',
                    allow: ["VIEW_CHANNEL", "MANAGE_CHANNELS"]
                },
                {
                    id: '686020581501698126',
                    allow: ['VIEW_CHANNEL', "MANAGE_CHANNELS"]
                },
                {
                    id: '767786993765449748',
                    allow: ['VIEW_CHANNEL', "MANAGE_CHANNELS"]
                },
                {
                    id: '799325532696739890',
                    allow: ['VIEW_CHANNEL', "MANAGE_CHANNELS"]
                },
                {
                    id: '686019468065112106',
                    allow: ['VIEW_CHANNEL', "MANAGE_CHANNELS"]
                },
                {
                    id: '824957404021784626',
                    allow: ['VIEW_CHANNEL', "MANAGE_CHANNELS"]
                }],
            }
        );
        interaction.reply({content: `:white_check_mark: Retrouvez votre ticket ouvert dans ce channel : ${channel}`, ephemeral: true});


        // Création du bouton de fermeture du ticket
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(`fermer`)
                .setLabel("FERMER LE TICKET")
                .setStyle("PRIMARY")
                .setEmoji("🔒")
        );


        let message = await channel.send({content: `Bienvenue dans ce ticket ${user} !\nJe te laisse présenter la raison de l'ouverture de ce ticket, nos <@&799325532696739890> essaierons d'y répondre le plus rapidement possible !`, components: [row]});
        // sequelize.query(`INSERT INTO tickets (id_channel, id_message, id_membre, date_fermeture) VALUES ('${channel.id}', '${message.id}', '${interaction.user.id}', NULL);`);
    }

    if(interaction.customId == "fermer"){
        // let ticket = await sequelize.query(`SELECT * FROM tickets WHERE id_channel = '${interaction.channelId}';`);
        if (ticket[0][0].statut == 1){
            let num = ticket[0][0].id;
            let channel = client.guilds.cache.get(interaction.guildId).channels.cache.get(interaction.channelId);

            channel.setName(`en-fermeture-${num}`);

            channel.permissionOverwrites.edit("686019294978637824", { 'VIEW_CHANNEL': false, "SEND_MESSAGES": false });
            channel.permissionOverwrites.edit(ticket[0][0].id_membre, { 'VIEW_CHANNEL': true, 'SEND_MESSAGES': false });
            channel.permissionOverwrites.edit("686020581501698126", { 'VIEW_CHANNEL': true, 'SEND_MESSAGES': false });
            channel.permissionOverwrites.edit("791438430533058570", { 'VIEW_CHANNEL': true, 'SEND_MESSAGES': false });
            channel.permissionOverwrites.edit("767786993765449748", { 'VIEW_CHANNEL': true, 'SEND_MESSAGES': false });
            channel.permissionOverwrites.edit("799325532696739890", { 'VIEW_CHANNEL': true, 'SEND_MESSAGES': false });
            channel.permissionOverwrites.edit("686019468065112106", { 'VIEW_CHANNEL': true, 'SEND_MESSAGES': false });
            channel.permissionOverwrites.edit("824957404021784626", { 'VIEW_CHANNEL': true, 'SEND_MESSAGES': false });


            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel("LAISSER UN AVIS A PROPOS DU TICKET")
                        .setStyle("LINK")
                        .setURL(`https://www.lgbtacos.com/avis-ticket.php?ticket=${ticket[0][0].id}&code=${ticket[0][0].id_channel}`)
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId(`supprimer`)
                        .setLabel("FERMER LE TICKET DEFINITEVEMENT")
                        .setStyle("PRIMARY")
                        .setEmoji("❌")
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId(`rouvrir`)
                        .setLabel("ROUVRIR LE TICKET")
                        .setStyle("PRIMARY")
                        .setEmoji("🔓")
                );

            let message = await interaction.reply({components: [row], content: `__**Le ticket est désormais fermé. Mais avant de le cloturer définitivement....**__\n\nMerci du temps que vous avez pris <@!${ticket[0][0].id_membre}> pour ce ticket.\nNous espérons que vous avez trouvé les réponses que vous attendiez par l’ ouverture de ce ticket.\nVous pouvez laisser un commentaire concernant la prise en charge de votre ticket, grâce au lien suivant: https://www.lgbtacos.com/avis-ticket.php?ticket=${ticket[0][0].id}&code=${ticket[0][0].id_channel}\nVous souhaitant une bonne journée, l’équipe du staff.\n\nPour réouvrir ce ticket, cliquez sur la réaction :unlock:.\nLorsque vous aurez laissé votre avis, si vous souhaitez en laisser un, cliquez sur la réaction :x:, cela fermera complètement le ticket.`} );
            // sequelize.query(`UPDATE tickets SET date_fermeture = CURRENT_TIMESTAMP, statut = '2' WHERE id_channel = '${interaction.channelId}';`);
        }else{
            interaction.reply({content: ":x: Quelqu'un a déjà fermé le ticket !", ephemeral: true});
        }
    }

    if(interaction.customId == "supprimer"){
        // let ticket = await sequelize.query(`SELECT * FROM tickets WHERE id_channel = '${interaction.channelId}';`);
        if (ticket[0][0].statut == 2){
            let guild = client.guilds.cache.get(interaction.guildId);
            let channel = guild.channels.cache.get(interaction.channelId);
            let member = guild.members.cache.get(interaction.user.id);

            if(member.id != ticket[0][0].id_membre && !member.permissionsIn(channel).has("ADMINISTRATOR")) return interaction.reply({ephemeral: true, content: ":x: Vous n'êtes pas autorisé à fermer complétement le ticket, il faut soit attendre que l'utilisateur le ferme définitivement après avoir laissé un avis ou qu'un administrateur le ferme..."});

            await channel.setName(`fermé-${ticket[0][0].id}`);

            channel.permissionOverwrites.edit("686019294978637824", { 'VIEW_CHANNEL': false });
            channel.permissionOverwrites.edit(ticket[0][0].id_membre, { 'VIEW_CHANNEL': false });
            channel.permissionOverwrites.edit("686020581501698126", { 'VIEW_CHANNEL': true, 'MANAGE_CHANNELS': true });
            channel.permissionOverwrites.edit("791438430533058570", { 'VIEW_CHANNEL': true, 'MANAGE_CHANNELS': true });
            channel.permissionOverwrites.edit("767786993765449748", { 'VIEW_CHANNEL': true, 'MANAGE_CHANNELS': true });
            channel.permissionOverwrites.edit("799325532696739890", { 'VIEW_CHANNEL': true, 'MANAGE_CHANNELS': true });
            channel.permissionOverwrites.edit("686019468065112106", { 'VIEW_CHANNEL': true, 'MANAGE_CHANNELS': true });
            channel.permissionOverwrites.edit("824957404021784626", { 'VIEW_CHANNEL': true, 'MANAGE_CHANNELS': true });

            try{
                channel.setParent("768225321269985290"); //Catégorie fermés
            }catch(err){
                console.log(err);
            }

            let message = await interaction.reply(`__**Ticket fermé**__\n\nLe ticket est fermé et peut être archivé !`);
            // sequelize.query(`UPDATE tickets SET statut = '0' WHERE id_channel = '${channel.id}'`);
        }else{
            interaction.reply({ephemeral: true, content: ":x: Le ticket n'est pas dans un statut permettant sa cloture définitive !"})
        }
    }

    if(interaction.customId == "rouvrir"){
        console.log(interaction);
    }
});

client.login(TOKEN);