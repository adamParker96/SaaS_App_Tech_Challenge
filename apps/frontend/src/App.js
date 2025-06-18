import React, { useEffect, useState } from "react";
import authClient from "./authClient";

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [protectedMessage, setProtectedMessage] = useState("");

  const login = async () => {
    const tokens = await authClient.token.getWithRedirect({
      responseType: "code",
      scopes: ["openid", "profile", "email"],
    });
  };

  const handleCallback = async () => {
    const tokenContainer = await authClient.token.parseFromUrl();
    authClient.tokenManager.setTokens(tokenContainer.tokens);
    const token = tokenContainer.tokens.accessToken.accessToken;
    const user = await authClient.token.getUserInfo();
    setAccessToken(token);
    setUserInfo(user);
    window.history.replaceState({}, document.title, "/");
  };

  const fetchProtected = async () => {
    const token = (await authClient.tokenManager.get("accessToken"))?.accessToken;
    if (!token) return;

    const res = await fetch("http://localhost:6000/jwt-protected", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setProtectedMessage(data.message);
  };

  useEffect(() => {
    if (window.location.pathname === "/login/callback") {
      handleCallback();
    }
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">React + Okta JWT Auth</h1>
      {!accessToken ? (
        <button onClick={login} className="bg-blue-600 text-white px-4 py-2 rounded">
          Login with Okta
        </button>
      ) : (
        <>
          <p className="mb-2">Logged in as: {userInfo?.email}</p>
          <button
            onClick={fetchProtected}
            className="bg-green-600 text-white px-4 py-2 rounded mr-2"
          >
            Call Protected API
          </button>
          <p className="mt-4 text-green-700">{protectedMessage}</p>
        </>
      )}
    </div>
  );
}

export default App;
