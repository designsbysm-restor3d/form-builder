export type Id = string | number;

export type Question = {
  id: Id;
  prompt: string;
  parentId?: Id;
  children?: Question[];
};
