import {DateTime} from "luxon";

export interface BaseDocument<T> {
  docId: string;
  docType: string;
  data: T;
}

export interface WorkOrderData {
  workOrderNumber: string;
  manufacturingOrderId: string;
  workCenterId: string;

  startDate: string;
  endDate: string;
  durationMinutes: number;

  isMaintenance: boolean;
  dependsOnWorkOrderIds: string[];
}

export type WorkOrderDocument = BaseDocument<WorkOrderData> & {
  docType: "workOrder";
};


export interface Shift {
  dayOfWeek: number;
  startHour: number;
  endHour: number;
}

export interface MaintenanceWindow {
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface WorkCenterData {
  name: string;
  shifts: Shift[];
  maintenanceWindows: MaintenanceWindow[];
}

export type WorkCenterDocument = BaseDocument<WorkCenterData> & {
  docType: "workCenter";
};

export interface ManufacturingOrderData {
  manufacturingOrderNumber: string;
  itemId: string;
  quantity: number;
  dueDate: string;
}

export type ManufacturingOrderDocument = BaseDocument<ManufacturingOrderData> & {
  docType: "manufacturingOrder";
};

export interface ScheduledInterval {
  workOrderId: string;
  start: DateTime;
  end: DateTime;
  isMaintenance: boolean;
}

export interface ReflowInput {
  workOrders: WorkOrderDocument[];
  workCenters: WorkCenterDocument[];
  manufacturingOrders: ManufacturingOrderDocument[];
}

export interface ScheduleChange {
  workOrderId: string;
  originalStartDate: string;
  originalEndDate: string;
  newStartDate: string;
  newEndDate: string;
  movedByMinutes: number;
  reason: string;
}

export interface ReflowResult {
  updatedWorkOrders: WorkOrderDocument[];
  changes: ScheduleChange[];
  explanation: string;
}

export class SchedulingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SchedulingError";
  }
}

export class CircularDependencyError extends SchedulingError {
  constructor() {
    super("Circular dependency detected in work orders");
  }
}

export class ImpossibleScheduleError extends SchedulingError {
  constructor(reason: string) {
    super(`Impossible schedule: ${reason}`);
  }
}