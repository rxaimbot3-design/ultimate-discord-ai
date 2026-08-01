import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder
} from 'discord.js';
import aiService from '../services/aiService.js';
import logger from '../utils/logger.js';

export const chatCommand = {
  data: new SlashCommandBuilder()
    .setName('chat')
    .setDescription('Have a conversation with the AI bot')
    .addStringOption((option) =>
      option
        .setName('message')
        .setDescription('Your message')
        .setRequired(true)
        .setMaxLength(2000)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply();

      const userMessage = interaction.options.getString('message', true);

      logger.info(`Chat message from ${interaction.user.tag}: ${userMessage.substring(0, 50)}...`);

      // Generate response
      const response = await aiService.generateResponse(userMessage, {
        system:
          'You are a friendly Discord bot. Engage in natural conversation. Keep responses concise but warm and helpful.'
      });

      const embed = new EmbedBuilder()
        .setTitle(`Chat with ${interaction.client.user?.username || 'Bot'}`)
        .addFields(
          { name: 'Your message', value: userMessage.substring(0, 1024), inline: false },
          { name: 'Response', value: response.substring(0, 1024), inline: false }
        )
        .setColor(0x00ff00)
        .setFooter({
          text: `Requested by ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL()
        })
        .setTimestamp();

      await interaction.editReply({
        embeds: [embed]
      });

      logger.info(`Chat response sent to ${interaction.user.tag}`);
    } catch (error) {
      logger.error('Error in chat command:', error);

      await interaction.editReply({
        content: 'Sorry, I had trouble processing that. Please try again.'
      });
    }
  }
};

export default chatCommand;
