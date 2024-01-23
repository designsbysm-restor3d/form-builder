import "@/App.css";
import { Question } from "@/types";
import { FormBuilder } from "@/components/FormBuilder";

const questions: Question[] = [
  {
    id: "a829e0f2-79d2-4d87-82a4-b053c26a75da",
    prompt: "Is the patient in R3id?",
    children: [
      {
        id: "e464890d-fb1d-491e-9716-35460f4141bb",
        parentId: "a829e0f2-79d2-4d87-82a4-b053c26a75da",
        prompt: "What is the patient's name?",
      },
      {
        id: "2b3884e9-a40d-4009-b9f2-9666770bdd35",
        parentId: "a829e0f2-79d2-4d87-82a4-b053c26a75da",
        prompt: "What is the patient's gender?",
      },
      {
        id: "cc91fdcb-89ee-4f8c-9c32-facf6a83cca2",
        parentId: "a829e0f2-79d2-4d87-82a4-b053c26a75da",
        prompt: "What is the patient's phone number or email address?",
      },
    ],
  },
  {
    id: "43718c5d-191b-4195-9783-11be9b932c0e",
    prompt: "Is this a truama case?",
  },
  {
    id: "6afabba0-8607-4caf-8423-a64b951ee2c5",
    prompt: "Is this an oncology case?",
    children: [
      {
        id: "7b87af22-e9a1-4445-91ad-e88871f5231a",
        parentId: "6afabba0-8607-4caf-8423-a64b951ee2c5",
        prompt: "How much does the patient wieght?",
      },
    ],
  },
];

export const App = () => {
  return <FormBuilder questions={questions} />;
};
