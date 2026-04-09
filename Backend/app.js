const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/projetooficial', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Conectado ao MongoDB');
});

app.use(express.json());

// Definição do esquema e modelo com base na estrutura do seu dataset
const datasetSchema = new mongoose.Schema({
  numeroAmostra: Number,
  data: Date,
  numeroTanque: Number,
  TA: Number,   // Total Acidity (Acidez Total)
  AV: Number,   // Total Available Volume
  AT: Number,   // Total Temperature (Temperatura Total)
  pH: Number,   // pH
  MV: Number,   // Total Methanol Volume
  AR: Number    // Total Aromatic Compound
});

const Dataset = mongoose.model('Dataset', datasetSchema);

// Rota para obter os dados
app.get('/dados', async (req, res) => {
  try {
    const dados = await Dataset.find();
    res.json(dados);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
