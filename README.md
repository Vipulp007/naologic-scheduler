# Production Schedule Reflow System

A TypeScript-based production scheduling engine that recalculates a valid manufacturing schedule when disruptions occur.

The system ensures that work orders are rescheduled while respecting several real-world constraints such as:

- Work order dependencies
- Work center capacity (no overlapping jobs)
- Shift schedules
- Maintenance windows

---

# Overview

Manufacturing systems often require rescheduling when unexpected disruptions occur, such as:

- Machine maintenance
- Work orders running longer than expected
- Dependency delays between operations

This project implements a **reflow algorithm** that recalculates the production schedule while maintaining all required constraints.

---

# Key Features

- Dependency-aware scheduling
- Shift-aware time calculations
- Maintenance window handling
- Work center conflict prevention
- Delay cascade propagation
- Change tracking and explanation

---

# Project Structure

src/
│
├── utils/ # Sample scheduling scenarios
│
├── reflow/
│ ├── reflow.service.ts # Main scheduling engine
│ ├── dependency-graph.ts # DAG + topological sorting
│ ├── shift-calculator.ts # Shift-aware duration engine
│ └── types.ts # Domain models and interfaces
│
└── index.ts # Entry point to run scenarios

---

# Architecture

The system is composed of three main components.

## 1. Dependency Graph

A directed acyclic graph (DAG) is constructed from work order dependencies.

This ensures: Parent jobs are always scheduled before child jobs


Topological sorting is used to compute a valid execution order.

---

## 2. Reflow Scheduling Engine

The main algorithm processes work orders sequentially.

For each work order the scheduler calculates:

```bash
start_time = max(
dependency_completion_time,
work_center_availability
)
```


Then the end time is computed using the shift-aware calculator.

---

## 3. Shift-Aware Time Calculator

This component ensures work only occurs during valid production hours.

It handles:

- Pausing outside shift hours
- Resuming at the next shift
- Skipping maintenance windows


---

# Installation

Clone the repository.

```bash
git clone https://github.com/your-username/production-reflow-system.git
cd production-reflow-system
npm install
npm run dev
```