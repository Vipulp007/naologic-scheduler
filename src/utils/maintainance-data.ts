import { ReflowInput } from "../reflow/types";

const scenario: ReflowInput = {
  workCenters: [
    {
      docId: "WC1",
      docType: "workCenter",
      data: {
        name: "Extruder 1",
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
            reason: "Scheduled machine maintenance"
          }
        ]
      }
    }
  ],

  manufacturingOrders: [],

  workOrders: [
    {
      docId: "WO-1",
      docType: "workOrder",
      data: {
        workOrderNumber: "WO-1",
        manufacturingOrderId: "MO1",
        workCenterId: "WC1",
        startDate: "2024-01-02T12:00:00Z",
        endDate: "2024-01-02T16:00:00Z",
        durationMinutes: 240,
        isMaintenance: false,
        dependsOnWorkOrderIds: []
      }
    }
  ]
};

export default scenario;