const mineflayer = require("mineflayer");
const mc = require('minecraft-protocol');
const http = require("http");
const axios = require('axios');

// --- CONFIG ---
const host = "comscie.falixsrv.me";
const port = 25565;
const botUsername = "AkiraBotV4";

let botInstance = null;
let isBotJoining = false;

// 1. Render Port Setup
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => res.end("Scanner Active")).listen(PORT);

// 2. The Scanner (Checks if players are online without joining)
function scanServer() {
  if (botInstance || isBotJoining) return; // Don't scan if bot is already inside

  mc.ping({ host, port, version: "1.21.11" }, (err, response) => {
    if (err) {
      console.log("Server is offline. Retrying scan in 2 mins...");
      return;
    }

    const onlineCount = response.players.online;
    console.log(`Scan: ${onlineCount} players detected.`);

    if (onlineCount == 0) {
      console.log("No Players found! Launching Bot...");
      startBot();
    }
  });
}

// 3. The Bot Logic
function startBot() {
  isBotJoining = true;
  
  const bot = mineflayer.createBot({
    host,
    port,
    username: botUsername,
    auth: "offline",
    version: "1.21.11",
    viewDistance: 0
  });

  bot.on("resourcePack", () => bot.acceptResourcePack());

  bot.once("spawn", () => {
    botInstance = bot;
    isBotJoining = false;
    console.log("Bot joined the game.");

    // CHECK EVERY MINUTE: Should the bot leave?
    const checkInterval = setInterval(() => {
      if (!bot.players) return;
      
      const playerCount = Object.keys(bot.players).length;
      if (playerCount <= 1) { // Only the bot is left
        console.log("Server is empty. Bot leaving to save resources...");
        clearInterval(checkInterval);
        bot.quit();
      }
    }, 60000);

    // AUTO-CLEAR ITEMS (Every 15 mins while bot is active)
    const clearItemsInterval = setInterval(() => {
      if (botInstance) {
        bot.chat("/kill @e[type=item]");
        console.log("Auto-cleared items.");
      } else {
        clearInterval(clearItemsInterval);
      }
    }, 15 * 60 * 1000);
  });

  bot.on("end", () => {
    botInstance = null;
    isBotJoining = false;
    console.log("Bot disconnected. Returning to Scan Mode.");
  });

  bot.on("error", (err) => console.log("Bot Error:", err.message));
}

// Start the cycle
setInterval(scanServer, 2 * 60 * 1000); // Scan every 2 minutes
scanServer();

// Render Self-Ping
setInterval(() => {
  axios.get('https://mc-bot-egvq.onrender.com/').catch(() => {});
}, 10 * 60 * 1000);