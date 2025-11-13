import React, { useRef } from "react";
import type { KanbanColumn, KanbanTask } from "./KanbanBoard.types";
import { KanbanCard } from "./KanbanCard";

interface Props {
  column: KanbanColumn;
  tasks: KanbanTask[];
  onTaskMove: (
    taskId: string,
    from: string,
    to: string,
    newIndex: number,
  ) => void;
  dragState: {
    draggedTaskId: string | null;
    sourceColumnId: string | null;
    targetColumnId: string | null;
    targetIndex: number | null;
    handleDragStart: (id: string, columnId: string) => void;
    handleDragOver: (columnId: string, index: number | null) => void;
    handleDragEnd: () => void;
  };
}

export const KanbanColumnComponent: React.FC<Props> = ({
  column,
  tasks,
  onTaskMove,
  dragState,
}) => {
  const {current:index}=useRef(0)
  const {
    draggedTaskId,
    sourceColumnId,
    targetIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = dragState;

  const handleDrop = () => {
    if (!draggedTaskId || !sourceColumnId) return;
   const newIndex = targetIndex !== null ? targetIndex : tasks.length; 
    onTaskMove(draggedTaskId, sourceColumnId, column.id, newIndex);
  };

  

  return (
    <div
    onDragOver={(e) => {
           e.preventDefault();
          handleDragOver(column.id, null);
       }}
        onDrop={handleDrop}
     className="bg-gray-300 scroll-thin rounded-xl p-3 flex flex-col w-full max-h-[500px] sm:w-full md:w-[280px] lg:max-h-[823px] lg:w-[320px]">
      <header className="flex justify-between items-center mb-3 sticky top-0 bg-gray-300">
        <h3 className="font-semibold">{column.title}</h3>
        <span className="text-sm text-neutral-500">{tasks.length}</span>
      </header>
      <div className="flex flex-col gap-2 overflow-y-auto scrollbar-thin">
        {tasks.length === 0 ? (
          <div className="text-sm text-neutral-400 italic py-6 text-center">
            No tasks
          </div>
        ) : (
        tasks.map((task, index) => (
              <KanbanCard
                key={task.id}
               task={task}
                handleDragStart={(id) => handleDragStart(id, column.id)}
                handleDragEnd={handleDragEnd}
                onDragOver={() => handleDragOver(column.id, index)}
              />
            ))
          )}
      </div>
    </div>
  );
};
