import TelegramBot from 'node-telegram-bot-api';
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const token = process.env.BOT_TOKEN as string;
const PORT = process.env.PORT || 3000;

const bot = new TelegramBot(token, { polling: true });

// Express server to keep Render/Vercel happy
const app = express();
app.get("/", (_req, res) => {
    res.send("Telegram bot is running!");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Handle new users
bot.on('new_chat_members', (msg) => {
    const newUsers = msg.new_chat_members || [];
    if (newUsers.length === 0) return;

    for (const newUser of newUsers) {
        if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') {
            const welcomeMessage = `Welcome to @SuperDealsAmazonBot, ${newUser.first_name}! Stay tuned for amazing Amazon deals and flash sales. 🚀💸`;
            bot.sendMessage(msg.chat.id, welcomeMessage);
        }
    }
});

// Handle /start command
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Welcome to @SuperDealsAmazonBot! Here you will find the best Amazon deals. Stay tuned! 🚀💸');
});

// Handle /welcome command
bot.onText(/\/welcome/, (msg) => {
    const chatId: string = msg.chat.id.toString();
    const welcomeMessage: string = "🎉 Welcome, everyone! Stay tuned for the best Amazon deals. 🚀💸";
    bot.sendMessage(chatId, welcomeMessage);
});
