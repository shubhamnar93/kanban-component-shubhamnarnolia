import { useState } from "react";
import "../../styles/globals.css";
import type { KanbanBoardProps } from "./KanbanBoard.types";
import { KanbanColumnComponent } from "./KanbanColumn";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { handleTaskMove, handleUpdate } from "../../utils/task.utils";
import { handleGlobalKeyDown } from "../../hooks/useKanbanBoard";
import { TaskModal } from "./TaskModal";
import {handleDelete} from "../../utils/task.utils";
import {handleSaveNew} from "../../utils/task.utils";

export const KanbanBoard = ({
  columns: initialColumns,
  tasks: initialTasks,
  onTaskMove,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
}: KanbanBoardProps) => {
  const [columns, setColumns] = useState(initialColumns);
  const [tasks, setTasks] = useState(initialTasks);
  const dragState = useDragAndDrop();
  const [showAddModal, setShowAddModal] = useState(false);
  const [addNewOrEdit, setAddNewOrEdit] = useState<"add" | "edit">("add");
  const [taskToEdit, setTaskToEdit] = useState<string | null>(null);

  if (columns.length < 3 || columns.length > 6) {
    throw new Error("`items` must contain between 3 and 6 elements.");
  }

  return (
    <>
      <div
        tabIndex={0}
        onKeyDown={(e) =>
          handleGlobalKeyDown({
            e,
            dragState,
            columns,
            tasks,
            setColumns,
            setTasks,
            onTaskMove,
          })
        }
        className={`flex flex-col gap-4 p-4
        sm:flex-col sm:overflow-y-auto sm:pb-20
        md:flex-row md:flex-wrap md:justify-center
        lg:flex-nowrap lg:overflow-x-auto lg:pb-10
        xl:mx-auto xl:max-w-[1800px] ${showAddModal && "hidden"}`}
      >
        {columns.map((col) => (
          <KanbanColumnComponent
            setShowAddModal={setShowAddModal}
            key={col.id}
            column={col}
            tasks={col.taskIds.map((id) => tasks[id])}
            handleTaskMove={(
              taskId: string,
              from: string,
              to: string,
              newIndex: number,
            ) =>
              handleTaskMove(
                taskId,
                from,
                to,
                newIndex,
                columns,
                setColumns,
                tasks,
                setTasks,
                onTaskMove,
                dragState,
              )
            }
            dragState={dragState}
            setAddNewOrEdit={setAddNewOrEdit}
            setTaskToEdit={setTaskToEdit}
          />
        ))}
      </div>
      {showAddModal && (
        <TaskModal
        task={taskToEdit ? tasks[taskToEdit] : null}
          onDelete={handleDelete}
          onSave={(formData)=>handleSaveNew(formData)}
          onUpdate={(taskId, formData)=>handleUpdate(taskId, formData)}
          columns={columns}
          addNewOrEdit={addNewOrEdit}
          onClose={() => {
            setShowAddModal(false)}}
        />
      )}
    </>
  );
};
