const mineflayer = require("mineflayer");

function startBot() {
  try {
    console.log("Starting bot...");
    const bot = mineflayer.createBot({
      host: "comscie.falixsrv.me",
      port: 25565,
      username: "BotNaMarupok",
      auth: "offline",
      version: "1.21.1", // Updated to match server version 1.21.1
      checkTimeoutInterval: 60000,
    });

    bot.once("spawn", () => {
      console.log("Bot joined");

      setInterval(() => {
        if (bot.entity) {
          bot.setControlState("jump", true);
          setTimeout(() => bot.setControlState("jump", false), 400);
        }
      }, 30000);
    });

    bot.on("chat", (username, message) => {
      if (username === bot.username) return;
      console.log(`${username}: ${message}`);
    });

    bot.on("end", (reason) => {
      console.log(`Disconnected: ${reason}. Retrying in 15s...`);
      setTimeout(startBot, 15000);
    });

    bot.on("error", (err) => {
      console.log("Bot Error:", err.message);
    });

    bot.on("kicked", (reason) => {
      console.log("Kicked from server:", reason);
    });
  } catch (e) {
    console.log("Creation Error:", e.message);
    setTimeout(startBot, 15000);
  }
}

// Ensure the environment is ready
setTimeout(startBot, 2000);
