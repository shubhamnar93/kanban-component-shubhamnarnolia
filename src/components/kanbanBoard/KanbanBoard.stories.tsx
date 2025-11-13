import { KanbanBoard } from "./KanbanBoard";
import { type KanbanColumn, type KanbanTask } from "./KanbanBoard.types";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof KanbanBoard> = {
  component: KanbanBoard,
  title: "Components/KanbanBoard",
};
export default meta;

const columns: KanbanColumn[] = [
  { id: "1", title: "To Do", color: "bg-blue-500", taskIds: ["1", "2"] },
  { id: "2", title: "In Progress", color: "bg-yellow-500", taskIds: ["3"] },
  { id: "3", title: "Done", color: "bg-green-500", taskIds: ["4"] },
];

const tasks: Record<string, KanbanTask> = {
  "1": {
    id: "1",
    title: "Task 1",
    status: "To Do",
    createdAt: new Date(),
    priority: "medium",
  },
  "2": {
    id: "2",
    title: "Task 2",
    status: "To Do",
    createdAt: new Date(),
    tags: ["bug"],
    priority: "low",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    assignee: "shubham narnolia",
  },
  "3": {
    id: "3",
    title: "Task 3",
    status: "In Progress",
    createdAt: new Date(),
    priority: "high",
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  "4": {
    id: "4",
    title: "Task 3",
    status: "In Progress",
    createdAt: new Date(),
    priority: "urgent",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
  },
};

type Story = StoryObj<typeof KanbanBoard>;

export const Default: Story = {
  args: {
    columns,
    tasks,
    onTaskMove: () => {},
    onTaskCreate: () => {},
    onTaskUpdate: () => {},
    onTaskDelete: () => {},
  },
};

export const EmptyBoard: Story = {
  args: {
    columns: [],
    tasks: {},
    onTaskMove: () => {},
    onTaskCreate: () => {},
    onTaskUpdate: () => {},
    onTaskDelete: () => {},
  },
};

export const EmptySingleColumn: Story = {
  args: {
    columns: [{ id: "1", title: "To Do", color: "bg-blue-500", taskIds: [] }],
    tasks,
    onTaskMove: () => {},
    onTaskCreate: () => {},
    onTaskUpdate: () => {},
    onTaskDelete: () => {},
  },
};
