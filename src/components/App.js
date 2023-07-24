import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Componentes estilizados
const StyledApp = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
`;

const StyledHeader = styled.h1`
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  input,
  select {
    padding: 10px;
    margin-bottom: 10px;
  }

  button {
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;
  }
`;

const StyledMenuItem = styled.li`
  margin-bottom: 10px;

  button {
    margin-left: 10px;
    background-color: #dc3545;
  }
`;


const App = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formValues, setFormValues] = useState({
    id: '',
    name: '',
    price: '',
    category: '',
  });
  const [searchCategory, setSearchCategory] = useState('');
  const [searchName, setSearchName] = useState('');

  const fetchMenuItems = async () => {
    try {
      let url = 'http://localhost:3000/menu';
  
      const params = [];
      if (searchCategory) {
        params.push(`category=${encodeURIComponent(searchCategory)}`);
      }
      if (searchName && searchName.length >= 5) {
        params.push(`name=${encodeURIComponent(searchName)}`);
      }
  
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
  
      const response = await fetch(url);
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.log('Error al obtener los menús', error);
    }
  };
  

  useEffect(() => {
    fetchMenuItems();
  }, [searchCategory, searchName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValues.name || !formValues.price || !formValues.category) {
      alert('Por favor, ingrese el nombre, el precio y la categoría del platillo.');
      return;
    }

    try {
      let response;
      if (selectedItem) {
        response = await fetch(`http://localhost:3000/menu/${selectedItem._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formValues),
        });
      } else {
        response = await fetch('http://localhost:3000/menu', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formValues),
        });
      }
      const data = await response.json();
      setMenuItems([...menuItems, data]);
      setFormValues({ id: '', name: '', price: '', category: '' });
      setSelectedItem(null);
    } catch (error) {
      console.log('Error al agregar/editar el platillo', error);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await fetch(`http://localhost:3000/menu/${itemId}`, {
        method: 'DELETE',
      });
      setMenuItems(menuItems.filter((item) => item._id !== itemId));
    } catch (error) {
      console.log('Error al borrar el platillo', error);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormValues({ id: item.id, name: item.name, price: item.price, category: item.category });
  };

  return (
    <StyledApp>
      <StyledHeader>Tattler | Menú</StyledHeader>
      <StyledForm onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="ID del platillo"
          name="id"
          value={formValues.id}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Nombre del platillo"
          name="name"
          value={formValues.name}
          onChange={handleChange}
        />
        <input
          type="number"
          placeholder="Precio del platillo"
          name="price"
          value={formValues.price}
          onChange={handleChange}
        />
        <select name="category" value={formValues.category} onChange={handleChange}>
          <option value="">Seleccione una categoría</option>
          <option value="Fast Food">Fast Food</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Saludable">Saludable</option>
          <option value="Americana">Americana</option>
        </select>

        <button type="submit">{selectedItem ? 'Editar Platillo' : 'Agregar Platillo'}</button>
      </StyledForm>

      <h2>Filtrar por Categoría:</h2>
      <select
        name="searchCategory"
        value={searchCategory}
        onChange={(e) => setSearchCategory(e.target.value)}
      >
        <option value="">Todas las categorías</option>
        <option value="Fast Food">Fast Food</option>
        <option value="Breakfast">Breakfast</option>
        <option value="Saludable">Saludable</option>
        <option value="Americana">Americana</option>
      </select>

      <h2>Filtrar por Nombre de Platillo:</h2>
      <input
        type="text"
        placeholder="Buscar por nombre de platillo"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />

      <ul>
        {menuItems.map((item) => (
          <StyledMenuItem key={item._id}>
            {item.name} - ${item.price}
            <button onClick={() => handleEdit(item)}>Editar</button>
            <button onClick={() => handleDelete(item._id)}>Borrar</button>
          </StyledMenuItem>
        ))}
      </ul>
    </StyledApp>
  );
};

export default App;