// Shared helpers
type MoveTaskFn = (
  taskId: string,
  from: string,
  to: string,
  newIndex: number,
) => void;

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

// Shared context for dragged task
interface DragContextBase {
  draggedTaskId: string | null;
  sourceColumnId: string | null;
  columnId: string;
}

// Shared column interaction state
interface ColumnInteractionBase {
  setIsOverColumn: SetState<boolean>;
  setHoverIndex: SetState<number | null>;
  setDragDirection: SetState<"up" | "down" | null>;
  tasksLength: number;
}

// Final interfaces

export interface DragLeaveColumnParams extends ColumnInteractionBase {
  e: React.DragEvent;
  handleDragOver: (columnId: string, index: number | null) => void;
  columnId: string;
}

export interface DropColumnParams
  extends DragContextBase,
    ColumnInteractionBase {
  targetIndex: number | null;
  handleTaskMove: MoveTaskFn;
}

export interface HandleDragOverColumnParams extends ColumnInteractionBase {
  e: React.DragEvent;
  handleDragOver: (columnId: string, index: number | null) => void;
  columnId: string;
  draggedTaskIndex: React.RefObject<number | null>;
}

export interface HandleWipLimitParams {
  limit: number;
  columnId: string | null;
}

export interface HandleColRenameParams {
  colName: string;
  columnId: string | null;
}
export const handleDragOverColumn = ({
  e,
  setIsOverColumn,
  setHoverIndex,
  setDragDirection,
  handleDragOver,
  columnId,
  draggedTaskIndex,
  tasksLength,
}: HandleDragOverColumnParams) => {
  e.preventDefault();
  setIsOverColumn(true);
  const rect = e.currentTarget.getBoundingClientRect();
  const y = e.clientY - rect.top;
  const taskHeight = 100; // Approximate height of a task card
  const newIndex = Math.floor(y / taskHeight);
  const clampedIndex = Math.max(0, Math.min(newIndex, tasksLength));
  setHoverIndex(clampedIndex);

  // Determine drag direction
  if (draggedTaskIndex.current !== null) {
    if (clampedIndex > draggedTaskIndex.current) {
      setDragDirection("down");
    } else if (clampedIndex < draggedTaskIndex.current) {
      setDragDirection("up");
    } else {
      setDragDirection(null);
    }
  }

  handleDragOver(columnId, clampedIndex);
};

export const handleDragLeaveColumn = ({
  e,
  setIsOverColumn,
  setHoverIndex,
  setDragDirection,
  handleDragOver,
  columnId,
}: DragLeaveColumnParams) => {
  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
    setIsOverColumn(false);
    setHoverIndex(null);
    setDragDirection(null);
    handleDragOver(columnId, null);
  }
};

export const handleDropColumn = ({
  setHoverIndex,
  setIsOverColumn,
  setDragDirection,
  draggedTaskId,
  sourceColumnId,
  targetIndex,
  handleTaskMove,
  columnId,
  tasksLength,
}: DropColumnParams) => {
  setHoverIndex(null);
  setIsOverColumn(false);
  setDragDirection(null);
  if (!draggedTaskId || !sourceColumnId) return;
  const newIndex = targetIndex !== null ? targetIndex : tasksLength;
  handleTaskMove(draggedTaskId, sourceColumnId, columnId, newIndex);
};

export const handleWipLimit = ({ limit, columnId }: HandleWipLimitParams) => {};
export const handleColRename = ({
  colName,
  columnId,
}: HandleColRenameParams) => {};
export const handleColDelete = (columnId: string) => {};

