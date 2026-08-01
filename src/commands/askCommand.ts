import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';
import aiService from '../services/aiService.js';
import logger from '../utils/logger.js';

export const askCommand = {
  data: new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Ask the AI bot anything!')
    .addStringOption((option) =>
      option
        .setName('question')
        .setDescription('Your question or prompt')
        .setRequired(true)
        .setMaxLength(2000)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply();

      const question = interaction.options.getString('question', true);

      logger.info(`User ${interaction.user.tag} asked: ${question.substring(0, 50)}...`);

      // Show typing indicator
      await interaction.channel?.sendTyping();

      // Get AI response
      const response = await aiService.generateResponse(question, {
        system:
          'You are a helpful Discord bot. Keep responses concise and friendly. Use markdown formatting when appropriate.'
      });

      // Split long responses into chunks (Discord message limit is 2000 chars)
      const chunks = response.match(/[\s\S]{1,1950}/g) || [response];

      const embed = new EmbedBuilder()
        .setTitle('AI Response')
        .setDescription(chunks[0])
        .setColor(0x0099ff)
        .setFooter({
          text: `Provider: ${aiService.getProviderInfo().provider}`,
          iconURL: interaction.user.displayAvatarURL()
        })
        .setTimestamp();

      const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId('ask_again')
          .setLabel('Ask Something Else')
          .setStyle(ButtonStyle.Primary)
      );

      await interaction.editReply({
        embeds: [embed],
        components: [button]
      });

      // Send remaining chunks if any
      if (chunks.length > 1) {
        for (let i = 1; i < chunks.length; i++) {
          await interaction.followUp({
            content: chunks[i],
            ephemeral: false
          });
        }
      }

      logger.info(`Successfully responded to ${interaction.user.tag}`);
    } catch (error) {
      logger.error('Error in ask command:', error);

      await interaction.editReply({
        content:
          'Sorry, I encountered an error while processing your question. Please try again later.'
      });
    }
  }
};

export default askCommand;
