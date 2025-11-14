
interface HandleDropParams {
    draggedTaskId: string | null;
    sourceColumnId: string | null;
    targetIndex: number | null;
    handleTaskMove: (
        taskId: string,
        from: string,
        to: string,
        newIndex: number,
    ) => void;
    columnId: string;
    tasksLength: number;
}
 export const handleDrop = ({draggedTaskId, sourceColumnId, targetIndex, handleTaskMove, columnId, tasksLength}: HandleDropParams) => {
    // if taskId or sourceColumnId is null return
    if (!draggedTaskId || !sourceColumnId) return;
    // index from the drop state is null then it will be task.length otherwise it will be targetIndex which can be set using handleDragOver
    const newIndex = targetIndex !== null ? targetIndex : tasksLength;
    // it the draggedTaskId, sourceColumnId, set from handleDragStart, column id set from handleDragOver and newidex fromm above
    handleTaskMove(draggedTaskId, sourceColumnId, columnId, newIndex);
  };