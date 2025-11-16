import { useState } from "react";
import "../../styles/globals.css";
import type { KanbanBoardProps, KanbanTask } from "./KanbanBoard.types";
import { KanbanColumnComponent } from "./KanbanColumn";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { handleTaskMove, handleUpdate } from "../../utils/task.utils";
import { handleGlobalKeyDown } from "../../hooks/useKanbanBoard";
import { TaskModal } from "./TaskModal";
import { handleDelete } from "../../utils/task.utils";
import { handleSaveNew } from "../../utils/task.utils";
import { Modal } from "../primitives/Modal";
import {
  handleColDelete,
  handleColRename,
  handleWipLimit,
} from "../../utils/column.utils";
import { v4 as uuidv4 } from "uuid";

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
  const [columnId, setColumnId] = useState<string | null>(null);
  const [showColModal, setShowColModal] = useState<
    "rename" | "wiplimit" | null
  >(null);
  const [colToEdit, setColumnToEdit] = useState<string | null>(null);

  if (columns.length < 3 || columns.length > 6) {
    throw new Error("`items` must contain between 3 and 6 elements.");
  }

  function handleTaskDelete(taskId: string, columnId: string) {
    handleDelete(taskId, columnId, columns, setColumns, tasks, setTasks);
  }

  function handleDuplicate(taskId: string, columnId: string) {
    const taskToDuplicate = tasks[taskId];
    if (taskToDuplicate) {
      const newTask: KanbanTask = {
        ...taskToDuplicate,
        id: uuidv4(),
        title: `${taskToDuplicate.title} (Copy)`,
      };
      handleSaveNew(newTask, columnId, columns, setColumns, tasks, setTasks);
    }
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
            setColumnId={setColumnId}
            setShowColModal={setShowColModal}
            setColToEdit={setColumnToEdit}
            onDeleteCol={(colId: string) => {
              handleColDelete({
                columnId: colId,
                columns,
                setColumns,
              });
            }}
            handleTaskDelete={handleTaskDelete}
            handleDuplicate={handleDuplicate}
          />
        ))}
      </div>
      {showAddModal && (
        <TaskModal
          task={taskToEdit ? tasks[taskToEdit] : null}
          onDelete={(taskId) => {
            if (!columnId) return;
            handleDelete(
              taskId,
              columnId,
              columns,
              setColumns,
              tasks,
              setTasks,
            );
            onTaskDelete(taskId);
            setShowAddModal(false);
          }}
          onSave={(formData) => {
            if (columnId) {
              const task = handleSaveNew(
                formData,
                columnId,
                columns,
                setColumns,
                tasks,
                setTasks,
              );
              if (!task) return null;
              onTaskCreate(columnId, task as KanbanTask);
              setShowAddModal(false);
            }
          }}
          onUpdate={(taskId, formData) => {
            handleUpdate(taskId, formData, tasks, setTasks);
            onTaskUpdate(taskId, formData);
            setShowAddModal(false);
          }}
          columns={columns}
          addNewOrEdit={addNewOrEdit}
          onClose={() => {
            setShowAddModal(false);
          }}
        />
      )}
      {showColModal !== null && (
        <Modal
          showColModal={showColModal}
          onWipLimit={(limit) =>
            handleWipLimit({ limit, columnId: colToEdit, columns, setColumns })
          }
          onRename={(colName) =>
            handleColRename({
              colName,
              columnId: colToEdit,
              columns,
              setColumns,
            })
          }
          onClose={() => setShowColModal(null)}
        />
      )}
    </>
  );
};
