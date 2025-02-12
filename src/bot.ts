import TelegramBot from 'node-telegram-bot-api';
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const token = process.env.BOT_TOKEN as string;
const channelId = process.env.CHANNEL_ID;
const PORT = process.env.PORT || 3000;

if (!token) {
    throw new Error("❌ BOT_TOKEN is missing in the .env file.");
}

if (!channelId) {
    console.warn("⚠️ Warning: CHANNEL_ID is not set. The /welcome command won't work properly.");
}

const bot = new TelegramBot(token, { polling: true });

// Express server (required for Render/Vercel)
const app = express();
app.get("/", (_req, res) => {
    res.send("Telegram bot is running!");
});
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});

// 📌 Handle new users
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

// 📌 Handle /start command
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Welcome to @SuperDealsAmazonBot! Here you will find the best Amazon deals. Stay tuned! 🚀💸');
});

// 📌 Handle /welcome command (now posts in the configured channel)
bot.onText(/\/welcome/, (msg) => {
    if (!channelId) {
        bot.sendMessage(msg.chat.id, "⚠️ Error: No channel ID is set in the .env file.");
        return;
    }
    
    const welcomeMessage: string = "🎉 Welcome, everyone! Stay tuned for the best Amazon deals. 🚀💸";

    bot.sendMessage(channelId, welcomeMessage)
        .then(() => console.log("✅ Welcome message sent to the channel!"))
        .catch(err => console.error("❌ Failed to send message:", err));
});

console.log("🤖 Bot is running...");
