/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useState } from "react";
import { useNotifications } from "reapop";

import TechnipLogo from "../../assets/technip.png";
import { Button } from "../general/Button";
import { TextField } from "../general/TextField";
import { client } from "../../helpers/config";
import { Link } from "react-router-dom";

export default function Login() {
  const { notify } = useNotifications();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return notify("Where do we send the link?", "warning");
    try {
      const res = await client.put("/auth/login", { email });
      notify(res.data, "success");
    } catch (err) {
      notify(err.response.data, "warning");
    }
    setEmail("");
  };

  return (
    <div css={styleLogin}>
      <form onSubmit={handleSubmit} className="form">
        <img src={TechnipLogo} alt="technip" className="technipLogo" />
        <h1 className="title">PitRequest</h1>
        <div className="inputWrapper">
          <TextField
            id="email"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button className="button">Login</Button>
          <span className="box_signin">
            First time in PitRequest?{" "}
            <Link to="/signin" className="signin_btn">
              Register
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}

const styleLogin = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  backgroundColor: "#E3EBF5",
  alignItems: "center",
  ".technipLogo": {
    width: "140px",
    display: "block",
    marginInline: "auto",
    marginBottom: "1rem",
  },
  ".form": {
    minWidth: "30rem",
    borderRadius: "10px",
    border: "1px solid #C3C3C3",
    padding: "2.5rem",
    backgroundColor: "#F7F7F7",
    ".title": {
      fontSize: "30px",
      marginBottom: "3rem",
      textAlign: "center",
    },
    ".inputWrapper": {
      display: "flex",
      gap: "0.7rem",
      flexDirection: "column",
      ".box_signin": {
        textAlign: "center",
        marginTop:"20px",
        ".signin_btn": {
          color: "blue",
          textDecoration: "underline",
        },
      },
    },
    ".button": {
      width: "100%",
    },
  },
};
