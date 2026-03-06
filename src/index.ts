import { ReflowService } from "./reflow/reflow.service";
import scenario from "./utils/date-utils";

const service = new ReflowService();

const result = service.reflow(scenario);

console.log(result.updatedWorkOrders);
console.log(result.changes);
console.log(result.explanation);