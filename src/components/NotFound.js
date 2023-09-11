import React from "react";

function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1>404 Not Found</h1>
      <p>The page you're looking for does not exist.</p>
    </div>
  );
}

export default NotFound;
