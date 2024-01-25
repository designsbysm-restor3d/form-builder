import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
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
import { FormQuestion } from "@/components/FormQuestion";

interface Props {
  questions: Question[];
}

export const FormBuilder = ({ questions: defaultQuestions }: Props) => {
  const [dragQuestion, setDragQuestion] = useState<Question>();
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
    const current = event.active.data.current?.question as Question;
    setDragQuestion(current);
    console.log("DRAGGING", current?.prompt);
  };

  const onDragOver = (event: DragOverEvent) => {
    const current = event.over?.data.current?.question as Question;
    console.log("OVER", current?.prompt);
  };

  const onDragEnd = (event: DragEndEvent) => {
    console.log("DROPPING");
    setDragQuestion(undefined);

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
        const activeFollowUp = active.data.current?.question as Question;
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
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex flex-col">
          <SortableContext items={questionIds} strategy={verticalListSortingStrategy}>
            {questions.map((question) => (
              <FormQuestion key={question.id} question={question} />
            ))}
          </SortableContext>
        </div>
        {createPortal(
          <DragOverlay>{dragQuestion && <FormQuestion question={dragQuestion} />}</DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};
