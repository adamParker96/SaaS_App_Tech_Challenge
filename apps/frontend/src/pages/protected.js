import React, { useEffect, useState } from "react";
import authClient from "../authClient";

const Protected = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [apiMessage, setApiMessage] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [selectedService, setSelectedService] = useState("users");

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

    const serviceMap = {
      users: "http://localhost:6000/users-api",
      articles: "http://localhost:6000/articles-api",
      files: "http://localhost:6000/files-api",
    };

    const res = await fetch(serviceMap[selectedService], {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ input: inputValue }),
    });

    const data = await res.json();
    setApiMessage(data.message || JSON.stringify(data));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Protected Page</h1>
      <p className="mb-4">Welcome, {userInfo?.email}</p>

      <div className="mb-4 space-x-2">
        <button
          className={`px-4 py-2 rounded ${
            selectedService === "users" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setSelectedService("users")}
        >
          Users
        </button>
        <button
          className={`px-4 py-2 rounded ${
            selectedService === "articles" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setSelectedService("articles")}
        >
          Articles
        </button>
        <button
          className={`px-4 py-2 rounded ${
            selectedService === "files" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setSelectedService("files")}
        >
          Files
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type something"
          className="border border-gray-300 px-3 py-2 rounded mr-2 w-80"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>

      <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded">
        Logout
      </button>

      {apiMessage && <p className="mt-4 whitespace-pre-line">{apiMessage}</p>}
    </div>
  );
};

export default Protected;
