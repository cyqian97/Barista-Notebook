import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { COFFEE_BEAN_URL, BREW_URL, BASE_URL, BREWING_METHOD_URL, GRINDER_URL, COMMON_PARAMS_URL } from "./config";
import ReturnHomeButton from "./ReturnHomeButton";
import "./AddBrew.css";

function AddBrew() {
  const [searchParams] = useSearchParams();
  const [coffeeBeans, setCoffeeBeans] = useState([]);
  const [grinders, setGrinders] = useState([]);
  const [methods, setMethods] = useState([]);
  const [parameterTemplates, setParameterTemplates] = useState([]);
  const [brewParameters, setBrewParameters] = useState({});
  const [customParameters, setCustomParameters] = useState([]);
  const [newCustomParam, setNewCustomParam] = useState({ name: "", value: "" });
  const [commonParameterTemplates, setCommonParameterTemplates] = useState([]);
  const [commonParamValues, setCommonParamValues] = useState({});
  const [coffeeDose, setCoffeeDose] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editBrewId, setEditBrewId] = useState(null);
  const [pendingEditParams, setPendingEditParams] = useState(null);
  const [templatesLoaded, setTemplatesLoaded] = useState(true);
  const [newMethodName, setNewMethodName] = useState("");
  const [showNewMethodInput, setShowNewMethodInput] = useState(false);
  const [newGrinderName, setNewGrinderName] = useState("");
  const [showNewGrinderInput, setShowNewGrinderInput] = useState(false);
  const [brewData, setBrewData] = useState({
    coffee_bean_id: "",
    grinder_id: "",
    method_id: "",
    grind_size: "",
    date_brewed: "",
    tasting_notes: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(COFFEE_BEAN_URL).then((res) => res.json()).then((data) => {
      setCoffeeBeans(data);
      const beanId = searchParams.get("bean_id");
      if (beanId) {
        setBrewData((prev) => ({ ...prev, coffee_bean_id: beanId }));
      }
    });
    fetch(BASE_URL + "grinders/").then((res) => res.json()).then(setGrinders);
    fetch(BASE_URL + "brewing-methods/").then((res) => res.json()).then(setMethods);
    fetch(COMMON_PARAMS_URL).then((res) => res.json()).then(setCommonParameterTemplates);

    const editId = searchParams.get("edit");
    if (editId) {
      setIsEditing(true);
      setEditBrewId(editId);
      fetch(`${BREW_URL}${editId}`)
        .then((res) => res.json())
        .then((brew) => {
          setBrewData({
            coffee_bean_id: String(brew.coffee_bean_id),
            grinder_id: String(brew.grinder_id),
            method_id: String(brew.method_id),
            grind_size: String(brew.grind_size),
            date_brewed: brew.date_brewed ? brew.date_brewed.slice(0, 16) : "",
            tasting_notes: brew.tasting_notes || "",
          });
          setPendingEditParams(brew.parameters);
        });
    }
  }, []);

  useEffect(() => {
    if (!pendingEditParams || !templatesLoaded) return;
    const methodParamNames = new Set(parameterTemplates.map((p) => p.parameter_name));
    const commonParamNames = new Set(commonParameterTemplates.map((p) => p.parameter_name));
    const newBrewParams = {};
    const newCommonValues = {};
    const newBrewRecordParams = [];
    let newCoffeeDose = "";
    pendingEditParams.forEach(({ name, value }) => {
      if (name === "Coffee Dose") newCoffeeDose = value;
      else if (commonParamNames.has(name)) newCommonValues[name] = value;
      else if (methodParamNames.has(name)) newBrewParams[name] = value;
      else newBrewRecordParams.push({ name, value });
    });
    setCoffeeDose(newCoffeeDose);
    setCommonParamValues(newCommonValues);
    setBrewParameters(newBrewParams);
    setCustomParameters(newBrewRecordParams);
    setPendingEditParams(null);
  }, [pendingEditParams, templatesLoaded, commonParameterTemplates]);

  useEffect(() => {
    setTemplatesLoaded(false);
    if (brewData.method_id) {
      fetch(`${BREWING_METHOD_URL}${brewData.method_id}/parameters/`)
        .then((res) => res.json())
        .then((data) => {
          setParameterTemplates(data);
          setTemplatesLoaded(true);
        });
    } else {
      setParameterTemplates([]);
      setTemplatesLoaded(true);
    }
    setBrewParameters({});
    setCustomParameters([]);
  }, [brewData.method_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "method_id" && value === "add_new_method") {
      setShowNewMethodInput(true);
      return;
    }
    if (name === "grinder_id" && value === "add_new_grinder") {
      setShowNewGrinderInput(true);
      return;
    }
    setBrewData({ ...brewData, [name]: value });
  };

  const handleAddNewGrinder = () => {
    const name = newGrinderName.trim();
    if (!name) return;
    fetch(GRINDER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create grinder");
        return res.json();
      })
      .then((newGrinder) => {
        setGrinders((prev) => [...prev, newGrinder]);
        setBrewData((prev) => ({ ...prev, grinder_id: String(newGrinder.id) }));
        setNewGrinderName("");
        setShowNewGrinderInput(false);
      })
      .catch(() => setMessage("Error creating new grinder"));
  };

  const handleAddNewMethod = () => {
    const name = newMethodName.trim();
    if (!name) return;
    fetch(BREWING_METHOD_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create method");
        return res.json();
      })
      .then((newMethod) => {
        setMethods((prev) => [...prev, newMethod]);
        setBrewData((prev) => ({ ...prev, method_id: String(newMethod.id) }));
        setNewMethodName("");
        setShowNewMethodInput(false);
      })
      .catch(() => setMessage("Error creating new method"));
  };

  const handleCommonParamChange = (e) => {
    const { name, value } = e.target;
    setCommonParamValues({ ...commonParamValues, [name]: value });
  };

  const handleParameterChange = (e) => {
    const { name, value } = e.target;
    setBrewParameters({ ...brewParameters, [name]: value });
  };

  const handleCustomParamChange = (e) => {
    const { name, value } = e.target;
    setNewCustomParam({ ...newCustomParam, [name]: value });
  };

  const handleAddCustomParam = (e) => {
    e.preventDefault();
    if (newCustomParam.name.trim() !== "") {
      setCustomParameters([...customParameters, { name: newCustomParam.name, value: newCustomParam.value }]);
      setNewCustomParam({ name: "", value: "" });
    }
  };

  const handleCustomParamValueChange = (index, value) => {
    const updated = [...customParameters];
    updated[index].value = value;
    setCustomParameters(updated);
  };

  const handleRemoveCustomParam = (index) => {
    setCustomParameters(customParameters.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allParameters = {};
    if (coffeeDose.trim() !== "") {
      allParameters["Coffee Dose"] = coffeeDose;
    }
    Object.entries(commonParamValues).forEach(([k, v]) => {
      if (v.trim() !== "") allParameters[k] = v;
    });
    Object.assign(allParameters, brewParameters);
    customParameters.forEach((param) => {
      allParameters[param.name] = param.value;
    });
    const payload = { ...brewData, parameters: allParameters };
    const url = isEditing ? `${BREW_URL}${editBrewId}` : BREW_URL;
    const method = isEditing ? "PUT" : "POST";
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save brew");
        return res.json();
      })
      .then(() => {
        setMessage(isEditing ? "Brew updated successfully!" : "Brew added successfully!");
        if (!isEditing) {
          setBrewData({
            coffee_bean_id: "",
            grinder_id: "",
            method_id: "",
            grind_size: "",
            date_brewed: "",
            tasting_notes: "",
          });
          setParameterTemplates([]);
          setBrewParameters({});
          setCustomParameters([]);
          setCoffeeDose("");
          setCommonParamValues({});
        }
      })
      .catch(() => setMessage("Error adding brew"));
  };

  return (
    <div className="add-brew-page">
      <ReturnHomeButton />
      <h2>{isEditing ? `✏️ Edit Brew #${editBrewId}` : "⚗️ Add Brew"}</h2>
      <form className="brew-form" onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Coffee Bean</label>
          <select name="coffee_bean_id" value={brewData.coffee_bean_id} onChange={handleChange} required>
            <option value="">Select a bean...</option>
            {coffeeBeans.map((bean) => (
              <option key={bean.id} value={bean.id}>{bean.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Brewing Method</label>
          <select name="method_id" value={brewData.method_id} onChange={handleChange} required>
            <option value="">Select a method...</option>
            {methods.map((method) => (
              <option key={method.id} value={method.id}>{method.name}</option>
            ))}
            <option value="add_new_method">+ Add New Method</option>
          </select>
          {showNewMethodInput && (
            <div className="new-method-row">
              <input
                type="text"
                value={newMethodName}
                onChange={(e) => setNewMethodName(e.target.value)}
                placeholder="New method name"
              />
              <button type="button" className="btn-secondary" onClick={handleAddNewMethod}>Confirm</button>
              <button type="button" className="btn-ghost" onClick={() => { setShowNewMethodInput(false); setNewMethodName(""); }}>Cancel</button>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Grinder</label>
          <select name="grinder_id" value={brewData.grinder_id} onChange={handleChange} required>
            <option value="">Select a grinder...</option>
            {grinders.map((grinder) => (
              <option key={grinder.id} value={grinder.id}>{grinder.name}</option>
            ))}
            <option value="add_new_grinder">+ Add New Grinder</option>
          </select>
          {showNewGrinderInput && (
            <div className="new-method-row">
              <input
                type="text"
                value={newGrinderName}
                onChange={(e) => setNewGrinderName(e.target.value)}
                placeholder="New grinder name"
              />
              <button type="button" className="btn-secondary" onClick={handleAddNewGrinder}>Confirm</button>
              <button type="button" className="btn-ghost" onClick={() => { setShowNewGrinderInput(false); setNewGrinderName(""); }}>Cancel</button>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Grind Size</label>
          <input type="number" name="grind_size" value={brewData.grind_size} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Date Brewed</label>
          <input type="datetime-local" name="date_brewed" value={brewData.date_brewed} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Coffee Dose</label>
          <input type="text" value={coffeeDose} onChange={(e) => setCoffeeDose(e.target.value)} placeholder="e.g. 18g" />
        </div>

        {commonParameterTemplates.map((param) => (
          <div key={param.id} className="form-group">
            <label>{param.parameter_name}</label>
            <input
              type="text"
              name={param.parameter_name}
              value={commonParamValues[param.parameter_name] || ""}
              onChange={handleCommonParamChange}
              placeholder={param.description || ""}
            />
          </div>
        ))}

        {parameterTemplates.length > 0 && (
          <div className="form-section">
            <h4>Method Parameters</h4>
            {parameterTemplates.map((param) => (
              <div key={param.id} className="param-row">
                <label>{param.parameter_name}</label>
                <input
                  type="text"
                  name={param.parameter_name}
                  value={brewParameters[param.parameter_name] || ""}
                  onChange={handleParameterChange}
                  placeholder={param.description}
                />
              </div>
            ))}
          </div>
        )}

        <div className="form-section">
          <h4>Brew Record Parameters</h4>
          {customParameters.map((param, idx) => (
            <div key={idx} className="param-row">
              <label>{param.name}</label>
              <input
                type="text"
                value={param.value}
                onChange={(e) => handleCustomParamValueChange(idx, e.target.value)}
              />
              <button type="button" className="btn-remove" onClick={() => handleRemoveCustomParam(idx)}>✕</button>
            </div>
          ))}
          <div className="custom-param-inputs">
            <input type="text" name="name" value={newCustomParam.name} onChange={handleCustomParamChange} placeholder="Parameter name" />
            <input type="text" name="value" value={newCustomParam.value} onChange={handleCustomParamChange} placeholder="Value" />
            <button type="button" className="btn-secondary" onClick={handleAddCustomParam}>Add</button>
          </div>
        </div>

        <div className="form-group">
          <label>Tasting Notes</label>
          <textarea name="tasting_notes" value={brewData.tasting_notes} onChange={handleChange} rows={3} />
        </div>

        <div className="form-submit">
          <button type="submit">{isEditing ? "💾 Save Changes" : "☕ Add Brew"}</button>
        </div>
      </form>
      {message && (
        <div className={`status-message ${message.includes("success") ? "success" : "error"}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default AddBrew;
