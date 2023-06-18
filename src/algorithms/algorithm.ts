import { Miner } from "./miner";
import { Explorer } from "./explorer";

type Algorithm = (ship: string) => number;

export { Algorithm, Miner, Explorer };
