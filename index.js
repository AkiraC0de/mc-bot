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
let activeIntervals = []; // To keep track of timers and clear them later

const PORT = process.env.PORT || 3000;
http.createServer((req, res) => res.end("Guardian Scanner Active")).listen(PORT);

function scanServer() {
  if (botInstance || isBotJoining) return;

  // Use 1.21.1 for standard compatibility
  mc.ping({ host, port, version: "1.21.11" }, (err, response) => {
    if (err) {
      console.log("Server offline. Retrying scan...");
      return;
    }

    const onlineCount = response.players.online;
    console.log(`Scan: ${onlineCount} players detected.`);

    if (onlineCount === 0) {
      console.log("No Players found! Launching Guardian...");
      startBot();
    }
  });
}

function startBot() {
  isBotJoining = true;
  
  const bot = mineflayer.createBot({
    host, port, username: botUsername,
    auth: "offline", version: "1.21.11",
    viewDistance: 0
  });

  bot.on("resourcePack", () => bot.acceptResourcePack());

  bot.once("spawn", () => {
    botInstance = bot;
    isBotJoining = false;
    console.log("Guardian Joined. Monitoring and Cleaning...");

    // --- MAIN GUARDIAN LOOP (Check Players + Movement) ---
    const mainLoop = setInterval(() => {
      if (!bot.players) return;
      
      const playerCount = Object.keys(bot.players).length;

      // 1. Leave if a real player joins
      if (playerCount > 1) { 
        console.log("Real player detected! Guardian leaving...");
        cleanupAndQuit();
        return;
      }

      // 2. Anti-Idle Micro-Movement
      bot.setControlState('forward', true);
      setTimeout(() => {
        bot.setControlState('forward', false);
        bot.setControlState('back', true);
        setTimeout(() => bot.setControlState('back', false), 400);
      }, 400);

    }, 45000); // Reset idle timer every 45 seconds

    // --- AUTO-CLEAR ITEMS ---
    const clearItemsLoop = setInterval(() => {
      bot.chat("/kill @e[type=item]");
      console.log("Guardian: Cleaned up dropped items.");
    }, 15 * 60 * 1000);

    // Save intervals so we can stop them when the bot leaves
    activeIntervals.push(mainLoop, clearItemsLoop);
  });

  function cleanupAndQuit() {
    activeIntervals.forEach(clearInterval); // Stop all loops
    activeIntervals = [];
    if (botInstance) botInstance.quit();
  }

  bot.on("end", () => {
    botInstance = null;
    isBotJoining = false;
    activeIntervals.forEach(clearInterval); // Safety backup
    activeIntervals = [];
    console.log("Guardian Offline. Returning to Scan Mode.");
  });

  bot.on("error", (err) => console.log("Bot Error:", err.message));
}

// Initial cycles
setInterval(scanServer, 2 * 60 * 1000); 
scanServer();

setInterval(() => {
  axios.get('https://mc-bot-egvq.onrender.com/').catch(() => {});
}, 6 * 60 * 1000);