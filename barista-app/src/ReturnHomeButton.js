import React from "react";
import { Link } from "react-router-dom";

function ReturnHomeButton() {
  return (
    <div style={{ marginBottom: "20px" }}>
      <Link to="/"><button>Return to Index Page</button></Link>
    </div>
  );
}

export default ReturnHomeButton;