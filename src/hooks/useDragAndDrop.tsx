import { useState, useCallback } from "react";

export interface DragState {
  isDragging: boolean;
  draggedTaskId: string | null;
  sourceColumnId: string | null;
  targetColumnId: string | null;
  targetIndex: number | null;
}

export const useDragAndDrop = () => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedTaskId: null,
    sourceColumnId: null,
    targetColumnId: null,
    targetIndex: null,
  });

  const handleDragStart = useCallback(
    (taskId: string, sourceColumnId: string) => {
      setDragState({
        isDragging: true,
        draggedTaskId: taskId,
        sourceColumnId,
        targetColumnId: null,
        targetIndex: null,
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
    });
  }, []);

  return {
    ...dragState,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};
