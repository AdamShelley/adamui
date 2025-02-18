import { Command } from "commander";
import { add } from "./commands/add";
import chalk from "chalk";

const program = new Command();

program
  .name("adamui")
  .description("CLI for installing Adam UI components")
  .version("0.0.1");

program
  .command("add")
  .description("Add a component to your project")
  .argument("<component>", "name of the component to add")
  .option(
    "-y, --yes",
    "Skip confirmation prompt and use default options",
    false
  )
  .action(add);

program.parse();
