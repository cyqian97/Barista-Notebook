import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { BREW_URL, COFFEE_BEAN_URL } from "./config";
import ReturnHomeButton from "./ReturnHomeButton";
import "./Brews.css";

function Brews() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [brews, setBrews] = useState([]);
  const [beans, setBeans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBeans, setSelectedBeans] = useState([]);
  const [selectedMethods, setSelectedMethods] = useState([]);

  useEffect(() => {
    const beanIdParam = searchParams.get("bean_id");
    if (beanIdParam) {
      setSelectedBeans([beanIdParam]);
    }

    Promise.all([
      fetch(BREW_URL).then((res) => res.json()),
      fetch(COFFEE_BEAN_URL).then((res) => res.json()),
    ])
      .then(([brewData, beanData]) => {
        setBrews(brewData);
        setBeans(beanData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const uniqueMethods = [...new Map(brews.map((b) => [b.method_id, { id: b.method_id, name: b.method_name }])).values()];

  const handleBeanFilterChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (o) => o.value);
    setSelectedBeans(selected);
  };

  const handleMethodFilterChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (o) => o.value);
    setSelectedMethods(selected);
  };

  const handleDeleteBrew = (id) => {
    if (!window.confirm("Delete this brew?")) return;
    fetch(`${BREW_URL}${id}`, { method: "DELETE" })
      .then((res) => { if (!res.ok) throw new Error(); })
      .then(() => setBrews((prev) => prev.filter((b) => b.id !== id)))
      .catch(() => alert("Error deleting brew"));
  };

  const filteredBrews = brews.filter((brew) => {
    const beanMatch = selectedBeans.length === 0 || selectedBeans.includes(String(brew.coffee_bean_id));
    const methodMatch = selectedMethods.length === 0 || selectedMethods.includes(String(brew.method_id));
    return beanMatch && methodMatch;
  });

  if (loading) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <h1>☕ All Brews</h1>
      <ReturnHomeButton />
      <div className="brews-filters">
        <div>
          <label>Filter by Bean (hold Ctrl/Cmd for multiple):</label>
          <br />
          <select multiple value={selectedBeans} onChange={handleBeanFilterChange} size={4}>
            {beans.map((bean) => (
              <option key={bean.id} value={String(bean.id)}>
                {bean.name}
              </option>
            ))}
          </select>
          {selectedBeans.length > 0 && (
            <button type="button" className="btn-ghost" onClick={() => setSelectedBeans([])}>Clear</button>
          )}
        </div>
        <div>
          <label>Filter by Method (hold Ctrl/Cmd for multiple):</label>
          <br />
          <select multiple value={selectedMethods} onChange={handleMethodFilterChange} size={4}>
            {uniqueMethods.map((m) => (
              <option key={m.id} value={String(m.id)}>
                {m.name}
              </option>
            ))}
          </select>
          {selectedMethods.length > 0 && (
            <button type="button" className="btn-ghost" onClick={() => setSelectedMethods([])}>Clear</button>
          )}
        </div>
      </div>
      <div className="brews-container">
        {filteredBrews.map((brew) => (
          <div key={brew.id} className="brew-box">
            <div className="brew-box-header">
              <h3>☕ Brew #{brew.id}</h3>
              <button className="btn-ghost btn-sm" onClick={() => navigate(`/addbrew?edit=${brew.id}`)}>✏️ Edit</button>
              <button className="btn-danger btn-sm" onClick={() => handleDeleteBrew(brew.id)}>🗑 Delete</button>
            </div>
            <p><strong>Coffee Bean:</strong> {brew.coffee_bean_name || brew.coffee_bean_id}</p>
            <p><strong>Grinder:</strong> {brew.grinder_name || brew.grinder_id}</p>
            <p><strong>Method:</strong> {brew.method_name || brew.method_id}</p>
            <p><strong>Grind Size:</strong> {brew.grind_size}</p>
            <p><strong>Date Brewed:</strong> {brew.date_brewed}</p>
            <p><strong>Tasting Notes:</strong> {brew.tasting_notes}</p>
            {brew.parameters && brew.parameters.length > 0 && (
              <div className="brew-parameters">
                <strong>Parameters:</strong>
                <ul>
                  {brew.parameters.map((p) => (
                    <li key={p.name}>{p.name}: {p.value}</li>
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
