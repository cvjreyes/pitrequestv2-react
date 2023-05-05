/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";

import { Outlet } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ margin: "100px" }}>
      Home
      <Outlet />
    </div>
  );
}
