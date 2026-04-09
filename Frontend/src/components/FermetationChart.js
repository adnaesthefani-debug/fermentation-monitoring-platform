// src/components/FermentationChart.js
import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const FermentationChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Conectar ao WebSocket na porta 8765
    const ws = new WebSocket('ws://localhost:8765');

    ws.onopen = () => {
      console.log('Conexão WebSocket estabelecida');
    };

    ws.onmessage = (event) => {
      try {
        const result = JSON.parse(event.data);
        console.log('Dados recebidos:', result); // Log dos dados recebidos
        setData(result);
      } catch (error) {
        console.error('Erro ao processar dados recebidos:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('Erro no WebSocket:', error);
    };

    return () => {
      ws.close();
      console.log('Conexão WebSocket fechada');
    };
  }, []);

  // Verifique se há dados antes de renderizar o gráfico
  const x = data.map(entry => new Date(entry.tempo).toLocaleTimeString()); // Ajuste para formatar o tempo
  const y = data.map(entry => entry.temperatura); // Ajuste conforme seu esquema

  return (
    <div>
      <h2>Gráfico de Fermentação</h2>
      <Plot
        data={[{
          x: x,
          y: y,
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: 'blue' },
          name: 'Nível de Fermentação',
        }]}
        layout={{
          width: 800,
          height: 400,
          title: 'Nível de Fermentação ao Longo do Tempo',
          xaxis: { title: 'Tempo' },
          yaxis: { title: 'Nível de Fermentação' },
        }}
      />
    </div>
  );
};

export default FermentationChart;

