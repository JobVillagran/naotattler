// src/components/App.js
import React, { useState, useEffect } from 'react';

const App = () => {
  // Estado para almacenar los menús obtenidos del servidor
  const [menuItems, setMenuItems] = useState([]);

  // Función para obtener los menús del servidor
  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/menu'); // La ruta que configuraste en el backend
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.log('Error al obtener los menús', error);
    }
  };

  // Llama a fetchMenuItems al cargar el componente
  useEffect(() => {
    fetchMenuItems();
  }, []);

  return (
    <div>
      <h1>Menú del Restaurante Nao</h1>
      <ul>
        {menuItems.map((item) => (
          <li key={item._id}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;