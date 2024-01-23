import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";

import { Column, Task } from "@/types";
import { TaskCard } from "@/components/TaskCard";
import { Handle } from "./Handle";

interface Props {
  column: Column;
  tasks: Task[];
}

export const ColumnContainer = ({ column, tasks }: Props) => {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    setActivatorNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  let columnClasses = `
    bg-black
    w-[350px]
    rounded-md
    flex
    flex-col
  `;

  if (isDragging) {
    columnClasses = `${columnClasses} opacity-30`;
  }

  return (
    <div ref={setNodeRef} style={style} className={columnClasses}>
      <div {...attributes} className="p-3 flex items-center">
        <Handle listeners={listeners} setActivatorNodeRef={setActivatorNodeRef} />
        <div className="flex ml-[10px]">{column.title}</div>
      </div>
      <div className="flex flex-col">
        <SortableContext items={tasksIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
