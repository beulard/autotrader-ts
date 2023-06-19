import chalk from "chalk";
import { Command, Option } from "commander";
import dotenv from "dotenv";
import { Algorithm, Explorer, Miner } from "./algorithms/algorithm";
import { AgentsApi, Configuration, FleetApi } from "./spacetraders-sdk";

// Try to read TOKEN from .env
dotenv.config();

type AutotraderTypes = {
    [key: string]: Algorithm;
};
const AUTOTRADER_TYPES: AutotraderTypes = {
    MINER: new Miner(),
    EXPLORER: new Explorer(),
};

const program = new Command("autotrader-ts");

program
    .requiredOption("-s --ship <symbol>", "Ship symbol")
    .addOption(
        new Option("-t --type <type>", "Type of AI").choices(Object.keys(AUTOTRADER_TYPES)).makeOptionMandatory()
    )
    .addOption(new Option("-a --token <token>", "Agent token").env("TOKEN").makeOptionMandatory());

program.parse();
const options = program.opts();
const algorithm = AUTOTRADER_TYPES[options.type as string] as Algorithm;

// Get agent info
const config = new Configuration({ accessToken: options.token });
const agentApi = new AgentsApi(config);
const fleetApi = new FleetApi(config);
agentApi
    .getMyAgent()
    .then(async (res) => {
        console.log("Welcome, " + chalk.green(res.data.data.symbol));
        console.log("Current credits: " + chalk.blueBright(res.data.data.credits));

        console.log("Executing " + chalk.blue(options.type) + " algorithm for ship " + chalk.green(options.ship));

        const ok = await algorithm.init(options.ship, fleetApi).catch((err) => {
            console.log(err.response.request.method + " " + chalk.red(err.response.request.path));
            console.log(err.response.data);
        });
        if (ok) {
            setInterval(() => algorithm.update(), 1000);
        }
    })
    .catch((err) => {
        console.log(chalk.red(err));
    });
