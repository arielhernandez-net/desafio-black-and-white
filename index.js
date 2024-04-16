const express = require('express');
const Jimp = require('jimp');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/resultado', async (req, res) => {
  const { imageUrl } = req.body;

  try {
    const image = await Jimp.read(imageUrl);
    image.grayscale().resize(350, Jimp.AUTO);
    const uniqueId = uuidv4();
    const imageName = `${uniqueId.slice(0, 8)}.jpg`;
    await image.writeAsync(__dirname + `/public/images/${imageName}`);
    res.sendFile(__dirname + `/public/images/${imageName}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al procesar la imagen');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`, process.pid);
});
