import { FleetApi } from "../spacetraders-sdk";
import { Algorithm } from "./algorithm";

class Explorer implements Algorithm {
    public async init(ship: string, fleet: FleetApi) {
        console.log(`Hi ${ship} from explorer`);
        return true;
    }
    public async update() {}
}

export { Explorer };
