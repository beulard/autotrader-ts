import chalk from "chalk";
import { FleetApi } from "../spacetraders-sdk";
import { Algorithm } from "./algorithm";

// TODO pause mechanism (no fetch for X seconds, e.g. while in transit)
// TODO State machine/statechart?
class Miner implements Algorithm {
    private _symbol: string = "";
    private _fleetApi: FleetApi | null = null;

    private log(...message: any[]) {
        const date = new Date();
        console.log(`[${chalk.gray(date.toISOString())}][${chalk.cyan(this._symbol)}]`, ...message);
    }

    public async init(symbol: string, fleet: FleetApi) {
        this._symbol = symbol;
        this._fleetApi = fleet;
        console.log("Miner init", symbol);
        const ship = (await fleet.getMyShip(symbol)).data.data;
        console.log(chalk.green("Init " + ship.symbol + " ok!"));
        return true;
    }

    public async update() {
        this.log("Miner", this._symbol);
    }
}

export { Miner };
