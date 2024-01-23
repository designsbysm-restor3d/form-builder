export type Id = string | number;

export type FollowUp = {
  id: Id;
  questionId: Id;
  prompt: string;
};

export type Question = {
  id: Id;
  prompt: string;
};
