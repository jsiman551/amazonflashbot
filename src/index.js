"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
// Configuración del bot en inglés
const tokenEnglish = process.env.BOT_TOKEN;
const channelIdEnglish = process.env.CHANNEL_ID;
// Configuración del bot en español
const tokenSpanish = process.env.BOT_TOKEN_ES;
const channelIdSpanish = process.env.CHANNEL_ID_ES;
const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = process.env.WEBHOOK_URL; // URL pública donde está alojado tu servidor
// Verificar tokens y URL del Webhook
if (!tokenEnglish || !tokenSpanish || !WEBHOOK_URL) {
    throw new Error("❌ Faltan tokens o la URL del Webhook en el archivo .env.");
}
// Inicializar ambos bots
const botEnglish = new node_telegram_bot_api_1.default(tokenEnglish);
const botSpanish = new node_telegram_bot_api_1.default(tokenSpanish);
// Servidor Express
const app = (0, express_1.default)();
// Middleware para parsear el cuerpo de las solicitudes
app.use(express_1.default.json());
// Ruta para el Webhook de Telegram
app.post(`/webhook/${tokenEnglish}`, (req, res) => {
    botEnglish.processUpdate(req.body);
    res.sendStatus(200);
});
app.post(`/webhook/${tokenSpanish}`, (req, res) => {
    botSpanish.processUpdate(req.body);
    res.sendStatus(200);
});
// Ruta de inicio para HTTP
app.get('/', (_req, res) => {
    res.send('¡Ambos bots de Telegram están en funcionamiento!');
});
// Iniciar el servidor HTTP
app.listen(PORT, () => {
    console.log(`✅ Servidor en funcionamiento en el puerto ${PORT}`);
});
// Configurar el Webhook para ambos bots
botEnglish.setWebHook(`${WEBHOOK_URL}/webhook/${tokenEnglish}`)
    .then(() => console.log('✅ Webhook configurado para el bot en inglés'))
    .catch(err => console.error('❌ Error al configurar el Webhook para el bot en inglés:', err));
botSpanish.setWebHook(`${WEBHOOK_URL}/webhook/${tokenSpanish}`)
    .then(() => console.log('✅ Webhook configurado para el bot en español'))
    .catch(err => console.error('❌ Error al configurar el Webhook para el bot en español:', err));
// ==================================================
// Lógica del bot en inglés
// ==================================================
// 📌 Manejar nuevos usuarios (inglés)
botEnglish.on('new_chat_members', (msg) => {
    const newUsers = msg.new_chat_members || [];
    if (newUsers.length === 0 || !channelIdEnglish)
        return;
    for (const newUser of newUsers) {
        const welcomeMessage = `
            🎉 Welcome to @SuperDealsAmazonBot! 

            🔹 This channel is dedicated to bringing you the best **Amazon deals**, **flash sales**, and **exclusive discounts** every day! 🚀💸

            🛒 **Don't miss out!** Check out the **Free Shipping Zone** on Amazon here: [🔗 Click here to explore](https://amzn.to/4jRzgin)

            Stay tuned for amazing savings! 🏷️🔥
        `;
        botEnglish.sendMessage(channelIdEnglish, welcomeMessage)
            .then(() => console.log(`✅ Welcome message sent to the channel for ${newUser.first_name}`))
            .catch(err => console.error('❌ Failed to send welcome message:', err));
    }
});
// 📌 Manejar /start (inglés)
botEnglish.onText(/\/start/, (msg) => {
    botEnglish.sendMessage(msg.chat.id, 'Welcome to @SuperDealsAmazonBot! Here you will find the best Amazon deals. Stay tuned! 🚀💸');
});
// 📌 Manejar /welcome (inglés)
botEnglish.onText(/\/welcome/, (msg) => {
    if (!channelIdEnglish) {
        botEnglish.sendMessage(msg.chat.id, '⚠️ Error: No channel ID is set in the .env file.');
        return;
    }
    const welcomeMessage = '🎉 Welcome, everyone! Stay tuned for the best Amazon deals. 🚀💸';
    botEnglish.sendMessage(channelIdEnglish, welcomeMessage)
        .then(() => console.log('✅ Welcome message sent to the channel!'))
        .catch(err => console.error('❌ Failed to send message:', err));
});
// ==================================================
// Lógica del bot en español
// ==================================================
// 📌 Manejar nuevos usuarios (español)
botSpanish.on('new_chat_members', (msg) => {
    const newUsers = msg.new_chat_members || [];
    if (newUsers.length === 0 || !channelIdSpanish)
        return;
    for (const newUser of newUsers) {
        const welcomeMessage = `
            🎉 ¡Bienvenido a @SuperOfertasAmazonBot! 

            🔹 Este canal está dedicado a traerte las mejores **ofertas de Amazon**, **ventas flash** y **descuentos exclusivos** todos los días! 🚀💸

            🛒 **¡No te lo pierdas!** Echa un vistazo a la **Zona de Envío Gratis** en Amazon aquí: [🔗 Haz clic aquí para explorar](https://amzn.to/4jRzgin)

            ¡Mantente atento para ahorrar mucho! 🏷️🔥
        `;
        botSpanish.sendMessage(channelIdSpanish, welcomeMessage)
            .then(() => console.log(`✅ Mensaje de bienvenida enviado al canal para ${newUser.first_name}`))
            .catch(err => console.error('❌ Error al enviar el mensaje de bienvenida:', err));
    }
});
// 📌 Manejar /start (español)
botSpanish.onText(/\/start/, (msg) => {
    botSpanish.sendMessage(msg.chat.id, '¡Bienvenido a @SuperOfertasAmazonBot! Aquí encontrarás las mejores ofertas de Amazon. ¡Mantente atento! 🚀💸');
});
// 📌 Manejar /bienvenida (español)
botSpanish.onText(/\/bienvenida/, (msg) => {
    if (!channelIdSpanish) {
        botSpanish.sendMessage(msg.chat.id, '⚠️ Error: No hay un ID de canal configurado en el archivo .env.');
        return;
    }
    const welcomeMessage = '🎉 ¡Bienvenidos todos! Manténganse atentos para las mejores ofertas de Amazon. 🚀💸';
    botSpanish.sendMessage(channelIdSpanish, welcomeMessage)
        .then(() => console.log('✅ Mensaje de bienvenida enviado al canal!'))
        .catch(err => console.error('❌ Error al enviar el mensaje:', err));
});
console.log('🤖 Bot en inglés en funcionamiento...');
console.log('🤖 Bot en español en funcionamiento...');
