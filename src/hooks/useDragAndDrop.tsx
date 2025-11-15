import { useState, useCallback } from "react";
import type {
  KanbanColumn,
  KanbanTask,
} from "../components/kanbanBoard/KanbanBoard.types";

export interface DragState {
  isDragging: boolean;
  draggedTaskId: string | null;
  sourceColumnId: string | null;
  targetColumnId: string | null;
  targetIndex: number | null;
  isKeyboardDragging: boolean;
  focusedTaskId: string | null;
  focusedColumnId: string | null;
}

export const useDragAndDrop = () => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedTaskId: null,
    sourceColumnId: null,
    targetColumnId: null,
    targetIndex: null,
    isKeyboardDragging: false,
    focusedTaskId: null,
    focusedColumnId: null,
  });

  const handleDragStart = useCallback(
    (taskId: string, sourceColumnId: string) => {
      setDragState({
        isDragging: true,
        draggedTaskId: taskId,
        sourceColumnId,
        targetColumnId: null,
        targetIndex: null,
        isKeyboardDragging: false,
        focusedTaskId: null,
        focusedColumnId: null,
      });
    },
    [],
  );

  const handleDragOver = useCallback(
    (targetColumnId: string, targetIndex: number | null) => {
      setDragState((prev) => ({
        ...prev,
        targetColumnId,
        targetIndex,
      }));
    },
    [],
  );

  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedTaskId: null,
      sourceColumnId: null,
      targetColumnId: null,
      targetIndex: null,
      isKeyboardDragging: false,
      focusedTaskId: null,
      focusedColumnId: null,
    });
  }, []);

  const handleKeyboardPickUp = useCallback(
    (taskId: string, columnId: string) => {
      setDragState({
        isDragging: true,
        draggedTaskId: taskId,
        sourceColumnId: columnId,
        targetColumnId: columnId,
        targetIndex: null,
        isKeyboardDragging: true,
        focusedTaskId: taskId,
        focusedColumnId: columnId,
      });
    },
    [],
  );

  const handleKeyboardMove = useCallback(
    (
      direction: "up" | "down" | "left" | "right",
      columns: KanbanColumn[],
      tasks: Record<string, KanbanTask>,
    ) => {
      setDragState((prev) => {
        if (
          !prev.isKeyboardDragging ||
          !prev.draggedTaskId ||
          !prev.targetColumnId
        )
          return prev;
        const currentColumnIndex = columns.findIndex(
          (col) => col.id === prev.targetColumnId,
        );
        const currentTasks = columns[currentColumnIndex].taskIds.map(
          (id) => tasks[id],
        );
        const currentTaskIndex = currentTasks.findIndex(
          (task) => task.id === prev.draggedTaskId,
        );
        let newColumnId = prev.targetColumnId;
        let newIndex =
          prev.targetIndex !== null ? prev.targetIndex : currentTaskIndex;

        if (direction === "up") {
          newIndex = Math.max(0, newIndex - 1);
        } else if (direction === "down") {
          newIndex = Math.min(currentTasks.length, newIndex + 1);
        } else if (direction === "left") {
          const newColumnIndex = Math.max(0, currentColumnIndex - 1);
          newColumnId = columns[newColumnIndex].id;
          const newTasks = columns[newColumnIndex].taskIds.map(
            (id) => tasks[id],
          );
          newIndex = Math.min(newTasks.length, newIndex);
        } else if (direction === "right") {
          const newColumnIndex = Math.min(
            columns.length - 1,
            currentColumnIndex + 1,
          );

          newColumnId = columns[newColumnIndex].id;
          const newTasks = columns[newColumnIndex].taskIds.map(
            (id) => tasks[id],
          );
          newIndex = Math.min(newTasks.length, newIndex);
        }

        return {
          ...prev,
          targetColumnId: newColumnId,
          targetIndex: newIndex,
        };
      });
    },
    [],
  );

  const handleKeyboardDrop = useCallback(() => {
    setDragState((prev) => ({
      ...prev,
      isKeyboardDragging: false,
      focusedTaskId: null,
      focusedColumnId: null,
    }));
  }, []);

  return {
    ...dragState,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleKeyboardPickUp,
    handleKeyboardMove,
    handleKeyboardDrop,
  };
};
