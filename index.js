const fs = require('node:fs');
const path = require('node:path');
// const { Client, Collection, GatewayIntentBits } = require('discord.js');
// const { Client, Collection, GatewayIntentBits, Events, LabelBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const {
	Client,
	Collection,
	GatewayIntentBits,
	Events,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder
} = require('discord.js');


const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}


const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.on(Events.InteractionCreate, async interaction => {

	if (interaction.isModalSubmit()) {

		if (interaction.customId === 'myModal') {
			const age = interaction.fields.getTextInputValue('ageInput');
			const hours = interaction.fields.getTextInputValue('hoursInput');
			const name = interaction.fields.getTextInputValue('nameInput');

			await interaction.reply({
				content: `Ton âge : ${age}\nHeures de jeu : ${hours}\nNom RP : ${name}`,
				ephemeral: true
			});
		}
	}
});

client.login(token);