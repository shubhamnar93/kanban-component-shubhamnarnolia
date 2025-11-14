import React, { useRef, useState } from "react";
import type { KanbanColumn, KanbanTask } from "./KanbanBoard.types";
import { KanbanCard } from "./KanbanCard";

interface Props {
  column: KanbanColumn;
  tasks: KanbanTask[];
  handleTaskMove: (
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
  handleTaskMove,
  dragState,
}) => {
  const {
    draggedTaskId,
    sourceColumnId,
    targetIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = dragState;

  const handleDrop = () => {
    // if taskId or sourceColumnId is null return
    if (!draggedTaskId || !sourceColumnId) return;
    // index from the drop state is null then it will be task.length otherwise it will be targetIndex which can be set using handleDragOver
    const newIndex = targetIndex !== null ? targetIndex : tasks.length;
    // it passed the draggedTaskId, sourceColumnId, set from handleDragStart, column id set from handleDragOver and newidex fromm above
    handleTaskMove(draggedTaskId, sourceColumnId, column.id, newIndex);
    setHoverIndex(null);
  };
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const draggedTaskIndex = useRef<number | null>(null);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!(e.target as HTMLElement).closest(".task-wrapper")) {
          // keep lasthover instead of null
          handleDragOver(column.id, hoverIndex);
        }
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setHoverIndex(null);
          handleDragOver(column.id, null);
        }
      }}
      onDrop={handleDrop}
      className="bg-gray-300 scroll-thin rounded-xl p-3 flex flex-col w-full max-h-[500px] sm:w-full md:w-[280px] lg:max-h-[823px] lg:w-[320px]"
    >
      <header className="flex justify-between items-center mb-3 sticky top-0 bg-gray-300">
        <h3 className="font-semibold">{column.title}</h3>
        <span className="text-sm text-neutral-500">{tasks.length}</span>
      </header>
      <div className="flex flex-col overflow-y-auto scrollbar-thin">
        {tasks.length === 0 ? (
          <div className="text-sm text-neutral-400 italic py-6 text-center">
            No tasks
          </div>
        ) : (
          tasks.map((task, index) => (
            <div
              key={index}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setHoverIndex(index);
                handleDragOver(column.id, index);
              }}
              onDrop={handleDrop}
              className="task-wrapper w-full"
              style={{
                marginTop:
                  draggedTaskIndex.current &&
                  hoverIndex &&
                  draggedTaskIndex.current > hoverIndex &&
                  hoverIndex === index
                    ? "40px"
                    : "0px", // feedback shift
                marginBottom:
                  draggedTaskIndex.current &&
                  hoverIndex &&
                  draggedTaskIndex.current < hoverIndex &&
                  hoverIndex === index
                    ? "40px"
                    : "0px", // feedback shift
              }}
            >
              <KanbanCard
                task={task}
                handleDragStart={(id) => {
                  draggedTaskIndex.current = index;
                  handleDragStart(id, column.id);
                }}
                handleDragEnd={handleDragEnd}
                onDragOver={() => handleDragOver(column.id, index)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
