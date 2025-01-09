import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';

function App() {
  const [coffeeBeans, setCoffeeBeans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch coffee beans from the Flask backend
    fetch("http://localhost:5000/coffee-beans/")
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
        console.error('Error fetching coffee beans:', error);
        setLoading(false);
      });
  }, []);

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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;