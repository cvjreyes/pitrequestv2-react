import { AlertDialog, Button } from "@nachogonzalezv99/ui-library";
import { forwardRef } from "react";

const DeleteNodeTree = forwardRef(({ deleteNode, open, setOpen }, ref) => {
  return (
    <div ref={ref}>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
          </AlertDialog.Header>
          <AlertDialog.Body>
            <AlertDialog.Description>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialog.Description>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <div className="justify-end flex gap-2">
              <AlertDialog.Action>
                <Button>Cancel</Button>
              </AlertDialog.Action>
              <AlertDialog.Action>
                <Button variant="destructive" onClick={deleteNode}>
                  Yes, delete
                </Button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </div>
  );
});

export default DeleteNodeTree;
