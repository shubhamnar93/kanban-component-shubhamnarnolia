import type {
  KanbanColumn,
  KanbanTask,
} from "../components/kanbanBoard/KanbanBoard.types";
import { handleTaskMove } from "../utils/task.utils";

interface HandleGlobalKeyDownParams {
  e: React.KeyboardEvent;
  columns: KanbanColumn[];
  tasks: Record<string, KanbanTask>;
  dragState: {
    draggedTaskId: string | null;
    sourceColumnId: string | null;
    targetColumnId: string | null;
    targetIndex: number | null;
    isKeyboardDragging: boolean;
    focusedTaskId: string | null;
    focusedColumnId: string | null;
    handleDragStart: (id: string, columnId: string) => void;
    handleDragOver: (columnId: string, index: number | null) => void;
    handleDragEnd: () => void;
    handleKeyboardPickUp: (taskId: string, columnId: string) => void;
    handleKeyboardMove: (
      direction: "up" | "down" | "left" | "right",
      columns: KanbanColumn[],
      tasks: Record<string, KanbanTask>,
    ) => void;
    handleKeyboardDrop: () => void;
  };
    setColumns: React.Dispatch<React.SetStateAction<KanbanColumn[]>>;
    setTasks: React.Dispatch<React.SetStateAction<{ [key: string]: KanbanTask }>>;
    onTaskMove: (
      taskId: string,
      from: string,
      to: string,
      newIndex: number,
    ) => void;
}
export const handleGlobalKeyDown = ({
  e,
  tasks,
  columns,
  dragState,
  setColumns,
  setTasks,
  onTaskMove,
}: HandleGlobalKeyDownParams) => {
  if (
    dragState.isKeyboardDragging &&
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
  ) {
    e.preventDefault();
    const direction = e.key.replace("Arrow", "").toLowerCase() as
      | "up"
      | "down"
      | "left"
      | "right";
    dragState.handleKeyboardMove(direction, columns, tasks);
  } else if (e.key === "Enter" && dragState.isKeyboardDragging) {
    e.preventDefault();
    if (
      dragState.draggedTaskId &&
      dragState.sourceColumnId &&
      dragState.targetColumnId !== null
    ) {
      handleTaskMove(
        dragState.draggedTaskId,
        dragState.sourceColumnId,
        dragState.targetColumnId,
        dragState.targetIndex || 0,
        columns,
        setColumns,
        tasks,
        setTasks,
        onTaskMove,
        dragState,
      );
    }
    dragState.handleKeyboardDrop();
  }
};

const handleKeyboardDrop = () => {};

