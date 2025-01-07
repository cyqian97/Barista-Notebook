import React, { useEffect, useState } from "react";

function App() {
  const [coffeeBeans, setCoffeeBeans] = useState([]);

  useEffect(() => {
    // Fetch coffee beans from the Flask backend
    fetch("http://localhost:5000/beans/")
      .then((response) => response.json())
      .then((data) => {
        // Update state with the fetched coffee beans
        setCoffeeBeans(data.beans);
      })
      .catch((error) => console.error("Error fetching coffee beans:", error));
  }, []);

  return (
    <div>
      <h1>Coffee Beans</h1>
      <ul>
        {coffeeBeans.map((bean) => (
          <li key={bean.id}>{bean.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;