import { IconButton, TextField } from "@nachogonzalezv99/ui-library";
import React, { useState } from "react";
import { AiOutlineFolderOpen } from "react-icons/ai";

import { Dialog } from "@nachogonzalezv99/ui-library";

export default function Dialogattachment({ files }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // console.log(files);
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Dialog.Trigger>
        <IconButton>
          <AiOutlineFolderOpen />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title className="">Attachment Files</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          {files.map((file) => {
            return (
              <div key={file.id}>
                <a>{file.url}</a>;
              </div>
            );
          })}
        </Dialog.Body>
      </Dialog.Content>
    </Dialog>
  );
}
