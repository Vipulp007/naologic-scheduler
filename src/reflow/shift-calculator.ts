import { DateTime, Interval } from "luxon";
import {
  WorkCenterDocument,
  Shift,
  MaintenanceWindow,
  ImpossibleScheduleError,
} from "./types";

export function calculateEndDateWithShifts(params: {
  startDate: string;
  durationMinutes: number;
  workCenter: WorkCenterDocument;
}): DateTime {
  const { startDate, durationMinutes, workCenter } = params;

  if (durationMinutes <= 0) {
    return DateTime.fromISO(startDate, { zone: "utc" });
  }

  if (!workCenter.data.shifts || workCenter.data.shifts.length === 0) {
    throw new ImpossibleScheduleError(
      `Work center ${workCenter.docId} has no shifts`
    );
  }

  let remainingMinutes = durationMinutes;
  let current = DateTime.fromISO(startDate, { zone: "utc" });

  // Safety guard to prevent infinite loops
  let guardIterations = 0;
  const MAX_ITERATIONS = 10000;

  while (remainingMinutes > 0) {
    guardIterations++;
    if (guardIterations > MAX_ITERATIONS) {
      throw new ImpossibleScheduleError(
        "Exceeded max scheduling iterations (possible impossible schedule)"
      );
    }

    // 1️⃣ Ensure we're inside a shift
    if (!isWithinAnyShift(current, workCenter.data.shifts)) {
      current = getNextShiftStart(current, workCenter.data.shifts);
      continue;
    }

    // 2️⃣ Ensure we're not inside maintenance
    const maintenance = getMaintenanceWindowAt(
      current,
      workCenter.data.maintenanceWindows
    );
    if (maintenance) {
      current = maintenance.end;
      continue;
    }

    // 3️⃣ Calculate available working window
    const shiftEnd = getCurrentShiftEnd(current, workCenter.data.shifts);
    const nextMaintenanceStart = getNextMaintenanceStart(
      current,
      workCenter.data.maintenanceWindows
    );

    let availableUntil = shiftEnd;

    if (
      nextMaintenanceStart &&
      nextMaintenanceStart < availableUntil
    ) {
      availableUntil = nextMaintenanceStart;
    }

    const availableMinutes = Math.max(
      0,
      availableUntil.diff(current, "minutes").minutes
    );

    if (availableMinutes <= 0) {
      current = availableUntil.plus({ minutes: 1 });
      continue;
    }

    const minutesToWork = Math.min(availableMinutes, remainingMinutes);

    current = current.plus({ minutes: minutesToWork });
    remainingMinutes -= minutesToWork;
  }

  return current;
}

// Shift Helpers
function isWithinAnyShift(date: DateTime, shifts: Shift[]): boolean {
  return shifts.some((shift) => isWithinShift(date, shift));
}

function isWithinShift(date: DateTime, shift: Shift): boolean {
  if (date.weekday % 7 !== shift.dayOfWeek) return false;

  const shiftStart = date.set({
    hour: shift.startHour,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  const shiftEnd = date.set({
    hour: shift.endHour,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  return date >= shiftStart && date < shiftEnd;
}

function getNextShiftStart(date: DateTime, shifts: Shift[]): DateTime {
  for (let i = 0; i < 14; i++) {
    const day = date.plus({ days: i });
    const weekday = day.weekday % 7;

    const dayShifts = shifts
      .filter((s) => s.dayOfWeek === weekday)
      .sort((a, b) => a.startHour - b.startHour);

    for (const shift of dayShifts) {
      const shiftStart = day.set({
        hour: shift.startHour,
        minute: 0,
        second: 0,
        millisecond: 0,
      });

      if (shiftStart > date) {
        return shiftStart;
      }
    }
  }

  throw new ImpossibleScheduleError("No upcoming shift found");
}

function getCurrentShiftEnd(date: DateTime, shifts: Shift[]): DateTime {
  const shift = shifts.find((s) => isWithinShift(date, s));

  if (!shift) {
    throw new ImpossibleScheduleError("Date is not within a shift");
  }

  return date.set({
    hour: shift.endHour,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
}

// Maintenance Helpers
function getMaintenanceWindowAt(
  date: DateTime,
  windows: MaintenanceWindow[]
): { start: DateTime; end: DateTime } | null {
  for (const mw of windows) {
    const interval = Interval.fromDateTimes(
      DateTime.fromISO(mw.startDate, { zone: "utc" }),
      DateTime.fromISO(mw.endDate, { zone: "utc" })
    );

    if (interval.contains(date)) {
      return {
        start: interval.start!,
        end: interval.end!,
      };
    }
  }

  return null;
}

function getNextMaintenanceStart(
  date: DateTime,
  windows: MaintenanceWindow[]
): DateTime | null {
  let next: DateTime | null = null;

  for (const mw of windows) {
    const start = DateTime.fromISO(mw.startDate, { zone: "utc" });

    if (start > date && (!next || start < next)) {
      next = start;
    }
  }

  return next;
}