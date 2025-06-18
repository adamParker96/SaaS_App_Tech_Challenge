import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authClient from "../authClient";

const LoginCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const tokenContainer = await authClient.token.parseFromUrl();
      authClient.tokenManager.setTokens(tokenContainer.tokens);
      navigate("/protected");
    };

    handleCallback();
  }, [navigate]);

  return <p className="p-6">Logging you in...</p>;
};

export default LoginCallback;
