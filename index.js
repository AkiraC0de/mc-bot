const mineflayer = require("mineflayer");

function startBot() {
  const bot = mineflayer.createBot({
    host: "comscie.falixsrv.me",
    port: 25565,
    username: "BotNaMarupok",
    auth: "offline",
    version: "1.20.1",
    checkTimeoutInterval: 60000,
  });

  bot.once("spawn", () => {
    console.log("Bot joined");

    setInterval(() => {
      bot.setControlState("jump", true);
      setTimeout(() => bot.setControlState("jump", false), 400);
    }, 30000);
  });

  bot.on("end", () => {
    console.log("Disconnected. Retrying in 15s...");
    setTimeout(startBot, 15000);
  });

  bot.on("error", console.log);
}

try {
  startBot();
} catch (error) {
  console.log("Error test: " + error?.message);
}
