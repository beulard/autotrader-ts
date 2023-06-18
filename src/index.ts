import chalk from "chalk";
import { Command, Option } from "commander";
import dotenv from "dotenv";
import { Algorithm, Explorer, Miner } from "./algorithms/algorithm";
import { AgentsApi, Configuration } from "./spacetraders-sdk";

dotenv.config()

type AutotraderTypes = {
  [key: string]: Algorithm;
};
const AUTOTRADER_TYPES: AutotraderTypes = {
  MINER: Miner,
  EXPLORER: Explorer,
};

const program = new Command("autotrader-ts");

program
  .requiredOption("-s --ship <symbol>", "Ship symbol")
  .addOption(
    new Option("-t --type <type>", "Type of AI")
      .choices(Object.keys(AUTOTRADER_TYPES))
      .makeOptionMandatory()
  )
  .addOption(
    new Option("-a --token <token>", "Agent token").env("TOKEN").makeOptionMandatory()
  );

program.parse();
const options = program.opts();
const algorithm = AUTOTRADER_TYPES[options.type as string] as Algorithm;

// Get agent info
const config = new Configuration({ accessToken: options.token });
const agentApi = new AgentsApi(config);
agentApi.getMyAgent().then(res => {
  console.log("Welcome, " + chalk.green(res.data.data.symbol));
  console.log("Current credits: " + chalk.blueBright(res.data.data.credits));  

  console.log(
    "Executing " +
      chalk.blue(options.type) +
      " algorithm for ship " +
      chalk.green(options.ship)
  );

  algorithm(options.ship);
}).catch(err => {
  console.log(chalk.red(err))
});
