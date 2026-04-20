import React, { useEffect, useState } from "react";
import ReturnHomeButton from "./ReturnHomeButton";
import { GRINDER_URL, BREWING_METHOD_URL, METHOD_PARAMS_URL } from "./config";
import "./Equipment.css";

function Equipment() {
  const [grinders, setGrinders] = useState([]);
  const [methods, setMethods] = useState([]);
  const [newGrinderName, setNewGrinderName] = useState("");
  const [newMethodName, setNewMethodName] = useState("");
  const [expandedMethod, setExpandedMethod] = useState(null);
  const [methodParams, setMethodParams] = useState({});
  const [newParamName, setNewParamName] = useState("");
  const [newParamDesc, setNewParamDesc] = useState("");

  useEffect(() => {
    fetch(GRINDER_URL).then((r) => r.json()).then(setGrinders);
    fetch(BREWING_METHOD_URL).then((r) => r.json()).then(setMethods);
  }, []);

  const loadParams = (methodId) => {
    fetch(METHOD_PARAMS_URL(methodId))
      .then((r) => r.json())
      .then((params) => setMethodParams((prev) => ({ ...prev, [methodId]: params })));
  };

  const toggleMethod = (methodId) => {
    if (expandedMethod === methodId) {
      setExpandedMethod(null);
    } else {
      setExpandedMethod(methodId);
      if (!methodParams[methodId]) loadParams(methodId);
    }
    setNewParamName("");
    setNewParamDesc("");
  };

  // Grinder actions
  const handleAddGrinder = (e) => {
    e.preventDefault();
    const name = newGrinderName.trim();
    if (!name) return;
    fetch(GRINDER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((g) => { setGrinders((prev) => [...prev, g]); setNewGrinderName(""); })
      .catch(() => alert("Error: grinder may already exist"));
  };

  const handleDeleteGrinder = (id) => {
    fetch(`${GRINDER_URL}${id}`, { method: "DELETE" })
      .then((r) => { if (!r.ok) throw new Error(); })
      .then(() => setGrinders((prev) => prev.filter((g) => g.id !== id)))
      .catch(() => alert("Error deleting grinder"));
  };

  // Method actions
  const handleAddMethod = (e) => {
    e.preventDefault();
    const name = newMethodName.trim();
    if (!name) return;
    fetch(BREWING_METHOD_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((m) => { setMethods((prev) => [...prev, m]); setNewMethodName(""); })
      .catch(() => alert("Error: method may already exist"));
  };

  const handleDeleteMethod = (id) => {
    fetch(`${BREWING_METHOD_URL}${id}`, { method: "DELETE" })
      .then((r) => { if (!r.ok) throw new Error(); })
      .then(() => {
        setMethods((prev) => prev.filter((m) => m.id !== id));
        if (expandedMethod === id) setExpandedMethod(null);
        setMethodParams((prev) => { const next = { ...prev }; delete next[id]; return next; });
      })
      .catch(() => alert("Error deleting method"));
  };

  // Parameter actions
  const handleAddParam = (e, methodId) => {
    e.preventDefault();
    const name = newParamName.trim();
    if (!name) return;
    fetch(METHOD_PARAMS_URL(methodId), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parameter_name: name, description: newParamDesc.trim() }),
    })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((param) => {
        setMethodParams((prev) => ({
          ...prev,
          [methodId]: [...(prev[methodId] || []), param],
        }));
        setNewParamName("");
        setNewParamDesc("");
      })
      .catch(() => alert("Error adding parameter"));
  };

  const handleDeleteParam = (methodId, paramId) => {
    fetch(`${METHOD_PARAMS_URL(methodId)}${paramId}`, { method: "DELETE" })
      .then((r) => { if (!r.ok) throw new Error(); })
      .then(() => {
        setMethodParams((prev) => ({
          ...prev,
          [methodId]: prev[methodId].filter((p) => p.id !== paramId),
        }));
      })
      .catch(() => alert("Error deleting parameter"));
  };

  return (
    <div className="page">
      <h1>🔧 Equipment</h1>
      <ReturnHomeButton />

      <div className="equipment-grid">
        {/* Grinders */}
        <div className="equip-section card">
          <h2>⚙️ Grinders</h2>
          <ul className="equip-list">
            {grinders.map((g) => (
              <li key={g.id} className="equip-item">
                <span>{g.name}</span>
                <button className="btn-danger btn-sm" onClick={() => handleDeleteGrinder(g.id)}>🗑 Delete</button>
              </li>
            ))}
            {grinders.length === 0 && <li className="equip-empty">No grinders yet</li>}
          </ul>
          <form className="equip-add-form" onSubmit={handleAddGrinder}>
            <input
              type="text"
              value={newGrinderName}
              onChange={(e) => setNewGrinderName(e.target.value)}
              placeholder="Grinder name"
            />
            <button type="submit" className="btn-primary btn-sm">+ Add</button>
          </form>
        </div>

        {/* Brewing Methods */}
        <div className="equip-section card">
          <h2>☕ Brewing Methods</h2>
          <ul className="equip-list">
            {methods.map((m) => (
              <li key={m.id} className="method-item">
                <div className="method-header">
                  <button className="method-toggle" onClick={() => toggleMethod(m.id)}>
                    {expandedMethod === m.id ? "▾" : "▸"} {m.name}
                  </button>
                  <button className="btn-danger btn-sm" onClick={() => handleDeleteMethod(m.id)}>🗑 Delete</button>
                </div>

                {expandedMethod === m.id && (
                  <div className="params-panel">
                    <h4>Parameters</h4>
                    <ul className="params-list">
                      {(methodParams[m.id] || []).map((p) => (
                        <li key={p.id} className="param-item">
                          <div className="param-info">
                            <span className="param-name">{p.parameter_name}</span>
                            {p.description && <span className="param-desc">{p.description}</span>}
                          </div>
                          <button className="btn-danger btn-sm" onClick={() => handleDeleteParam(m.id, p.id)}>✕</button>
                        </li>
                      ))}
                      {(methodParams[m.id] || []).length === 0 && (
                        <li className="equip-empty">No parameters defined</li>
                      )}
                    </ul>
                    <form className="param-add-form" onSubmit={(e) => handleAddParam(e, m.id)}>
                      <input
                        type="text"
                        value={newParamName}
                        onChange={(e) => setNewParamName(e.target.value)}
                        placeholder="Parameter name"
                      />
                      <input
                        type="text"
                        value={newParamDesc}
                        onChange={(e) => setNewParamDesc(e.target.value)}
                        placeholder="Description (optional)"
                      />
                      <button type="submit" className="btn-primary btn-sm">+ Add</button>
                    </form>
                  </div>
                )}
              </li>
            ))}
            {methods.length === 0 && <li className="equip-empty">No methods yet</li>}
          </ul>
          <form className="equip-add-form" onSubmit={handleAddMethod}>
            <input
              type="text"
              value={newMethodName}
              onChange={(e) => setNewMethodName(e.target.value)}
              placeholder="Method name"
            />
            <button type="submit" className="btn-primary btn-sm">+ Add</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Equipment;
