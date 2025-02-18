import { copy } from "fs-extra";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { getDestinationPath } from "../utils/paths";

const components = {
  "search-bar": {
    name: "SearchBar",
    files: ["search-bar.tsx"],
    dependencies: ["framer-motion", "lucide-react"],
  },
  // Add other components here
};

export async function add(componentName: string, options: { yes: boolean }) {
  const component = components[componentName as keyof typeof components];

  if (!component) {
    console.error(chalk.red(`Unknown component: ${componentName}`));
    process.exit(1);
  }

  const spinner = ora(`Installing ${component.name}...`).start();

  try {
    const destinationDir = await getDestinationPath();
    const srcDir = path.join(__dirname, "../../../components", componentName);

    // Copy component files
    await copy(srcDir, path.join(destinationDir, "components", componentName));

    spinner.succeed(chalk.green(`✔ Successfully installed ${component.name}`));

    console.log("\nDependencies required:");
    component.dependencies.forEach((dep) => {
      console.log(chalk.cyan(`  ${dep}`));
    });

    console.log("\nImport the component like this:");
    console.log(
      chalk.cyan(
        `import { ${component.name} } from "@/components/${componentName}/${componentName}";`
      )
    );
  } catch (error) {
    spinner.fail(chalk.red(`Failed to install ${component.name}`));
    console.error(error);
    process.exit(1);
  }
}
