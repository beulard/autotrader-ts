import { FleetApi } from "../spacetraders-sdk";
import { Explorer } from "./explorer";
import { Miner } from "./miner";

interface Algorithm {
    init: (symbol: string, fleet: FleetApi) => Promise<boolean>;
    update: () => Promise<void>;
}

export { Algorithm, Explorer, Miner };
