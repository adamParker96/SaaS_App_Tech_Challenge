//  home page - redirects to Okta login
import React from "react";
import authClient from "../authClient";

const Home = () => {
  const login = async () => {
    await authClient.token.getWithRedirect({
      responseType: "code",
      scopes: ["openid", "profile", "email"],
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Home Page</h1>
      <button onClick={login} className="bg-blue-600 text-white px-4 py-2 rounded">
        Login with Okta
      </button>
    </div>
  );
};

export default Home;
