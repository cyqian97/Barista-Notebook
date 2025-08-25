import React, { useEffect, useState } from "react";
import { BREW_URL } from "./config";
import ReturnHomeButton from "./ReturnHomeButton";

function Brews() {
  const [brews, setBrews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(BREW_URL)
      .then((res) => res.json())
      .then((data) => {
        setBrews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <ReturnHomeButton />
      <h2>All Brews</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {brews.map((brew) => (
          <div
            key={brew.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              width: "300px",
              background: "#fafafa",
              boxShadow: "2px 2px 8px #eee"
            }}
          >
            <h3>Brew #{brew.id}</h3>
            <p><strong>Coffee Bean:</strong> {brew.coffee_bean_name || brew.coffee_bean_id}</p>
            <p><strong>Grinder:</strong> {brew.grinder_name || brew.grinder_id}</p>
            <p><strong>Method:</strong> {brew.method_name || brew.method_id}</p>
            <p><strong>Grind Size:</strong> {brew.grind_size}</p>
            <p><strong>Date Brewed:</strong> {brew.date_brewed}</p>
            <p><strong>Tasting Notes:</strong> {brew.tasting_notes}</p>
            {brew.parameters && Object.keys(brew.parameters).length > 0 && (
              <div>
                <strong>Parameters:</strong>
                <ul>
                  {Object.entries(brew.parameters).map(([k, v]) => (
                    <li key={k}>{k}: {v}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Brews;