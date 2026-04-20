import React from "react";
import { Link } from "react-router-dom";

function ReturnHomeButton() {
  return (
    <Link to="/" className="return-home-link">
      ← Home
    </Link>
  );
}

export default ReturnHomeButton;
