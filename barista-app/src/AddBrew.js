import React, { useEffect, useState } from "react";
import { COFFEE_BEAN_URL, BREW_URL, BASE_URL } from "./config";


function AddBrew() {
  const [coffeeBeans, setCoffeeBeans] = useState([]);
  const [grinders, setGrinders] = useState([]);
  const [methods, setMethods] = useState([]);
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
    // Fetch coffee beans
    fetch(COFFEE_BEAN_URL)
      .then((res) => res.json())
      .then(setCoffeeBeans);

    // Fetch grinders
    fetch(BASE_URL + "grinders/")
      .then((res) => res.json())
      .then(setGrinders);

    // Fetch brewing methods
    fetch(BASE_URL + "brewing-methods/")
      .then((res) => res.json())
      .then(setMethods);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrewData({ ...brewData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(BREW_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(brewData),
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
      })
      .catch(() => setMessage("Error adding brew"));
  };

  return (
    <div>
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