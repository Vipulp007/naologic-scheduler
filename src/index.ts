import type { WorkOrderDocument } from "./reflow/types";
import { topologicallySortWorkOrders } from "./reflow/dependency-graph";

const workOrders: WorkOrderDocument[] = [
  {
    docId: "A",
    docType: "workOrder",
    data: {
      workOrderNumber: "A",
      manufacturingOrderId: "MO1",
      workCenterId: "WC1",
      startDate: "",
      endDate: "",
      durationMinutes: 60,
      isMaintenance: false,
      dependsOnWorkOrderIds: [],
    },
  },
  {
    docId: "B",
    docType: "workOrder",
    data: {
      workOrderNumber: "B",
      manufacturingOrderId: "MO1",
      workCenterId: "WC1",
      startDate: "",
      endDate: "",
      durationMinutes: 60,
      isMaintenance: false,
      dependsOnWorkOrderIds: ["A"],
    },
  },
  {
    docId: "C",
    docType: "workOrder",
    data: {
      workOrderNumber: "C",
      manufacturingOrderId: "MO1",
      workCenterId: "WC1",
      startDate: "",
      endDate: "",
      durationMinutes: 60,
      isMaintenance: false,
      dependsOnWorkOrderIds: ["A"],
    },
  },
];

const sorted = topologicallySortWorkOrders(workOrders);
console.log(sorted.map((w) => w.docId));