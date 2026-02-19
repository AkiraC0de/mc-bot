# replit.md

## Overview

This is a Minecraft bot project built with Node.js using the **mineflayer** library. The bot connects to a local Minecraft server and listens for chat events. The project is in an early/incomplete state — the chat event handler in `index.js` is not fully implemented. The purpose is to create an automated Minecraft bot that can interact with players and the game world programmatically.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Project Structure
- **`index.js`** — Main entry point. Creates a mineflayer bot instance and defines event handlers. Currently incomplete (the chat handler has no logic after the username check).
- **`package.json`** — Project configuration and dependencies.

### Runtime
- **Node.js** application with no build step. Run directly with `node index.js`.
- No frontend — this is a headless bot that connects to a Minecraft server as a client.

### Bot Configuration
- Connects to a Minecraft server at `localhost:25565` with the username `"bot"`.
- These connection details are hardcoded. Consider making them configurable via environment variables if needed.

### Key Design Decisions
1. **mineflayer as the bot framework** — mineflayer is the most popular and well-maintained Node.js library for creating Minecraft bots. It handles protocol-level communication, authentication, and provides a high-level API for interacting with the game world.
2. **No database or persistence** — The bot currently has no state management or data storage.
3. **No authentication** — The bot connects in offline/cracked mode (no Microsoft account authentication configured). This means it only works with servers that have `online-mode=false`.

### Important Notes for Development
- The code in `index.js` is **incomplete** — the `bot.on("chat", ...)` handler is cut off mid-statement. It needs to be completed.
- A Minecraft server must be running on `localhost:25565` for the bot to connect. Without one, the bot will crash on startup with a connection error.
- The `@types/node` dependency is included but serves no purpose without TypeScript. It can be kept for editor intellisense or removed.

## External Dependencies

### NPM Packages
| Package | Purpose |
|---------|---------|
| `mineflayer` (v2.41.0) | Core Minecraft bot framework — handles connecting to servers, reading game state, and performing actions |
| `@types/node` (v20.x) | TypeScript type definitions for Node.js (used for editor support only) |

### External Services
- **Minecraft Java Edition Server** — Required to be running on `localhost:25565`. The bot acts as a client connecting to this server.
- **Microsoft Authentication (optional)** — mineflayer supports Microsoft account auth via `@azure/msal-node` (included as a transitive dependency). Currently not configured, so the bot only works with offline-mode servers.

### No Database
There is no database in this project. If persistence is needed in the future, consider lightweight options like JSON files or SQLite given the simple nature of the application.