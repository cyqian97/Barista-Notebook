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
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Coffee Bean</th>
            <th>Grinder</th>
            <th>Method</th>
            <th>Grind Size</th>
            <th>Date Brewed</th>
            <th>Tasting Notes</th>
            <th>Parameters</th>
          </tr>
        </thead>
        <tbody>
          {brews.map((brew) => (
            <tr key={brew.id}>
              <td>{brew.id}</td>
              <td>{brew.coffee_bean_name || brew.coffee_bean_id}</td>
              <td>{brew.grinder_name || brew.grinder_id}</td>
              <td>{brew.method_name || brew.method_id}</td>
              <td>{brew.grind_size}</td>
              <td>{brew.date_brewed}</td>
              <td>{brew.tasting_notes}</td>
              <td>
                {brew.parameters && Object.entries(brew.parameters).map(([k, v]) => (
                  <div key={k}>{k}: {v}</div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Brews;