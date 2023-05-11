/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, keyframes } from "@emotion/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRef } from "react";
import "@radix-ui/colors/blackA.css";
import "@radix-ui/colors/mauve.css";
import "@radix-ui/colors/violet.css";
import TaskModal from "./TaskModal";
import SubTaskModal from "./SubTaskModal";

export default function DropdownMenuSoftware({ id, getSoftwareTree, node }) {
  const ref = useRef(null);
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button aria-label="Customise options">
          <BsThreeDotsVertical className="icon" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content css={dropdownMenuStyle} sideOffset={5}>
          <DropdownMenu.Item className="DropdownMenuItem" asChild>
            {node === "software" ? (
              <TaskModal ref={ref} id={id} getSoftwareTree={getSoftwareTree} />
            ) : (
              <SubTaskModal
                ref={ref}
                id={id}
                getSoftwareTree={getSoftwareTree}
              />
            )}
          </DropdownMenu.Item>
          <DropdownMenu.Item className="DropdownMenuItem" disabled>
            Delete
          </DropdownMenu.Item>
          <DropdownMenu.Arrow className="DropdownMenuArrow" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

const slideUpAndFade = keyframes`
from {
  opacity: 0;
  transform: translateY(2px);
}
to {
  opacity: 1;
  transform: translateY(0);
}`;

const slideRightAndFade = keyframes`
from {
  opacity: 0;
  transform: translateX(-2px);
}
to {
  opacity: 1;
  transform: translateX(0);
}`;

const slideDownAndFade = keyframes`
from {
  opacity: 0;
  transform: translateY(-2px);
}
to {
  opacity: 1;
  transform: translateY(0);
}`;

const slideLeftAndFade = keyframes`
from {
  opacity: 0;
  transform: translateX(2px);
}
to {
  opacity: 1;
  transform: translateX(0);
}`;

const dropdownMenuStyle = {
  minWidth: "140px",
  backgroundColor: "white",
  borderRadius: "6px",
  padding: "5px",
  boxShadow:
    "0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)",
  animationDuration: "400ms",
  animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  willChange: "transform, opacity",
  "&[data-side='top']": {
    animationName: `${slideDownAndFade}`,
  },
  "&[data-side='right']": {
    animationName: `${slideLeftAndFade}`,
  },
  "&[data-side='bottom']": {
    animationName: `${slideUpAndFade}`,
  },
  "&[data-side='left']": {
    animationName: `${slideRightAndFade}`,
  },
  ".DropdownMenuItem": {
    fontSize: "13px",
    lineHeight: "1",
    color: "var(--violet11)",
    borderRadius: "3px",
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    height: "25px",
    padding: "0 5px",
    position: "relative",
    paddingLeft: "25px",
    userSelect: "none",
    outline: "none",
    margin: "5px 0",
    "&[data-disabled]": {
      color: "var(--violet1)",
      backgroundColor: "var(--violet9)",
    },
    "&[data-highlighted]": {
      color: "var(--violet1)",
      backgroundColor: "var(--violet9)",
    },
  },
  ".DropdownMenuArrow": {
    fill: "white",
  },
};
