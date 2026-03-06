import { ReflowInput } from "../reflow/types";

const scenario: ReflowInput = {
  workCenters: [
    {
      docId: "WC1",
      docType: "workCenter",
      data: {
        name: "Extrusion Line",

        shifts: [
          { dayOfWeek: 1, startHour: 8, endHour: 17 },
          { dayOfWeek: 2, startHour: 8, endHour: 17 },
          { dayOfWeek: 3, startHour: 8, endHour: 17 },
          { dayOfWeek: 4, startHour: 8, endHour: 17 },
          { dayOfWeek: 5, startHour: 8, endHour: 17 }
        ],

        maintenanceWindows: []
      }
    }
  ],

  manufacturingOrders: [],

  workOrders: [
    {
      docId: "WO-X",
      docType: "workOrder",
      data: {
        workOrderNumber: "WO-X",
        manufacturingOrderId: "MO1",
        workCenterId: "WC1",

        startDate: "2024-01-02T16:00:00Z",
        endDate: "2024-01-02T18:00:00Z",

        durationMinutes: 120,

        isMaintenance: false,
        dependsOnWorkOrderIds: []
      }
    }
  ]
};

export default scenario;