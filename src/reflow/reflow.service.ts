import { DateTime } from "luxon";
import {
  ReflowInput,
  ReflowResult,
  WorkOrderDocument,
  ScheduleChange,
  ScheduledInterval,
} from "./types";

import { topologicallySortWorkOrders } from "./dependency-graph";
import { calculateEndDateWithShifts } from "./shift-calculator";

export class ReflowService {
  reflow(input: ReflowInput): ReflowResult {
    const { workOrders, workCenters } = input;

    const workCenterMap = new Map(
      workCenters.map((wc) => [wc.docId, wc])
    );

    const sortedWorkOrders = topologicallySortWorkOrders(workOrders);

    const scheduledByWorkCenter = new Map<string, ScheduledInterval[]>();

    const workOrderEndTimes = new Map<string, DateTime>();

    const changes: ScheduleChange[] = [];

    for (const wo of sortedWorkOrders) {
      const workCenter = workCenterMap.get(wo.data.workCenterId);

      if (!workCenter) {
        throw new Error(`Work center ${wo.data.workCenterId} not found`);
      }

      if (!scheduledByWorkCenter.has(workCenter.docId)) {
        scheduledByWorkCenter.set(workCenter.docId, []);
      }

      const workCenterSchedule = scheduledByWorkCenter.get(workCenter.docId)!;

      const originalStart = DateTime.fromISO(wo.data.startDate, {
        zone: "utc",
      });

      const originalEnd = DateTime.fromISO(wo.data.endDate, {
        zone: "utc",
      });

      if (wo.data.isMaintenance) {
        workCenterSchedule.push({
          workOrderId: wo.docId,
          start: originalStart,
          end: originalEnd,
          isMaintenance: true,
        });

        workOrderEndTimes.set(wo.docId, originalEnd);
        continue;
      }

      let latestDependencyEnd = originalStart;

      for (const id of wo.data.dependsOnWorkOrderIds) {
        const endTime = workOrderEndTimes.get(id);

        if (endTime && endTime.toMillis() > latestDependencyEnd.toMillis()) {
          latestDependencyEnd = endTime;
        }
      }

      const lastInterval = workCenterSchedule[workCenterSchedule.length - 1];

      const lastWorkCenterEnd = lastInterval
        ? lastInterval.end
        : originalStart;

      let proposedStart =
        latestDependencyEnd.toMillis() > lastWorkCenterEnd.toMillis()
          ? latestDependencyEnd
          : lastWorkCenterEnd;

      const newEnd = calculateEndDateWithShifts({
        startDate: proposedStart.toISO()!,
        durationMinutes: wo.data.durationMinutes,
        workCenter,
      });

      workCenterSchedule.push({
        workOrderId: wo.docId,
        start: proposedStart,
        end: newEnd,
        isMaintenance: false,
      });

      workOrderEndTimes.set(wo.docId, newEnd);

      if (!proposedStart.equals(originalStart) || !newEnd.equals(originalEnd)) {
        changes.push({
          workOrderId: wo.docId,
          originalStartDate: originalStart.toISO()!,
          originalEndDate: originalEnd.toISO()!,
          newStartDate: proposedStart.toISO()!,
          newEndDate: newEnd.toISO()!,
          movedByMinutes: Math.round(
            newEnd.diff(originalEnd, "minutes").minutes
          ),
          reason: determineChangeReason(
            originalStart,
            proposedStart,
            latestDependencyEnd,
            lastWorkCenterEnd
          ),
        });

        wo.data.startDate = proposedStart.toISO()!;
        wo.data.endDate = newEnd.toISO()!;
      }
    }

    return {
      updatedWorkOrders: workOrders,
      changes,
      explanation: `Reflow completed. ${changes.length} work orders were rescheduled.`,
    };
  }
}

function determineChangeReason(
  originalStart: DateTime,
  newStart: DateTime,
  dependencyEnd: DateTime,
  workCenterEnd: DateTime
): string {
  if (newStart.equals(originalStart)) {
    return "Duration recalculated due to shift or maintenance constraints";
  }

  if (dependencyEnd > originalStart) {
    return "Delayed due to dependency completion";
  }

  if (workCenterEnd > originalStart) {
    return "Delayed due to work center availability";
  }

  return "Adjusted due to scheduling constraints";
}