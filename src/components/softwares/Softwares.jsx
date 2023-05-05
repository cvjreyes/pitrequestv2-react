/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useEffect, useState } from "react";

import { Outlet } from "react-router-dom";

export default function Softwares() {
  const [softwares, setSoftwares] = useState({});
  const [tasks, setTasks] = useState({});
  const [subtask, setSubtask] = useState({});
  const [dataSoftware, setDataSoftware] = useState({});

  
  useEffect(() => {
    const getInfoSoftware = async (id) => {
      const software = await client.get(`/software/get_all/${id}`);
      setDataSoftware(software.res.data);
    };
    
    
  }, [])
  
  return (
    <div style={{ margin: "100px" }}>
      Softwares
      <Outlet />
    </div>
  );
}
