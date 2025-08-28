import React, { useEffect, useState } from "react";
import { COFFEE_BEAN_URL, BREW_URL, BASE_URL, BREWING_METHOD_URL } from "./config";
import ReturnHomeButton from "./ReturnHomeButton";

function AddBrew() {
  const [coffeeBeans, setCoffeeBeans] = useState([]);
  const [grinders, setGrinders] = useState([]);
  const [methods, setMethods] = useState([]);
  const [parameterTemplates, setParameterTemplates] = useState([]);
  const [brewParameters, setBrewParameters] = useState({});
  const [customParameters, setCustomParameters] = useState([]);
  const [newCustomParam, setNewCustomParam] = useState({ name: "", value: "" });
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
    fetch(COFFEE_BEAN_URL).then((res) => res.json()).then(setCoffeeBeans);
    fetch(BASE_URL + "grinders/").then((res) => res.json()).then(setGrinders);
    fetch(BASE_URL + "brewing-methods/").then((res) => res.json()).then(setMethods);
  }, []);

  // Fetch parameter templates when method changes
  useEffect(() => {
    if (brewData.method_id) {
      fetch(`${BREWING_METHOD_URL}${brewData.method_id}/parameters/`)
        .then((res) => res.json())
        .then(setParameterTemplates);
    } else {
      setParameterTemplates([]);
    }
    setBrewParameters({});
    setCustomParameters([]);
  }, [brewData.method_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrewData({ ...brewData, [name]: value });
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
      setCustomParameters([
        ...customParameters,
        { name: newCustomParam.name, value: newCustomParam.value }
      ]);
      setNewCustomParam({ name: "", value: "" });
    }
  };

  const handleCustomParamValueChange = (index, value) => {
    const updated = [...customParameters];
    updated[index].value = value;
    setCustomParameters(updated);
  };

  const handleRemoveParam = (paramName) => {
    // Remove from template parameters
    const updatedBrewParameters = { ...brewParameters };
    delete updatedBrewParameters[paramName];
    setBrewParameters(updatedBrewParameters);

    // Remove from parameterTemplates
    setParameterTemplates(parameterTemplates.filter(param => param.parameter_name !== paramName));

    // Remove from custom parameters (if needed)
    setCustomParameters(customParameters.filter(param => param.name !== paramName));
  };

  const handleRemoveCustomParam = (index) => {
    setCustomParameters(customParameters.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Combine template and custom parameters
    const allParameters = { ...brewParameters };
    customParameters.forEach(param => {
      allParameters[param.name] = param.value;
    });
    const payload = { ...brewData, parameters: allParameters };
    fetch(BREW_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add brew");
        return res.json();
      })
      .then(() => {
        setMessage("Brew added successfully!");
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
      })
      .catch(() => setMessage("Error adding brew"));
  };

  return (
    <div>
      <ReturnHomeButton />
      <h2>Add Brew</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Coffee Bean:
          <select
            name="coffee_bean_id"
            value={brewData.coffee_bean_id}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            {coffeeBeans.map((bean) => (
              <option key={bean.id} value={bean.id}>
                {bean.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Grinder:
          <select
            name="grinder_id"
            value={brewData.grinder_id}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            {grinders.map((grinder) => (
              <option key={grinder.id} value={grinder.id}>
                {grinder.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Brewing Method:
          <select
            name="method_id"
            value={brewData.method_id}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            {methods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Grind Size:
          <input
            type="number"
            name="grind_size"
            value={brewData.grind_size}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Date Brewed:
          <input
            type="datetime-local"
            name="date_brewed"
            value={brewData.date_brewed}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        {/* Show parameter templates if available */}
        {parameterTemplates.length > 0 && (
          <div>
            <h4>Parameters for selected method:</h4>
            {parameterTemplates.map((param) => (
              <div key={param.id}>
                <label>
                  {param.parameter_name}:
                  <input
                    type="text"
                    name={param.parameter_name}
                    value={brewParameters[param.parameter_name] || ""}
                    onChange={handleParameterChange}
                    placeholder={param.description}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveParam(param.parameter_name)}
                    style={{ marginLeft: "8px" }}
                  >
                    Remove
                  </button>
                </label>
                <br />
              </div>
            ))}
          </div>
        )}
        {/* List custom parameters */}
        {customParameters.length > 0 && (
          <div>
            <h4>Custom Parameters:</h4>
            {customParameters.map((param, idx) => (
              <div key={idx}>
                <label>
                  {param.name}:
                  <input
                    type="text"
                    value={param.value}
                    onChange={e => handleCustomParamValueChange(idx, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomParam(idx)}
                    style={{ marginLeft: "8px" }}
                  >
                    Remove
                  </button>
                </label>
                <br />
              </div>
            ))}
          </div>
        )}
        {/* Custom parameters */}
        <div>
          <h4>Add Custom Parameter:</h4>
          <input
            type="text"
            name="name"
            value={newCustomParam.name}
            onChange={handleCustomParamChange}
            placeholder="Parameter Name"
          />
          <input
            type="text"
            name="value"
            value={newCustomParam.value}
            onChange={handleCustomParamChange}
            placeholder="Parameter Value"
          />
          <button type="button" onClick={handleAddCustomParam}>
            Add
          </button>
        </div>
        <br />
        <label>
          Tasting Notes:
          <textarea
            name="tasting_notes"
            value={brewData.tasting_notes}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Add Brew</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddBrew;