/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, keyframes } from "@emotion/react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { forwardRef } from "react";

import "@radix-ui/colors/blackA.css";
import "@radix-ui/colors/red.css";
import "@radix-ui/colors/mauve.css";
import "@radix-ui/colors/violet.css";

const DeleteNodeTree = forwardRef(({ deleteNode, open, setOpen }, ref) => {
  return (
    <div ref={ref}>
      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay css={AlertDialogOverlayStyle} />
          <AlertDialog.Content css={AlertDialogContentStyle}>
            <AlertDialog.Title className="AlertDialogTitle">
              Are you absolutely sure?
            </AlertDialog.Title>
            <AlertDialog.Description className="AlertDialogDescription">
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialog.Description>
            <div
              style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}
            >
              <AlertDialog.Cancel asChild>
                <button className="Button mauve">Cancel</button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button className="Button red" onClick={deleteNode}>
                  Yes, delete
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
});

const overlayShow = keyframes`
from {
    opacity: 0;
}
to {
    opacity: 1;
}`;

const contentShow = keyframes`
from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
}
to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
}
`;

const AlertDialogOverlayStyle = {
  backgroundColor: "var(--blackA9)",
  position: "fixed",
  inset: "0",
  animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
};

const AlertDialogContentStyle = {
  backgroundColor: "white",
  borderRadius: "6px",
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  maxWidth: "500px",
  maxHeight: "85vh",
  padding: "25px",
  animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  ":focus": {
    outline: "none",
  },
  ".AlertDialogTitle": {
    margin: "0",
    color: "var(--mauve12)",
    fontSize: "17px",
    fontWeight: "500",
  },
  ".AlertDialogDescription": {
    marginBottom: "20px",
    color: "var(--mauve11)",
    fontSize: "15px",
    lineHeight: "1.5",
  },
  ".Button": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
    padding: "0 15px",
    fontSize: "15px",
    lineHeight: "1",
    fontWeight: "500",
    height: "35px",
  },
  ".violet": {
    backgroundColor: "white",
    color: "var(--violet11)",
    boxShadow: "0 2px 10px var(--blackA7)",
    ":hover": {
      backgroundColor: "var(--mauve3)",
    },
    ":focus": {
      boxShadow: "0 0 0 2px black",
    },
  },
  ".red": {
    backgroundColor: "var(--red4)",
    color: "var(--red11)",
    ":hover": {
      backgroundColor: "var(--red5)",
    },
    ":focus": {
      boxShadow: "0 0 0 2px var(--red7)",
    },
  },
  ".mauve": {
    backgroundColor: "var(--mauve4)",
    color: "var(--mauve11)",
    ":hover": {
      backgroundColor: "var(--mauve5)",
    },
    ":focus": {
      boxShadow: "0 0 0 2px var(--mauve7)",
    },
  },
};

export default DeleteNodeTree;
