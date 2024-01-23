import { DraggableSyntheticListeners } from "@dnd-kit/core";

import { HandleIcon } from "@/icons/HandleIcon";

interface Props {
  listeners?: DraggableSyntheticListeners;
  setActivatorNodeRef: (element: HTMLElement | null) => void;
}

export const Handle = ({ listeners, setActivatorNodeRef }: Props) => {
  return (
    <div
      ref={setActivatorNodeRef}
      {...listeners}
      className="p-1 bg-handleColor text-black rounded-sm cursor-grab"
    >
      <HandleIcon />
    </div>
  );
};
