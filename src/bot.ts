import TelegramBot from 'node-telegram-bot-api';
import dotenv from "dotenv";

dotenv.config();

const token = process.env.BOT_TOKEN as string;
const bot = new TelegramBot(token, { polling: true });

bot.on('new_chat_members', (msg) => {
    const newUsers = msg.new_chat_members || [];
    if (newUsers.length === 0) return;

    for (const newUser of newUsers) {
        if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') {
            const welcomeMessage: string = `Welcome to @SuperDealsAmazonBot, ${newUser.first_name}! Stay tuned for amazing Amazon deals and flash sales. 🚀💸`;
            bot.sendMessage(msg.chat.id, welcomeMessage);
        }
    }
});

// Handle /start command
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Welcome to @SuperDealsAmazonBot! Here you will find the best Amazon deals. Stay tuned! 🚀💸');
});
