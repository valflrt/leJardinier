# Customization

## Commands

### Creating commands

The class [`Command`](../src/features/commands/classes/command.ts) is used to create commands:

```typescript
import Command from ".../features/commands/classes/command";
import * as utils from ".../utils";

import reactions from ".../assets/reactions";

const hey_cmd = new Command({
  name: "hey",
  description: "Greet the bot",
  execution: async ({ actions, message }) => {
    actions.sendTextEmbed(
      `${utils.randomItem("Hey", "Hii", "Heyaa", "Yo")} `.concat(
        `${message.author.toString()} ${reactions.smile.random}`
      )
    );
  },
});

export default hey_cmd;
```

To set up the command you need to provide a setup object. (see [`ICommandSetup`](/src/features/commands/types/commandSetup.ts))

The fields of the setup object are:

- `name` (string, required) — The command name, will be used in command display/preview (such as in command "help").
- `identifier` (string, optional) — The command identifier, will be used in command calls. If not set, the command name is used instead.
- `description` (string, required) — The command description.
- `execution` (function, required) — The command execution, the function executed when the command is called. (see [](/src/features/commands/types/executionFunction.ts))
- `commands` (array, optional) — The subcommands, an array of commands.
- `parameters` (array, optional) — The command parameters, the parameters that the command requires (or not), those are only used for command preview. (see [`ICommandParameter`](/src/features/commands/types/commandParameter.ts))
- `aliases` (string array, optional) — The command aliases, command call alternative, you can call the command with its identifier or with its aliases.
- `settings` (object, optional) — The command settings, advanced command configuration (set the command as hidden for example). (see [`ICommandSettings`](/src/features/commands/types/commandSettings.ts))