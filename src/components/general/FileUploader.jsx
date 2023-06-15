/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useDropzone } from "react-dropzone";

const FileUploader = ({ onFileUpload, name }) => {
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFiles = acceptedFiles.slice(0, 3);
      onFileUpload(selectedFiles);
    }
  };

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      multiple: true,
    });

  const dropzoneStyles = {
    border: "2px dashed #999",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    marginTop: "20px",
    backgroundColor: isDragActive ? "#f8f8f8" : "transparent",
    width: "100%", // Ancho predeterminado
    ".filesList": {
      marginTop: "10px",
    },
    ".fileListItems": {
      marginTop: "10px",
      textAlign: "left", // Alinear a la izquierda
      paddingLeft: "0", // Eliminar el padding izquierdo predeterminado
    },
    ...(isDragActive && { width: "100%" }), // Ancho cuando isDragActive es true
  };

  const formatSize = (bytes) => {
    const megabytes = bytes / (1024 * 1024);
    return `${megabytes.toFixed(2)} MB`;
  };

  const selectedFiles = acceptedFiles.slice(0, 3);

  return (
    <div {...getRootProps()} css={dropzoneStyles}>
      <input {...getInputProps()} name={name}/>
      {isDragActive ? (
        <p>Drop the files here...</p>
      ) : (
        <p>Drag and drop files here, or click to select files</p>
      )}
      {selectedFiles && selectedFiles.length > 0 && (
        <div className="filesList">
          <h4>Selected Files:</h4>
          <ul className="fileListItems">
            {selectedFiles.map((file) => (
              <li key={file.name}>
                {file.name} ({formatSize(file.size)})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
