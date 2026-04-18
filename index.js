const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
const fs = require('fs');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = "1494363026579652718";

const FREE_CHANNEL_ID = "1493937563294105660";
const BOOST_CHANNEL_ID = "1493937653291290734";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

function getAccount(file) {
  let data = fs.readFileSync(file, "utf-8").split("\n").filter(x => x);
  if (data.length === 0) return null;

  let acc = data[Math.floor(Math.random() * data.length)];
  data = data.filter(x => x !== acc);
  fs.writeFileSync(file, data.join("\n"));

  return acc;
}

const accountChoices = [
  { name: 'Steam', value: 'steam.txt' },
  { name: 'Valorant', value: 'valorant.txt' },
  { name: 'Disney+', value: 'disney.txt' },
  { name: 'Tivibu', value: 'tivibu.txt' },
  { name: 'TV+', value: 'tvplus.txt' }
];

const commands = [
  new SlashCommandBuilder()
    .setName('free')
    .setDescription('Hesap al')
    .addStringOption(option =>
      option.setName('tur')
        .setDescription('Hangi hesap?')
        .setRequired(true)
        .addChoices(...accountChoices)
    ),
  new SlashCommandBuilder()
    .setName('boost')
    .setDescription('Boost hesap al')
    .addStringOption(option =>
      option.setName('tur')
        .setDescription('Hangi hesap?')
        .setRequired(true)
        .addChoices(...accountChoices)
    )
].map(c => c.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
  console.log("Komutlar kaydedildi.");
})();

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'free') {
    if (interaction.channelId !== FREE_CHANNEL_ID) {
      return interaction.reply({
        content: `❌ Bu komutu sadece <#${FREE_CHANNEL_ID}> kanalında kullanabilirsin.`,
        ephemeral: true
      });
    }

    let file = interaction.options.getString('tur');
    let acc = getAccount(file);

    if (!acc) return interaction.reply({ content: "❌ Stok yok", ephemeral: true });

    return interaction.reply({
      content: `✅ Hesabın: ||${acc}||`,
      ephemeral: true
    });
  }

  if (interaction.commandName === 'boost') {
    if (interaction.channelId !== BOOST_CHANNEL_ID) {
      return interaction.reply({
        content: `❌ Bu komutu sadece <#${BOOST_CHANNEL_ID}> kanalında kullanabilirsin.`,
        ephemeral: true
      });
    }

    let file = interaction.options.getString('tur');
    let acc = getAccount(file);

    if (!acc) return interaction.reply({ content: "❌ Stok yok", ephemeral: true });

    return interaction.reply({
      content: `✅ Boost Hesabın: ||${acc}||`,
      ephemeral: true
    });
  }
});

client.login(TOKEN);
