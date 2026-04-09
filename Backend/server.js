const WebSocket = require('ws');
const mongoose = require('mongoose');

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/projetooficial')
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão:'));

// Definição do esquema e modelo para Fermentacao
const fermentacaoSchema = new mongoose.Schema({
  tempo: { type: Date, default: Date.now }, // Garante que o campo 'tempo' seja uma data
  temperatura: Number,
  // Adicione outros campos conforme necessário
});

const Fermentacao = mongoose.model('Fermentacao', fermentacaoSchema);

// Configuração do WebSocket
const wss = new WebSocket.Server({ port: 8765 });
console.log('Servidor WebSocket rodando na porta 8765');

wss.on('connection', (ws) => {
  console.log('Cliente WebSocket conectado');

  // Função para enviar dados de fermentação
  const sendFermentacaoData = () => {
    Fermentacao.find()
      .then(fermentacoes => {
        // Enviar os dados apenas se o WebSocket estiver ainda conectado
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(fermentacoes));
        }
      })
      .catch(err => {
        console.error('Erro ao buscar dados:', err);
      });
  };

  // Enviar os dados a cada 5 segundos
  const intervalId = setInterval(sendFermentacaoData, 5000);

  // Ao fechar a conexão, limpar o intervalo
  ws.on('close', () => {
    console.log('Cliente WebSocket desconectado');
    clearInterval(intervalId);
  });

  // Tratamento de erros no WebSocket
  ws.on('error', (error) => {
    console.error('Erro no WebSocket:', error);
  });
});
