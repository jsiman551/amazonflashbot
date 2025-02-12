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
    console.warn("⚠️ Warning: CHANNEL_ID is not set.");
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

// 📌 Handle new users (ONLY sends the welcome message to the channel)
bot.on('new_chat_members', (msg) => {
    const newUsers = msg.new_chat_members || [];
    if (newUsers.length === 0 || !channelId) return;

    for (const newUser of newUsers) {
        const welcomeMessage = `
            🎉 Welcome to @SuperDealsAmazonBot! 

            🔹 This channel is dedicated to bringing you the best **Amazon deals**, **flash sales**, and **exclusive discounts** every day! 🚀💸

            🛒 **Don't miss out!** Check out the **Free Shipping Zone** on Amazon here: [🔗 Click here to explore](https://amzn.to/4jRzgin)

            Stay tuned for amazing savings! 🏷️🔥
        `;
        
        bot.sendMessage(channelId, welcomeMessage)
            .then(() => console.log(`✅ Welcome message sent to the channel for ${newUser.first_name}`))
            .catch(err => console.error("❌ Failed to send welcome message:", err));
    }
});

// 📌 Handle /start command
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Welcome to @SuperDealsAmazonBot! Here you will find the best Amazon deals. Stay tuned! 🚀💸');
});

// 📌 Handle /welcome command (posts in the configured channel)
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
