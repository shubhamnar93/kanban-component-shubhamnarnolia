import { KanbanBoard } from "./KanbanBoard";
import { type KanbanColumn, type KanbanTask } from "./KanbanBoard.types";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof KanbanBoard> = {
  component: KanbanBoard,
  title: "Components/KanbanBoard",
};
export default meta;

const columns: KanbanColumn[] = [
  {
    id: "1",
    title: "To Do",
    color: "bg-blue-500",
    taskIds: [
      "1",
      "2",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
    ],
  },
  { id: "2", title: "In Progress", color: "bg-yellow-500", taskIds: ["3"] },
  { id: "3", title: "Done", color: "bg-green-500", taskIds: ["4"] },
  {
    id: "4",
    title: "To Do",
    color: "bg-blue-500",
    taskIds: [
      "1",
      "2",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
    ],
  },
  { id: "5", title: "In Progress", color: "bg-yellow-500", taskIds: [] },
  { id: "6", title: "Done", color: "bg-green-500", taskIds: [] },
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
    title: "Task 4",
    status: "In Progress",
    createdAt: new Date(),
    priority: "urgent",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
  },
  "5": {
    id: "5",
    title: "Task 5",
    status: "To Do",
    createdAt: new Date(),
    priority: "medium",
  },
  "6": {
    id: "6",
    title: "Task 6",
    status: "To Do",
    createdAt: new Date(),
    tags: ["bug"],
    priority: "low",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    assignee: "shubham narnolia",
  },
  "7": {
    id: "7",
    title: "Task 7",
    status: "In Progress",
    createdAt: new Date(),
    priority: "high",
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  "8": {
    id: "8",
    title: "Task 8",
    status: "In Progress",
    createdAt: new Date(),
    priority: "urgent",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
  },
  "9": {
    id: "9",
    title: "Task 9",
    status: "Done",
    createdAt: new Date(),
    priority: "medium",
  },
  "10": {
    id: "10",
    title: "Task 10",
    status: "Done",
    createdAt: new Date(),
    tags: ["bug"],
    priority: "low",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    assignee: "shubham narnolia",
  },
  "11": {
    id: "11",
    title: "Task 11",
    status: "Done",
    createdAt: new Date(),
    priority: "high",
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  "12": {
    id: "12",
    title: "Task 12",
    status: "Done",
    createdAt: new Date(),
    priority: "urgent",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
  },
  "13": {
    id: "13",
    title: "Task 13",
    status: "Done",
    createdAt: new Date(),
    priority: "medium",
  },
  "14": {
    id: "14",
    title: "Task 14",
    status: "Done",
    createdAt: new Date(),
    tags: ["bug"],
    priority: "low",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    assignee: "shubham narnolia",
  },
  "15": {
    id: "15",
    title: "Task 15",
    status: "Done",
    createdAt: new Date(),
    priority: "high",
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  "16": {
    id: "16",
    title: "Task 16",
    status: "Done",
    createdAt: new Date(),
    priority: "urgent",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
  },
  "17": {
    id: "17",
    title: "Task 17",
    status: "Done",
    createdAt: new Date(),
    priority: "medium",
  },
  "18": {
    id: "18",
    title: "Task 18",
    status: "Done",
    createdAt: new Date(),
    tags: ["bug"],
    priority: "low",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    assignee: "shubham narnolia",
  },
  "19": {
    id: "19",
    title: "Task 19",
    status: "Done",
    createdAt: new Date(),
    priority: "high",
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  "20": {
    id: "20",
    title: "Task 20",
    status: "Done",
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
