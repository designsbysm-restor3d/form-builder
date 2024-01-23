import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { Column, Task } from "@/types";
import { ColumnContainer } from "@/components/ColumnContainer";
import { TaskCard } from "@/components/TaskCard";

const defaultCols: Column[] = [
  {
    id: "a829e0f2-79d2-4d87-82a4-b053c26a75da",
    title: "Is the patient in R3id?",
  },
  {
    id: "43718c5d-191b-4195-9783-11be9b932c0e",
    title: "Is this a truama case?",
  },
  {
    id: "6afabba0-8607-4caf-8423-a64b951ee2c5",
    title: "Is this an oncology case?",
  },
];

const defaultTasks: Task[] = [
  {
    id: "1",
    columnId: "a829e0f2-79d2-4d87-82a4-b053c26a75da",
    content: "What is the patient's name?",
  },
  {
    id: "2",
    columnId: "a829e0f2-79d2-4d87-82a4-b053c26a75da",
    content: "What is the patient's gender?",
  },
  {
    id: "5",
    columnId: "6afabba0-8607-4caf-8423-a64b951ee2c5",
    content: "How much does the patient wieght?",
  },
  {
    id: "8",
    columnId: "a829e0f2-79d2-4d87-82a4-b053c26a75da",
    content: "What is the patient's phone number or email address?",
  },
];

export const KanbanBoard = () => {
  const [activeColumn, setActiveColumn] = useState<Column>();
  const [activeTask, setActiveTask] = useState<Task>();
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column as Column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task as Task);
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(undefined);
    setActiveTask(undefined);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";

    if (isActiveAColumn) {
      setColumns((columns) => {
        const active = columns.findIndex((col) => col.id === activeId);
        const over = columns.findIndex((col) => col.id === overId);

        return arrayMove(columns, active, over);
      });
    }

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const active = tasks.findIndex((t) => t.id === activeId);
        const over = tasks.findIndex((t) => t.id === overId);

        if (tasks[active].columnId != tasks[over].columnId) {
          return tasks;
        }

        return arrayMove(tasks, active, over);
      });
    }
  };

  return (
    <div className="flex p-[20px]">
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex flex-col">
          <SortableContext items={columnsId} strategy={verticalListSortingStrategy}>
            {columns.map((column) => (
              <ColumnContainer
                key={column.id}
                column={column}
                tasks={tasks.filter((task) => task.columnId === column.id)}
              />
            ))}
          </SortableContext>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
              />
            )}
            {activeTask && <TaskCard task={activeTask} />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};
