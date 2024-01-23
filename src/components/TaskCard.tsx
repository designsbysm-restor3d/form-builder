import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Task } from "@/types";
import { Handle } from "./Handle";

interface Props {
  task: Task;
}

export const TaskCard = ({ task }: Props) => {
  const {
    setActivatorNodeRef,
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  let cardClasses = `
    p-3
    items-center
    flex    
    bg-black
    ml-[40px]
    `;

  if (isDragging) {
    cardClasses = `${cardClasses} opacity-30`;
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} className={cardClasses}>
      <Handle listeners={listeners} setActivatorNodeRef={setActivatorNodeRef} />
      <p className="ml-[10px]">{task.content}</p>
    </div>
  );
};
