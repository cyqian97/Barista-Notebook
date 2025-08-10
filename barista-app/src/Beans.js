import React, { useEffect, useState } from "react";
import BASE_URL from "./config";
import './Beans.css';

function Beans() {
  const [coffeeBeans, setCoffeeBeans] = useState([]);
  const [filteredBeans, setFilteredBeans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBean, setNewBean] = useState({
    name: "",
    country: "",
    process: "",
    roast: "",
    region: "",
    farm: "",
    variety: "",
    drying: "",
    roaster: "",
    harvest_year: "",
    harvest_month: "",
    note: "",
  });
  const [filters, setFilters] = useState({
    country: "",
    process: "",
    roast: "",
    region: "",
    farm: "",
    variety: "",
    drying: "",
    roaster: "",
    harvest_year: "",
    harvest_month: "",
  });

  useEffect(() => {
    // Fetch coffee beans from the Flask backend
    fetch(BASE_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setCoffeeBeans(data);
        setFilteredBeans(data); // Initialize filtered beans
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching coffee beans:", error);
        setLoading(false);
      });
  }, []);

  // Synchronize filteredBeans with coffeeBeans and filters
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
    fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBean),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setCoffeeBeans([...coffeeBeans, data]); // Update coffeeBeans
        setNewBean({
          name: "",
          country: "",
          process: "",
          roast: "",
          region: "",
          farm: "",
          variety: "",
          drying: "",
          roaster: "",
          harvest_year: "",
          harvest_month: "",
          note: "",
        });
      })
      .catch((error) => {
        console.error("Error adding coffee bean:", error);
      });
  };

  const handleDeleteBean = (id) => {
    fetch(`${BASE_URL}${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const updatedCoffeeBeans = coffeeBeans.filter((bean) => bean.id !== id);
        setCoffeeBeans(updatedCoffeeBeans);

        // Reset filters if no coffee beans match the current filter
        const updatedFilteredBeans = updatedCoffeeBeans.filter((bean) =>
          Object.keys(filters).every((key) =>
            filters[key] ? bean[key]?.toString().includes(filters[key]) : true
          )
        );
        if (updatedFilteredBeans.length === 0) {
          setFilters({
            country: "",
            process: "",
            roast: "",
            region: "",
            farm: "",
            variety: "",
            drying: "",
            roaster: "",
            harvest_year: "",
            harvest_month: "",
          });
        }
      })
      .catch((error) => {
        console.error("Error deleting coffee bean:", error);
      });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Get unique values for dropdowns
  const getUniqueValues = (field) => [
    ...new Set(coffeeBeans.map((bean) => bean[field]).filter(Boolean)),
  ];

  return (
    <div>
      <h1>Coffee Bean Table</h1>
      {/* Filters */}
      <div>
        <h2>Filters</h2>
        {Object.keys(filters).map((field) => (
          <div key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}: </label>
            <select
              name={field}
              value={filters[field]}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              {getUniqueValues(field).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Coffee Bean Table */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Country</th>
            <th>Process</th>
            <th>Roast</th>
            <th className="limited-width">Region</th>
            <th className="limited-width">Farm</th>
            <th>Variety</th>
            <th>Drying</th>
            <th className="limited-width">Roaster</th>
            <th>Harvest Year</th>
            <th>Harvest Month</th>
            <th className="limited-width">Note</th>
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
                <button onClick={() => handleDeleteBean(bean.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Add Coffee Bean</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddBean();
        }}
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newBean.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={newBean.country}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="process"
          placeholder="Process"
          value={newBean.process}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="roast"
          placeholder="Roast"
          value={newBean.roast}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="region"
          placeholder="Region"
          value={newBean.region}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="farm"
          placeholder="Farm"
          value={newBean.farm}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="variety"
          placeholder="Variety"
          value={newBean.variety}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="drying"
          placeholder="Drying"
          value={newBean.drying}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="roaster"
          placeholder="Roaster"
          value={newBean.roaster}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="harvest_year"
          placeholder="Harvest Year"
          value={newBean.harvest_year}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="harvest_month"
          placeholder="Harvest Month"
          value={newBean.harvest_month}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="note"
          placeholder="Note"
          value={newBean.note}
          onChange={handleInputChange}
        />
        <button type="submit">Add Coffee Bean</button>
      </form>
    </div>
  );
}

export default Beans;