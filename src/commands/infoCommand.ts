import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import aiService from '../services/aiService.js';
import logger from '../utils/logger.js';

export const infoCommand = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Get information about the bot'),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const providerInfo = aiService.getProviderInfo();

      const embed = new EmbedBuilder()
        .setTitle('Ultimate Discord AI Bot')
        .setDescription('A powerful AI-powered Discord bot')
        .addFields(
          { name: 'Version', value: '1.0.0', inline: true },
          { name: 'AI Provider', value: providerInfo.provider, inline: true },
          { name: 'AI Model', value: providerInfo.model, inline: true },
          {
            name: 'Available Commands',
            value:
              '• `/ask` - Ask anything\n• `/chat` - Have a conversation\n• `/info` - Show this info',
            inline: false
          },
          {
            name: 'Features',
            value: '✅ AI-powered responses\n✅ Real-time streaming\n✅ Multi-language support\n✅ Error handling',
            inline: false
          }
        )
        .setColor(0xffffff)
        .setFooter({
          text: 'Made with ❤️ for Discord',
          iconURL: interaction.client.user?.displayAvatarURL()
        })
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        ephemeral: true
      });

      logger.info(`Info command used by ${interaction.user.tag}`);
    } catch (error) {
      logger.error('Error in info command:', error);

      await interaction.reply({
        content: 'There was an error retrieving bot information.',
        ephemeral: true
      });
    }
  }
};

export default infoCommand;
