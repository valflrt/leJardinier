# Changelog

## [`[Unreleased]`](#) - dd/mm/yyyy

### Changed

- Enhanced logger
- Moved and renamed class "BaseLogger" to features/logger/index.ts as "Logger"

## [`[v3.6.6]`](https://github.com/valflrt/lejardinier/releases/tag/v3.6.6) - 04/02/2022

### Added

- Added class UserStats
- Added class ListenerCollection

### Changed

- Renamed "factorize" feature to "quantify"
- Fixed command "music.skip" because it wasn't actually skipping the current track
- Edited the panel of the command "rank"
- Edited script `lint` in package.json
- Changed the way of setting client event listeners

## [`[v3.6.5]`](https://github.com/valflrt/lejardinier/releases/tag/v3.6.5) - 28/01/2022

### Changed

- Changed the way of handling message answering
- Changed class `Command` (renamed from CCommand) and implemented it
- Improved factorize
- Added tests for commandPreview and messageParser
- Changed command `autorole`
- Removed subcommand `help.website` and added link buttons to access Le Jardinier website and my github profile) directly in command `help`
- Split command `morse` into multpile files

[**`full changelog`**](https://github.com/valflrt/lejardinier/compare/v3.5.4...v3.6.5)

## [`[v3.5.4]`](https://github.com/valflrt/lejardinier/releases/tag/v3.5.4) - 22/01/2022

### Added

- Added `Procfile` for Heroku deployment
- Added a formatter ("factorize") that turns large numbers into small numbers with suffixes (e.g.: 1000 turns into 1K, 58356461 turns into 58.3B, ...)

### Changed

- Totally reworked bot message handling structure
- Improved command `rank`
- Changed commands' structure , split large commands into folders with index.ts and subcommands in a subfolder
- Command stats has been renamed to rank
- Config is now loaded from .env (or from preset env variables) instead of a local ts file

### Fixed

- Fixed morse formatter, it wasn't able to encode capitalized letters

[**`full changelog`**](https://github.com/valflrt/lejardinier/compare/v3.4.3...v3.5.4)

## [`[v3.4.3]`](https://github.com/valflrt/lejardinier/releases/tag/v3.4.3) - 08/01/2022

### Added

- Added command `stats`: Enables guild members to see their stats (level and xp) using a generated image (using canvas module)

### Changed

- New youtube api handler
  - Add googleapis module
- New music system: command music working properly
- Added some tests (github workflow)
- Added a Regular Expression collection
- Command `music` is now split in multiple files
- Changed config system

### Fixed

- Fixed small deprecation issue (discord.js)

[**`full changelog`**](https://github.com/valflrt/lejardinier/compare/v3.3.1...v3.4.3)

## [`[v3.3.1]`](https://github.com/valflrt/lejardinier/releases/tag/v3.3.1) - 20/12/2021

### Added

- Added command `kick`: Enables administrators to kick members
- Added command `ban`: Enables administrators to ban members
- Added command `autorole`: Enables administrators to add an automatic role issuer
- Added subcommand `music.add.playlisturl`: enables people to add multiples songs at once in the playlist by specifying a youtube playlist (url)

### Changed

- New database system from [`lejardinier-database`](https://github.com/valflrt/lejardinier-database) (has been slightly improved within this project)
- Added database middleware that updates members' stats for every message and handles automatic role issuer `src/middlewares/database.ts`
- Improved Dockerfile
- Changed folder structure

### Fixed

- Fixed command `music` aliases

[**`full changelog`**](https://github.com/valflrt/lejardinier/compare/v3.2.4...v3.3.1)

## [`[v3.2.4]`](https://github.com/valflrt/lejardinier/releases/tag/v3.2.4) - 08/12/2021

### Added

- the subcommand [command].help (command's own help subcommand) can now be auto-generated
- Added subcommand `help.usage`: gives more information about how to use the bot
- Added command `reverse`: reverses the given text
- Added command `choose`: chooses an item from the given ones
- Added command `time`: gives time with a discord timestamp

### Changed

- Changed config structure
- Command "morse" now supports much more characters

## [`[v3.2.0]`](https://github.com/valflrt/lejardinier/releases/tag/3.2) - 03/12/2021

### Added

- Created command manager
- Created command class
- Improved command search method
- Created hierarchy system to ease command management
- Added new command features
  - Command identifier
  - Command aliases
- Added command reverse: reverses the given text
- Added command choose: chooses an item from the given ones
- Added command time: gives time with a discord timestamp

_oldest versions not registered here because i wasn't keeping the track of them (i wasn't aware of rules about semantic versioning and i am still learning so don't mind please)_
