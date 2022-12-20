import { Bot, InlineKeyboard, webhookCallback } from "grammy";
import express from "express";

// Create a bot using the Telegram token
const bot = new Bot(process.env.TELEGRAM_TOKEN || "");

// Handle the /yo command to greet the user
bot.command("yo", (ctx) => ctx.reply(`Yo ${ctx.from?.username}`));

// Handle all other messages and the /start command
const introductionMessage = `Hello! I'm a Telegram bot.
I'm powered by Cyclic, the next-generation serverless computing platform.

<b>Commands</b>
/yo - Be greeted by me
math to math`;

bot.command("start", (ctx: any) => ctx.reply(introductionMessage));

bot.on("message", (ctx: any) => {
  if (/^[()\d\s×x*/+-]+$/.test(ctx.msg.text)) {
    let correctedSigns = ctx.msg.text.replaceAll("x", "*").replaceAll("×", "*").replaceAll("÷", "/").replaceAll(' ', '').replace(/\s/g, '')
    let res = eval(correctedSigns)
    if (res == correctedSigns)
      return false
    ctx.reply(eval(correctedSigns));
    return true
  } else
    ctx.reply(introductionMessage)
});

// Start the server
if (process.env.NODE_ENV === "production") {
  // Use Webhooks for the production server
  const app = express();
  app.use(express.json());
  app.use(webhookCallback(bot, "express"));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Bot listening on port ${PORT}`);
  });
} else {
  // Use Long Polling for development
  bot.start();
}
