import { Dialog, IconButton } from "@nachogonzalezv99/ui-library";
import React, { useState } from "react";
import { AiOutlineFolderOpen } from "react-icons/ai";

export default function Dialogattachment({ files }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const downloadFile = async (filename) => {
    fetch(
      `http://${import.meta.env.VITE_SERVER}:${
        import.meta.env.VITE_NODE_PORT
      }/uploads/${filename}`
    ).then((response) => {
      response.blob().then((blob) => {
        // Creating new object of PDF file
        const fileURL = window.URL.createObjectURL(blob);
        // Setting various property values
        let alink = document.createElement("a");
        alink.href = fileURL;
        alink.download = filename;
        alink.click();
      });
    });
  };

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
                <a
                  className="text-blue-600 underline cursor-pointer"
                  onClick={() => downloadFile(file.url)}
                >
                  {file.url.split("/").pop()}
                </a>
              </div>
            );
          })}
        </Dialog.Body>
      </Dialog.Content>
    </Dialog>
  );
}
