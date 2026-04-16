const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot çalışıyor");
});

app.listen(3000, () => {
  console.log("Web server aktif");
});

const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
const fs = require('fs');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = "1494363026579652718";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

function getAccount(file) {
  let data = fs.readFileSync(file, "utf-8").split("\n").filter(x => x);
  if (data.length === 0) return null;

  let acc = data[Math.floor(Math.random() * data.length)];
  data = data.filter(x => x !== acc);
  fs.writeFileSync(file, data.join("\n"));

  return acc;
}

const commands = [
  new SlashCommandBuilder()
    .setName('free')
    .setDescription('Hesap seç')
    .addStringOption(option =>
      option.setName('tur')
        .setDescription('Hangi hesap?')
        .setRequired(true)
        .addChoices(
          { name: 'Steam', value: 'steam.txt' },
          { name: 'Valorant', value: 'valorant.txt' },
          { name: 'Disney+', value: 'disney.txt' },
          { name: 'Tivibu', value: 'tivibu.txt' },
          { name: 'TV+', value: 'tvplus.txt' }
        )
    )
].map(c => c.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  await rest.put(Routes.applicationGuildCommands("1494363026579652718" , "1493930510039126176"), { body: commands });
})();

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'free') {
    let file = interaction.options.getString('tur');
    let acc = getAccount(file);

    if (!acc) return interaction.reply("❌ Stok yok");

    interaction.reply({
      content: `✅ Hesabın: ||${acc}||`,
      ephemeral: true
    });
  }
});

client.login(TOKEN);
