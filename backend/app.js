const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:3001',
}));

const dbURI = 'mongodb+srv://nao_mongo_job:Seguridad123@naocluster.ss9flq6.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión a MongoDB Atlas exitosa');
  })
  .catch((err) => {
    console.log('Error en la conexión a MongoDB Atlas', err);
  });

const menuSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: Number,
  category: { type: String, enum: ['Fast Food', 'Breakfast', 'Saludable', 'Americana'] },
});

const MenuItem = mongoose.model('MenuItem', menuSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/menu', (req, res) => {
  const { category, name } = req.query;

  const filter = {};

  if (category && category !== 'Todas las categorías') {
    filter.category = category;
  }

  MenuItem.find(filter)
    .then((menuItems) => {
      if (name && name.length >= 5) {
        // Filtrar por nombre si se proporciona un nombre con al menos 5 caracteres
        const nameFilter = menuItems.filter(item => item.name.toLowerCase().includes(name.toLowerCase()));
        res.json(nameFilter);
      } else {
        res.json(menuItems);
      }
    })
    .catch((err) => {
      console.log('Error al obtener los menús', err);
      res.status(500).send('Error en el servidor');
    });
});

app.post('/menu', (req, res) => {
  const { id, name, price, category } = req.body;

  if (!id || !name || !price || !category) {
    return res.status(400).json({ error: 'Debes proporcionar un ID, un nombre, un precio y una categoría para el platillo.' });
  }

  const newMenuItem = new MenuItem({
    id,
    name,
    price,
    category,
  });

  newMenuItem.save()
    .then((menuItem) => {
      console.log('Platillo agregado:', menuItem);
      res.status(201).json(menuItem);
    })
    .catch((err) => {
      console.log('Error al guardar el platillo:', err);
      res.status(500).json({ error: 'Error en el servidor al guardar el platillo.' });
    });
});

app.put('/menu/:id', (req, res) => {
  const { id, name, price, category } = req.body;

  if (!id || !name || !price || !category) {
    return res.status(400).json({ error: 'Debes proporcionar un ID, un nombre, un precio y una categoría para el platillo.' });
  }

  MenuItem.findByIdAndUpdate(req.params.id, { id, name, price, category }, { new: true })
    .then((menuItem) => {
      console.log('Platillo editado:', menuItem);
      res.json(menuItem);
    })
    .catch((err) => {
      console.log('Error al editar el platillo:', err);
      res.status(500).json({ error: 'Error en el servidor al editar el platillo.' });
    });
});

app.delete('/menu/:id', (req, res) => {
  MenuItem.findByIdAndDelete(req.params.id)
    .then((menuItem) => {
      console.log('Platillo borrado:', menuItem);
      res.json(menuItem);
    })
    .catch((err) => {
      console.log('Error al borrar el platillo:', err);
      res.status(500).json({ error: 'Error en el servidor al borrar el platillo.' });
    });
});

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; font-src 'self' data:");
  next();
});

app.use(express.static(path.join(__dirname, '../build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor Express.js iniciado en http://localhost:${port}`);
});
