import { IconButton, TextField } from "@nachogonzalezv99/ui-library";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { Link, Outlet } from "react-router-dom";
import { ProjectTreeView } from "./tree/ProjectTreeView";

export default function Projects() {
  return (
    <div className="flex h-full flex-1">
      <div className="relative border-r border-gray-300 p-5 shrink-0 overflow-y-auto">
        <div className="flex gap-2 items-center mb-3">
          <Link to={"/projects/create"}>
            <IconButton tooltip="Create new project">
              <AiOutlinePlus />
            </IconButton>
          </Link>
          <TextField id="search" className="h-10" />
        </div>
        <ProjectTreeView />
      </div>
      <div className="p-5 flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
