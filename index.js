const mineflayer = require("mineflayer");

function startBot() {
  try {
    console.log("Starting bot...");
    const bot = mineflayer.createBot({
      host: "comscie.falixsrv.me",
      port: 25565,
      username: "BotNaMarupok",
      auth: "offline",
      viewDistance: 1,
      version: "1.21.11", // Note: Changed to 1.21.1 (Valid version)
    });

    bot.on("resourcePack", () => {
      console.log("Accepting resource pack...");
      bot.acceptResourcePack();
    });

    bot.once("spawn", () => {
      console.log("Bot joined");
      bot.chat("I am here, niggas! Bot na gawa ni Akira");

      // --- ADVANCED ANTI-AFK MOVEMENT ---
      let state = 0;
      setInterval(() => {
        if (!bot.entity) return;

        // Clear all current movements before starting next one
        bot.clearControlStates();

        if (state === 0) {
          // Move Forward & Jump
          bot.setControlState("forward", true);
          bot.setControlState("jump", true);
          console.log("Anti-AFK: Moving Forward");
          state = 1;
        } else {
          // Move Backward & Jump
          bot.setControlState("back", true);
          bot.setControlState("jump", true);
          console.log("Anti-AFK: Moving Backward");
          state = 0;
        }

        // Stop moving after 1 second so we don't walk into lava/off cliffs
        setTimeout(() => {
          bot.clearControlStates();
        }, 1000);
      }, 30000); // Runs every 30 seconds
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

startBot();

const http = require("http");
http.createServer((req, res) => res.end("alive")).listen(3000);
console.log("Server is running on port 3000");
