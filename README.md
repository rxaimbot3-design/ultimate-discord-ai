# Ultimate Discord AI Bot

A powerful, production-ready Discord bot with AI integration, built with TypeScript and Discord.js.

## Features

- **AI-Powered Responses** - Uses OpenAI GPT-4 or Anthropic Claude for intelligent responses
- **Multiple Commands** - `/ask`, `/chat`, `/info`
- **Error Handling** - Comprehensive error handling and logging
- **TypeScript** - Fully typed for better development experience
- **Scalable** - Ready for production deployment
- **Logging** - Winston logger for debugging and monitoring

## Installation

### Prerequisites

- Node.js 18+
- npm or yarn or pnpm
- Discord Bot Token
- OpenAI or Anthropic API Key

### Setup

1. Clone the repository:
```bash
git clone https://github.com/rxaimbot3-design/ultimate-discord-ai.git
cd ultimate-discord-ai
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Fill in your credentials in `.env`:
```
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_client_id
OPENAI_API_KEY=your_openai_key
# OR
ANTHROPIC_API_KEY=your_anthropic_key
```

## Getting Discord Credentials

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" section and create a bot
4. Copy the token and set `DISCORD_TOKEN`
5. Go to "General Information" and copy the Client ID for `DISCORD_CLIENT_ID`
6. Go to OAuth2 > URL Generator, select `bot` scope and needed permissions
7. Use the generated URL to invite the bot to your server

## Getting API Keys

### OpenAI
- Visit [OpenAI Platform](https://platform.openai.com)
- Create an account and go to API keys
- Generate a new API key

### Anthropic
- Visit [Anthropic Console](https://console.anthropic.com)
- Create an account and generate an API key

## Usage

### Development

```bash
npm run dev
```

The bot will start watching for file changes and reload automatically.

### Build

```bash
npm run build
```

### Production

```bash
npm run start
```

## Commands

### `/ask <question>`
Ask the AI bot anything. Get intelligent responses powered by AI.

**Example:** `/ask What is the capital of France?`

### `/chat <message>`
Have a natural conversation with the AI bot.

**Example:** `/chat Tell me a joke`

### `/info`
Get information about the bot, including the AI provider and available commands.

## Project Structure

```
ultimate-discord-ai/
├── src/
│   ├── commands/          # Discord slash commands
│   │   ├── askCommand.ts
│   │   ├── chatCommand.ts
│   │   └── infoCommand.ts
│   ├── services/          # Business logic
│   │   └── aiService.ts   # AI integration
│   ├── utils/             # Utilities
│   │   └── logger.ts      # Winston logger
│   └── index.ts           # Main bot file
├── dist/                  # Compiled JavaScript (auto-generated)
├── logs/                  # Bot logs (auto-generated)
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore file
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## Configuration

### Log Levels

Set `LOG_LEVEL` in `.env` to control logging verbosity:
- `error` - Only errors
- `warn` - Warnings and errors
- `info` - General information (default)
- `debug` - Detailed debugging

Example:
```
LOG_LEVEL=debug
```

### Environment

- `NODE_ENV` - Set to `production` for production deployment

## Deployment

### Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Railway / Heroku

1. Push your code
2. Set environment variables
3. Set start command to `npm run start`
4. Deploy

### Self-Hosted

1. Clone repository on your server
2. Run `npm install`
3. Create `.env` file with credentials
4. Run `npm run build`
5. Use `npm run start` to start the bot
6. Consider using `pm2` for process management

## Troubleshooting

### Bot won't start
- Check if `DISCORD_TOKEN` is valid
- Ensure `DISCORD_CLIENT_ID` is correct
- Check if Node.js version is 18+

### Commands not appearing
- Wait 5-10 minutes for Discord to sync commands
- Try rejoining the server
- Check bot permissions in server settings

### AI not responding
- Verify API key is valid and has credits
- Check rate limits (OpenAI/Anthropic have usage limits)
- Review logs for specific error messages

### Permission denied errors
- Ensure bot has "Use Slash Commands" and "Send Messages" permissions
- Check channel permissions for the bot role

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for any purpose

## Support

For issues and questions:
- Check the logs in `logs/` directory
- Review error messages carefully
- Check Discord permissions
- Verify API credentials are correct

## Credits

Made with ❤️ by rxaimbot3-design

## Changelog

### v1.0.0 (Initial Release)
- Basic Discord.js setup
- AI integration (OpenAI & Anthropic)
- Three core commands: ask, chat, info
- Comprehensive logging
- Production-ready error handling
