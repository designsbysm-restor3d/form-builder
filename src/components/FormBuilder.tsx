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

import { Id, Question } from "@/types";
import { FormFollowUp } from "@/components/FormFollowUp";
import { FormQuestion } from "@/components/FormQuestion";

interface Props {
  questions: Question[];
}

export const FormBuilder = ({ questions: defaultQuestions }: Props) => {
  const [activeQuestion, setActiveQuestion] = useState<Question>();
  const [activeFollowUp, setActiveFollowUp] = useState<Question>();
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions);

  const questionIds = useMemo(() => questions.map((col) => col.id), [questions]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Question") {
      setActiveQuestion(event.active.data.current.question as Question);
      return;
    }

    if (event.active.data.current?.type === "FollowUp") {
      setActiveFollowUp(event.active.data.current.followUp as Question);
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveQuestion(undefined);
    setActiveFollowUp(undefined);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) {
      return;
    }

    const isActiveQuestion = active.data.current?.type === "Question";
    if (isActiveQuestion) {
      setQuestions((questions) => {
        const activeIndex = questions.findIndex((col) => col.id === activeId);
        const overIndex = questions.findIndex((col) => col.id === overId);

        return arrayMove(questions, activeIndex, overIndex);
      });
    }

    const isActiveFollowUp = active.data.current?.type === "FollowUp";
    const isOverFollowUp = over.data.current?.type === "FollowUp";
    if (isActiveFollowUp && isOverFollowUp) {
      setQuestions((questions) => {
        const activeFollowUp = active.data.current?.followUp as Question;
        const parentId = activeFollowUp?.parentId as Id;

        return questions.map((parentQuestion) => {
          if (parentQuestion.id !== parentId || !parentQuestion?.children) {
            return parentQuestion;
          }

          const activeIndex = parentQuestion?.children?.findIndex(
            (followUp) => followUp.id === activeId
          );
          const overIndex = parentQuestion?.children?.findIndex(
            (followUp) => followUp.id === overId
          );
          if (activeIndex === undefined || overIndex === undefined) {
            return parentQuestion;
          }

          const children = arrayMove(parentQuestion?.children, activeIndex, overIndex);

          return { ...parentQuestion, children };
        });
      });
    }
  };

  return (
    <div className="flex p-[20px]">
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex flex-col">
          <SortableContext items={questionIds} strategy={verticalListSortingStrategy}>
            {questions.map((question) => (
              <FormQuestion key={question.id} question={question} />
            ))}
          </SortableContext>
        </div>
        {createPortal(
          <DragOverlay>
            {activeQuestion && <FormQuestion question={activeQuestion} />}
            {activeFollowUp && <FormFollowUp followUp={activeFollowUp} />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};
