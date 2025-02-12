"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const token = process.env.BOT_TOKEN;
const bot = new node_telegram_bot_api_1.default(token, { polling: true });
bot.on('new_chat_members', (msg) => {
    const newUsers = msg.new_chat_members || [];
    if (newUsers.length === 0)
        return;
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
