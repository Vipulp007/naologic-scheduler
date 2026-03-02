import type { WorkOrderDocument } from "./types";
import {
  CircularDependencyError,
  SchedulingError,
} from "./types";

type WorkOrderId = string;

interface DependencyGraph {
  adjacencyList: Map<WorkOrderId, Set<WorkOrderId>>;
  inDegree: Map<WorkOrderId, number>;
}


function buildDependencyGraph(
  workOrders: WorkOrderDocument[]
): DependencyGraph {
  const adjacencyList = new Map<WorkOrderId, Set<WorkOrderId>>();
  const inDegree = new Map<WorkOrderId, number>();

  // Step 1: Initialize nodes
  for (const wo of workOrders) {
    adjacencyList.set(wo.docId, new Set());
    inDegree.set(wo.docId, 0);
  }

  // Step 2: Add edges (parent -> child)
  for (const wo of workOrders) {
    const childId = wo.docId;

    for (const parentId of wo.data.dependsOnWorkOrderIds) {
      if (!adjacencyList.has(parentId)) {
        throw new SchedulingError(
          `Dependency ${parentId} not found for work order ${childId}`
        );
      }

      adjacencyList.get(parentId)!.add(childId);
      inDegree.set(childId, (inDegree.get(childId) || 0) + 1);
    }
  }

  return { adjacencyList, inDegree };
}

export function topologicallySortWorkOrders(
  workOrders: WorkOrderDocument[]
): WorkOrderDocument[] {
  const { adjacencyList, inDegree } = buildDependencyGraph(workOrders);

  const queue: WorkOrderId[] = [];
  const sortedIds: WorkOrderId[] = [];

  // Step 1: Add nodes in Queue with no dependencies
  for (const [id, degree] of inDegree.entries()) {
    if (degree === 0) {
      queue.push(id);
    }
  }

  // Step 2: Kahn’s algorithm for topological sort
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    sortedIds.push(currentId);

    const children = adjacencyList.get(currentId);
    if (!children) continue;

    for (const childId of children) {
      const newDegree = (inDegree.get(childId) || 0) - 1;
      inDegree.set(childId, newDegree);

      if (newDegree === 0) {
        queue.push(childId);
      }
    }
  }

  if (sortedIds.length !== workOrders.length) {
    throw new CircularDependencyError();
  }

  const workOrderMap = new Map<WorkOrderId, WorkOrderDocument>();
  for (const wo of workOrders) {
    workOrderMap.set(wo.docId, wo);
  }

  return sortedIds.map((id) => workOrderMap.get(id)!);
}