/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useState } from "react";
import { useNotifications } from "reapop";
import { Link, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

import TechnipLogo from "../../assets/technip.png";
import { Button } from "../general/Button";
import { TextField } from "../general/TextField";
import { client } from "../../helpers/config";

export default function Signin() {
  const { notify } = useNotifications();
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return notify("Where do we send the link?", "warning");
    try {
      const res = await client.post("/auth/signin", { email });
      notify(res.data, "success");
      navigate("/login");
    } catch (err) {
      notify(err.response.data, "warning");
    }
    setEmail("");
  };

  return (
    <div css={styleSignin}>
      <form onSubmit={handleSubmit} className="form">
        <Link to="/login" className="signin_btn">
          <BiArrowBack fontSize="30px" />
        </Link>
        <img src={TechnipLogo} alt="technip" className="technipLogo" />
        <h1 className="title">PitRequest</h1>
        <div className="inputWrapper">
          <TextField
            id="email"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button className="button">REGISTER</Button>
        </div>
      </form>
    </div>
  );
}

const styleSignin = {
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
