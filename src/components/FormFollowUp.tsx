import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Question } from "@/types";
import { Handle } from "@/components/Handle";

interface Props {
  followUp: Question;
}

export const FormFollowUp = ({ followUp }: Props) => {
  const {
    setActivatorNodeRef,
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: followUp.id,
    data: {
      type: "FollowUp",
      followUp,
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
      <p className="ml-[10px]">{followUp.prompt}</p>
    </div>
  );
};
