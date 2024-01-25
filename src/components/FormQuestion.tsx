import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";

import type { Question } from "@/types";
import { FormFollowUp } from "@/components/FormFollowUp";
import { Handle } from "@/components/Handle";

interface Props {
  question: Question;
}

export const FormQuestion = ({ question }: Props) => {
  const followUpIds = useMemo(() => {
    return question.children?.map((followUp) => followUp.id);
  }, [question]);

  const {
    setNodeRef,
    setActivatorNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: question.id,
    data: {
      type: "Question",
      question,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  let classes = `
    bg-black
    w-[350px]
    flex
    flex-col
  `;

  if (isDragging) {
    classes = `${classes} opacity-30`;
  }

  return (
    <div ref={setNodeRef} style={style} className={classes}>
      <div {...attributes} className="p-3 flex items-center">
        <Handle listeners={listeners} setActivatorNodeRef={setActivatorNodeRef} />
        <div className="flex ml-[10px]">{question.prompt}</div>
      </div>
      <div className="flex flex-col">
        <SortableContext items={followUpIds ?? []} strategy={verticalListSortingStrategy}>
          {question.children?.map((followUp) => (
            <FormFollowUp key={followUp.id} followUp={followUp} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
