import { ReflowService } from "./reflow/reflow.service";

import delay from "./utils/delay-data";
import maintenance from "./utils/maintainance-data";
import shift from "./utils/shift-data";

const service = new ReflowService();

console.log("Delay Scenario");
console.log(service.reflow(delay));

console.log("Maintenance Scenario");
console.log(service.reflow(maintenance));

console.log("Shift Scenario");
console.log(service.reflow(shift));