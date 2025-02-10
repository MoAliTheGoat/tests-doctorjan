const { Telegraf } = require("telegraf");

const BOT_TOKEN = "7647221272:AAGyYtA5jkAEZPv-Ci5b9TwZmfH7gZa4T_I";  // Replace with your real bot token
const BASE_WEB_LINK = "https://doctorjan.netlify.app?userId=REPLACE_USER_ID&userName=REPLACE_USER_NAME";  // Placeholder for userId and userName

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
    const userId = ctx.from.id;  // Get Telegram User ID
    const userName = ctx.from.first_name || ctx.from.last_name || ctx.userName;  // Get username or set to 'Unknown' if not set

    const webAppUrl = BASE_WEB_LINK
        .replace("REPLACE_USER_ID", userId)
        .replace("REPLACE_USER_NAME", encodeURIComponent(userName));  // Replace placeholders

    ctx.reply("سلام " + ctx.from.first_name + " " + "عزیز. " + "\nبرای شروع به‌ کار دکترجان روی دکمه‌ی پایینی کلیک کن 👇", {
        reply_markup: {
            keyboard: [
                [{ text: "شروع 👨‍⚕️", web_app: { url: webAppUrl } }]
            ],
            one_time_keyboard: true, // Optionally hide the keyboard after pressing the button
            input_field_placeholder: "Type your message...", // Add placeholder to input field
        },
    });
});

bot.launch();
console.log("🚀 Bot is running...");
