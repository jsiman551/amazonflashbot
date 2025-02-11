import TelegramBot from 'node-telegram-bot-api';
import dotenv from "dotenv";

dotenv.config();

const token: any = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.on('new_chat_members', (msg) => {
    if (!msg.new_chat_members || msg.new_chat_members.length === 0) {
        return;
    }
    const newUser = msg.new_chat_members[0];
    if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') {
        const welcomeMessage: string = `Welcome to @SuperDealsAmazonBot, ${newUser.first_name}! Stay tuned for amazing Amazon deals and flash sales. 🚀💸`;
        bot.sendMessage(msg.chat.id, welcomeMessage);
    }
});

// add commands, so bot can respond to them
bot.onText(/\/start/, (msg) => {
  const chatId: string = msg.chat.id.toString();
  bot.sendMessage(chatId, 'Welcome to @SuperDealsAmazonBot! Here you will find the best Amazon deals. Stay tuned! 🚀💸');
});
