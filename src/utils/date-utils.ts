import { ReflowInput } from "../reflow/types";

const scenario: ReflowInput = {
  workCenters: [
    {
      docId: "WC1",
      docType: "workCenter",
      data: {
        name: "Extruder Line 1",

        shifts: [
          { dayOfWeek: 1, startHour: 8, endHour: 17 },
          { dayOfWeek: 2, startHour: 8, endHour: 17 },
          { dayOfWeek: 3, startHour: 8, endHour: 17 },
          { dayOfWeek: 4, startHour: 8, endHour: 17 },
          { dayOfWeek: 5, startHour: 8, endHour: 17 }
        ],

        maintenanceWindows: [
          {
            startDate: "2024-01-02T13:00:00Z",
            endDate: "2024-01-02T15:00:00Z",
            reason: "Extruder maintenance"
          }
        ]
      }
    },

    {
      docId: "WC2",
      docType: "workCenter",
      data: {
        name: "Cooling Line",

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

  manufacturingOrders: [
    {
      docId: "MO1",
      docType: "manufacturingOrder",
      data: {
        manufacturingOrderNumber: "MO-400",
        itemId: "PIPE-D",
        quantity: 1000,
        dueDate: "2024-01-10T00:00:00Z"
      }
    }
  ],

  workOrders: [
    {
      docId: "WO-A",
      docType: "workOrder",
      data: {
        workOrderNumber: "WO-A",
        manufacturingOrderId: "MO1",
        workCenterId: "WC1",

        startDate: "2024-01-02T10:00:00Z",
        endDate: "2024-01-02T14:00:00Z",

        durationMinutes: 240,

        isMaintenance: false,
        dependsOnWorkOrderIds: []
      }
    },

    {
      docId: "WO-B",
      docType: "workOrder",
      data: {
        workOrderNumber: "WO-B",
        manufacturingOrderId: "MO1",
        workCenterId: "WC2",

        startDate: "2024-01-02T14:00:00Z",
        endDate: "2024-01-02T16:00:00Z",

        durationMinutes: 120,

        isMaintenance: false,
        dependsOnWorkOrderIds: ["WO-A"]
      }
    },

    {
      docId: "WO-C",
      docType: "workOrder",
      data: {
        workOrderNumber: "WO-C",
        manufacturingOrderId: "MO1",
        workCenterId: "WC1",

        startDate: "2024-01-02T16:00:00Z",
        endDate: "2024-01-02T17:00:00Z",

        durationMinutes: 60,

        isMaintenance: false,
        dependsOnWorkOrderIds: ["WO-B"]
      }
    }
  ]
};

export default scenario;