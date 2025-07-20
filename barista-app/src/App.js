import React, { useEffect, useState } from "react";

const BASE_URL = "http://localhost:5000/coffee-beans/";

function App() {
  const [coffeeBeans, setCoffeeBeans] = useState([]);
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
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching coffee beans:", error);
        setLoading(false);
      });
  }, []);

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
        setCoffeeBeans([...coffeeBeans, data]);
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
        setCoffeeBeans(coffeeBeans.filter((bean) => bean.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting coffee bean:", error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Coffee Bean Table</h1>
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
            <th>Harvest Year</th>
            <th>Harvest Month</th>
            <th>Note</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coffeeBeans.map((bean) => (
            <tr key={bean.id}>
              <td>{bean.id}</td>
              <td>{bean.name}</td>
              <td>{bean.country}</td>
              <td>{bean.process}</td>
              <td>{bean.roast}</td>
              <td>{bean.region}</td>
              <td>{bean.farm}</td>
              <td>{bean.variety}</td>
              <td>{bean.drying}</td>
              <td>{bean.roaster}</td>
              <td>{bean.harvest_year}</td>
              <td>{bean.harvest_month}</td>
              <td>{bean.note}</td>
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

export default App;