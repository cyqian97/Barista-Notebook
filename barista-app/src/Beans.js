import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { COFFEE_BEAN_URL } from "./config";
import './Beans.css';
import ReturnHomeButton from "./ReturnHomeButton";

function Beans() {
  const navigate = useNavigate();
  const [coffeeBeans, setCoffeeBeans] = useState([]);
  const [filteredBeans, setFilteredBeans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBean, setNewBean] = useState({
    name: "", country: "", process: "", roast: "", region: "",
    farm: "", variety: "", drying: "", roaster: "",
    harvest_year: "", harvest_month: "", note: "",
  });
  const [filters, setFilters] = useState({
    country: "", process: "", roast: "", region: "",
    farm: "", variety: "", drying: "", roaster: "",
    harvest_year: "", harvest_month: "",
  });

  useEffect(() => {
    fetch(COFFEE_BEAN_URL)
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then((data) => { setCoffeeBeans(data); setFilteredBeans(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setFilteredBeans(
      coffeeBeans.filter((bean) =>
        Object.keys(filters).every((key) =>
          filters[key] ? bean[key]?.toString().includes(filters[key]) : true
        )
      )
    );
  }, [coffeeBeans, filters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBean({ ...newBean, [name]: value });
  };

  const handleAddBean = () => {
    fetch(COFFEE_BEAN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBean),
    })
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then((data) => {
        setCoffeeBeans([...coffeeBeans, data]);
        setNewBean({
          name: "", country: "", process: "", roast: "", region: "",
          farm: "", variety: "", drying: "", roaster: "",
          harvest_year: "", harvest_month: "", note: "",
        });
      })
      .catch((err) => console.error("Error adding coffee bean:", err));
  };

  const handleDeleteBean = (id) => {
    fetch(`${COFFEE_BEAN_URL}${id}`, { method: "DELETE" })
      .then((res) => { if (!res.ok) throw new Error(); })
      .then(() => {
        const updated = coffeeBeans.filter((bean) => bean.id !== id);
        setCoffeeBeans(updated);
        const filtered = updated.filter((bean) =>
          Object.keys(filters).every((key) =>
            filters[key] ? bean[key]?.toString().includes(filters[key]) : true
          )
        );
        if (filtered.length === 0) {
          setFilters({ country: "", process: "", roast: "", region: "", farm: "", variety: "", drying: "", roaster: "", harvest_year: "", harvest_month: "" });
        }
      })
      .catch((err) => console.error("Error deleting coffee bean:", err));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const getUniqueValues = (field) => [
    ...new Set(coffeeBeans.map((bean) => bean[field]).filter(Boolean)),
  ];

  if (loading) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <h1>🫘 Coffee Beans</h1>
      <ReturnHomeButton />

      {/* Filters */}
      <div className="beans-filters card">
        <h2>🔍 Filters</h2>
        <div className="filters-grid">
          {Object.keys(filters).map((field) => (
            <div key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ")}</label>
              <select name={field} value={filters[field]} onChange={handleFilterChange}>
                <option value="">All</option>
                {getUniqueValues(field).map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Country</th>
              <th>Process</th>
              <th>Roast</th>
              <th>Region</th>
              <th>Farm</th>
              <th>Variety</th>
              <th>Drying</th>
              <th>Roaster</th>
              <th>Year</th>
              <th>Month</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBeans.map((bean) => (
              <tr key={bean.id}>
                <td>{bean.id}</td>
                <td>{bean.name}</td>
                <td>{bean.country}</td>
                <td>{bean.process}</td>
                <td>{bean.roast}</td>
                <td className="limited-width">{bean.region}</td>
                <td className="limited-width">{bean.farm}</td>
                <td>{bean.variety}</td>
                <td>{bean.drying}</td>
                <td className="limited-width">{bean.roaster}</td>
                <td>{bean.harvest_year}</td>
                <td>{bean.harvest_month}</td>
                <td className="limited-width" title={bean.note}>{bean.note}</td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn-brew" onClick={() => navigate(`/addbrew?bean_id=${bean.id}`)}>☕ Brew</button>
                    <button className="action-btn-show" onClick={() => navigate(`/brews?bean_id=${bean.id}`)}>📖 Show</button>
                    <button className="btn-danger" onClick={() => handleDeleteBean(bean.id)}>🗑 Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add bean form */}
      <div className="add-bean-form">
        <h2>➕ Add Coffee Bean</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleAddBean(); }}>
          <div className="fields-grid">
            {[
              { name: "name", placeholder: "Name", type: "text" },
              { name: "country", placeholder: "Country", type: "text" },
              { name: "process", placeholder: "Process", type: "text" },
              { name: "roast", placeholder: "Roast", type: "text" },
              { name: "region", placeholder: "Region", type: "text" },
              { name: "farm", placeholder: "Farm", type: "text" },
              { name: "variety", placeholder: "Variety", type: "text" },
              { name: "drying", placeholder: "Drying", type: "text" },
              { name: "roaster", placeholder: "Roaster", type: "text" },
              { name: "harvest_year", placeholder: "Harvest Year", type: "number" },
              { name: "harvest_month", placeholder: "Harvest Month", type: "number" },
              { name: "note", placeholder: "Note", type: "text" },
            ].map(({ name, placeholder, type }) => (
              <input
                key={name}
                type={type}
                name={name}
                placeholder={placeholder}
                value={newBean[name]}
                onChange={handleInputChange}
              />
            ))}
          </div>
          <button type="submit" className="btn-primary">Add Coffee Bean</button>
        </form>
      </div>
    </div>
  );
}

export default Beans;
