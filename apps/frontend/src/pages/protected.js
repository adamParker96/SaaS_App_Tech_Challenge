import React, { useEffect, useState } from "react";
import authClient from "../authClient";

const Protected = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [apiMessage, setApiMessage] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const user = await authClient.token.getUserInfo();
      setUserInfo(user);
    };

    fetchUser();
  }, []);

  const logout = async () => {
    await authClient.signOut();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessToken = (await authClient.tokenManager.get("accessToken"))?.accessToken;
    const res = await fetch("http://localhost:6000/jwt-protected", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();
    setApiMessage(data.message);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Protected Page</h1>
      <p className="mb-4">Welcome, {userInfo?.email}</p>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type something to call the API"
          className="border border-gray-300 px-3 py-2 rounded mr-2"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>

      <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded">
        Logout
      </button>

      {apiMessage && <p className="mt-4">{apiMessage}</p>}
    </div>
  );
};

export default Protected;
