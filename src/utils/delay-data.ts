import { ReflowInput } from "../reflow/types";

const scenario: ReflowInput = {
  workCenters: [
    {
      docId: "WC1",
      docType: "workCenter",
      data: {
        name: "Extrusion Line 1",
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
      docId: "WO-A",
      docType: "workOrder",
      data: {
        workOrderNumber: "WO-A",
        manufacturingOrderId: "MO1",
        workCenterId: "WC1",
        startDate: "2024-01-02T08:00:00Z",
        endDate: "2024-01-02T11:00:00Z",
        durationMinutes: 300,
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
        workCenterId: "WC1",
        startDate: "2024-01-02T11:00:00Z",
        endDate: "2024-01-02T13:00:00Z",
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
        startDate: "2024-01-02T13:00:00Z",
        endDate: "2024-01-02T15:00:00Z",
        durationMinutes: 120,
        isMaintenance: false,
        dependsOnWorkOrderIds: ["WO-B"]
      }
    }
  ]
};

export default scenario;