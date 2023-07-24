const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Conectar a MongoDB Atlas
const dbURI = 'mongodb+srv://nao_mongo_job:Seguridad123@naocluster.ss9flq6.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión a MongoDB Atlas exitosa');
  })
  .catch((err) => {
    console.log('Error en la conexión a MongoDB Atlas', err);
  });

// Definir el esquema y el modelo de los menús
const menuSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

const MenuItem = mongoose.model('MenuItem', menuSchema);

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');

// Middleware para procesar los datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para obtener todos los menús (usando EJS)
app.get('/menu', (req, res) => {
  MenuItem.find().maxTimeMS(30000)
    .then((menuItems) => {
      res.render('index', { menuItems });
    })
    .catch((err) => {
      console.log('Error al obtener los menús', err);
      res.status(500).send('Error en el servidor');
    });
});

// Permitir fuentes de letra desde data: y desde el servidor local
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; font-src 'self' data:");
  next();
});

// Servir archivos estáticos de React desde la carpeta raíz del proyecto
app.use(express.static(path.join(__dirname, '../build')));

// Ruta principal para cargar la página de inicio de React
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor Express.js iniciado en http://localhost:${port}`);
});
