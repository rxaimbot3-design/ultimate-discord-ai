import 'dotenv/config';
import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import logger from './utils/logger.js';
import { askCommand } from './commands/askCommand.js';
import { chatCommand } from './commands/chatCommand.js';
import { infoCommand } from './commands/infoCommand.js';

// Validate required environment variables
const requiredEnvVars = ['DISCORD_TOKEN', 'DISCORD_CLIENT_ID'];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  logger.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Type declaration for commands
interface Command {
  data: any;
  execute: (interaction: any) => Promise<void>;
}

// Create commands collection
const commands = new Collection<string, Command>();

// Register commands
const commandList = [askCommand, chatCommand, infoCommand];
commandList.forEach((command) => {
  commands.set(command.data.name, command);
});

logger.info(`Registered ${commands.size} commands`);

// Ready event
client.once('ready', async () => {
  logger.info(`Bot is online as ${client.user?.tag}`);

  try {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

    logger.info('Started refreshing application (/) commands.');

    const data = (await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), {
      body: commandList.map((cmd) => cmd.data.toJSON())
    })) as Array<any>;

    logger.info(`Successfully registered ${data.length} application commands.`);
  } catch (error) {
    logger.error('Error registering commands:', error);
  }
});

// Interaction create event
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  const command = commands.get(interaction.commandName);

  if (!command) {
    logger.warn(`Command not found: ${interaction.commandName}`);
    await interaction.reply({
      content: 'This command does not exist.',
      ephemeral: true
    });
    return;
  }

  try {
    logger.info(`Executing command: ${interaction.commandName} by ${interaction.user.tag}`);
    await command.execute(interaction);
  } catch (error) {
    logger.error(`Error executing command ${interaction.commandName}:`, error);

    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          ephemeral: true
        });
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true
        });
      }
    } catch (replyError) {
      logger.error('Error sending error message:', replyError);
    }
  }
});

// Error handlers
client.on('error', (error) => {
  logger.error('Discord client error:', error);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Login
client.login(process.env.DISCORD_TOKEN);

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  client.destroy();
  process.exit(0);
});

export default client;
