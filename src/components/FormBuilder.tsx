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

import { FollowUp, Question } from "@/types";
import { FormFollowUp } from "@/components/FormFollowUp";
import { FormQuestion } from "@/components/FormQuestion";

const defaultQuestions: Question[] = [
  {
    id: "a829e0f2-79d2-4d87-82a4-b053c26a75da",
    prompt: "Is the patient in R3id?",
  },
  {
    id: "43718c5d-191b-4195-9783-11be9b932c0e",
    prompt: "Is this a truama case?",
  },
  {
    id: "6afabba0-8607-4caf-8423-a64b951ee2c5",
    prompt: "Is this an oncology case?",
  },
];

const defaultFollowUps: FollowUp[] = [
  {
    id: "e464890d-fb1d-491e-9716-35460f4141bb",
    questionId: "a829e0f2-79d2-4d87-82a4-b053c26a75da",
    prompt: "What is the patient's name?",
  },
  {
    id: "2b3884e9-a40d-4009-b9f2-9666770bdd35",
    questionId: "a829e0f2-79d2-4d87-82a4-b053c26a75da",
    prompt: "What is the patient's gender?",
  },
  {
    id: "7b87af22-e9a1-4445-91ad-e88871f5231a",
    questionId: "6afabba0-8607-4caf-8423-a64b951ee2c5",
    prompt: "How much does the patient wieght?",
  },
  {
    id: "cc91fdcb-89ee-4f8c-9c32-facf6a83cca2",
    questionId: "a829e0f2-79d2-4d87-82a4-b053c26a75da",
    prompt: "What is the patient's phone number or email address?",
  },
];

export const FormBuilder = () => {
  const [activeQuestion, setActiveQuestion] = useState<Question>();
  const [activeFollowUp, setActiveFollowUp] = useState<FollowUp>();
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions);
  const [followUps, setFollowUps] = useState<FollowUp[]>(defaultFollowUps);

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
      setActiveFollowUp(event.active.data.current.followUp as FollowUp);
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
    if (activeId === overId) return;

    const isActiveQuestion = active.data.current?.type === "Question";

    if (isActiveQuestion) {
      setQuestions((questions) => {
        const active = questions.findIndex((col) => col.id === activeId);
        const over = questions.findIndex((col) => col.id === overId);

        return arrayMove(questions, active, over);
      });
    }

    const isActiveFollowUp = active.data.current?.type === "FollowUp";
    const isOverFollowUp = over.data.current?.type === "FollowUp";

    if (isActiveFollowUp && isOverFollowUp) {
      setFollowUps((followUps) => {
        const active = followUps.findIndex((t) => t.id === activeId);
        const over = followUps.findIndex((t) => t.id === overId);

        if (followUps[active].questionId != followUps[over].questionId) {
          return followUps;
        }

        return arrayMove(followUps, active, over);
      });
    }
  };

  return (
    <div className="flex p-[20px]">
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex flex-col">
          <SortableContext items={questionIds} strategy={verticalListSortingStrategy}>
            {questions.map((question) => (
              <FormQuestion
                followUps={followUps.filter((followUp) => followUp.questionId === question.id)}
                key={question.id}
                question={question}
              />
            ))}
          </SortableContext>
        </div>
        {createPortal(
          <DragOverlay>
            {activeQuestion && (
              <FormQuestion
                followUps={followUps.filter(
                  (followUp) => followUp.questionId === activeQuestion.id
                )}
                question={activeQuestion}
              />
            )}
            {activeFollowUp && <FormFollowUp followUp={activeFollowUp} />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};
