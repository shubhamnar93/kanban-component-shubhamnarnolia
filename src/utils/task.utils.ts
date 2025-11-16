import type {
  KanbanColumn,
  KanbanTask,
} from "../components/kanbanBoard/KanbanBoard.types";
import { v4 as uuidv4 } from "uuid";

interface HandleKeyDownParams {
  e: React.KeyboardEvent;
  handleKeyboardPickUp: (taskId: string, columnId: string) => void;
  taskId: string;
  columnId: string;
  isKeyboardDragging: boolean;
  handleKeyboardDrop: () => void;
}

/**
 * Checks if a task is overdue
 */
export const isOverdue = (dueDate: Date): boolean => {
  const date = new Date(dueDate);
  const currentDate = new Date();
  return date < currentDate;
};

/**
 * Gets initials from a name
 */
export const getInitials = (name: string): string => {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return (parts[0][0] + parts[0][1]).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * get date string according to date
 */
export const formatDate = (date: Date) => {
  const dueDate = new Date(date);
  return dueDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Calculates priority color classes
 */
export const getPriorityColor = (priority: string): string => {
  const colors = {
    low: "bg-blue-100 text-blue-700 border-l-4 border-blue-500",
    medium: "bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500",
    high: "bg-orange-100 text-orange-700 border-l-4 border-orange-500",
    urgent: "bg-red-100 text-red-700 border-l-4 border-red-500",
  };
  return colors[priority as keyof typeof colors] || colors.medium;
};

/**
 * Calculates border color according to priority
 */
export const borderColor = (priority: string | null): string => {
  const bColor = {
    low: "border-blue-500",
    medium: "border-yellow-500",
    high: "border-orange-500",
    urgent: "border-red-500",
    neutral: "border-neutral-500",
  };
  return priority ? bColor[priority as keyof typeof bColor] : bColor.neutral;
};

/**
 * Moves task between columns and reorder task after drag and drop
 */
export const handleTaskMove = (
  taskId: string,
  from: string,
  to: string,
  newIndex: number,
  columns: KanbanColumn[],
  setColumns: React.Dispatch<React.SetStateAction<KanbanColumn[]>>,
  tasks: { [key: string]: KanbanTask },
  setTasks: React.Dispatch<React.SetStateAction<{ [key: string]: KanbanTask }>>,
  onTaskMove: (
    taskId: string,
    from: string,
    to: string,
    newIndex: number,
  ) => void,
  dragState: {
    handleDragEnd: () => void;
    handleKeyboardDrop?: () => void;
  },
) => {
  const fromCol = columns.find((c) => c.id === from)!;
  const toCol = columns.find((c) => c.id === to)!;
  let fromColIds = fromCol.taskIds.filter((id) => id !== taskId);
  let toColsIds = [...toCol.taskIds];

  if (from === to) {
    fromColIds.splice(newIndex, 0, taskId);
    toColsIds = fromColIds;
  } else {
    toColsIds.splice(newIndex, 0, taskId);
  }
  const updatedCols = columns.map((c) => {
    if (c.id === from) {
      return { ...c, taskIds: fromColIds };
    } else if (c.id === to) {
      return { ...c, taskIds: toColsIds };
    } else {
      return c;
    }
  });
  setColumns(updatedCols);

  if (from !== to) {
    setTasks({
      ...tasks,
      [taskId]: { ...tasks[taskId], status: to },
    });
  }
  onTaskMove(taskId, from, to, newIndex);
  dragState.handleDragEnd();
  if (dragState.handleKeyboardDrop) {
    dragState.handleKeyboardDrop();
  }
};

/**
 * Pick the task and drop using keyboard
 */
export const handleKeyDown = ({
  e,
  handleKeyboardPickUp,
  taskId,
  columnId,
  isKeyboardDragging,
  handleKeyboardDrop,
}: HandleKeyDownParams) => {
  if (e.key === " ") {
    e.preventDefault();
    handleKeyboardPickUp(taskId, columnId);
  } else if (e.key === "Enter" && isKeyboardDragging) {
    e.preventDefault();
    handleKeyboardDrop();
  }
};

/**
 * delete task
 */
export const handleDelete = (
  taskId: string,
  columnId: string,
  columns: KanbanColumn[],
  setColumns: React.Dispatch<React.SetStateAction<KanbanColumn[]>>,
  tasks: { [key: string]: KanbanTask },
  setTasks: React.Dispatch<React.SetStateAction<{ [key: string]: KanbanTask }>>,
) => {
  const col = columns.find((c) => c.id === columnId)!;
  const newTasks = Object.fromEntries(
    Object.entries(tasks).filter(([key, value]) => key !== taskId),
  );
  col.taskIds = col.taskIds.filter((t) => t !== taskId);
  console.log(col.taskIds);
  const cols = columns.map((c) => {
    if (c.id === columnId) return col;
    else return c;
  });
  console.log(cols);
  setColumns(cols);
  setTasks(newTasks);
};

/**
 * save new task
 */
export const handleSaveNew = (
  formData: Partial<KanbanTask>,
  columnId: string,
  columns: KanbanColumn[],
  setColumns: React.Dispatch<React.SetStateAction<KanbanColumn[]>>,
  tasks: { [key: string]: KanbanTask },
  setTasks: React.Dispatch<React.SetStateAction<{ [key: string]: KanbanTask }>>,
) => {
  const col = columns.find((c) => c.id === columnId)!;
  console.log("col");
  console.log("formdata is right");
  const task = {
    ...formData,
    id: uuidv4(),
    createdAt: new Date(),
    status: col.title,
  };
  if (!task.id || !task.createdAt) return null;
  console.log("i think  task is right");
  console.log(task);
  col.taskIds.push(task.id);
  const cols = columns.map((c) => {
    if (c.id === columnId) return col;
    else return c;
  });
  setColumns(cols);
  setTasks({ ...tasks, [task.id]: task as KanbanTask });
  return task;
};

/**
 * update old task
 */
export const handleUpdate = (
  taskId: string,
  formData: Partial<KanbanTask>,
  tasks: { [key: string]: KanbanTask },
  setTasks: React.Dispatch<React.SetStateAction<{ [key: string]: KanbanTask }>>,
) => {
  const t = tasks;
  t[taskId] = { ...t[taskId], ...formData };
  setTasks(t);
};
