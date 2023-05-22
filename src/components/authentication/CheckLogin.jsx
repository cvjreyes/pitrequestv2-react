import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotifications } from "reapop";

import { useAuth } from "../../context/AuthContext";
import { client } from "../../helpers/config";

export default function CheckLogin() {
  const { user_id, token } = useParams();
  const navigate = useNavigate();
  const { notify } = useNotifications();
  const { login } = useAuth();

  useEffect(() => {
    const validateCredentials = async () => {
      try {
        const res = await client.post("/auth/validate-credentials", {
          user_id,
          token,
        });
        notify(res.data.email, "success");
        login(res.data);
      } catch (err) {
        console.log(err);
        notify(err.response.data, "info");
        navigate("/login");
      }
    };
    validateCredentials();
  }, []);

  return <div>CheckLogin</div>;
}
