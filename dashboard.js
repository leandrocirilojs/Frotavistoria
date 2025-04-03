// Função principal que atualiza todo o dashboard
async function updateDashboard() {
  const db = loadDB();
  
  // 1. Atualiza cards de resumo
  updateSummaryCards(db);
  
  // 2. Atualiza gráficos
  updateCharts(db);
  
  // 3. Atualiza alertas
  updateAlerts(db);
}

// 1. Cards de Resumo
function updateSummaryCards(db) {
  // Veículos ativos
  document.getElementById('total-veiculos').textContent = db.veiculos.length;
  
  // Manutenções pendentes
  const manutencoesPendentes = db.manutencoes.filter(m => !m.realizada).length;
  document.getElementById('prox-manutencao').textContent = manutencoesPendentes;
  
  // Consumo médio da frota
  const consumo = calcularConsumoMedioFrota(db);
  document.getElementById('consumo-medio-frota').textContent = consumo.toFixed(2);
  
  // Custo mensal (exemplo: soma dos últimos 30 dias)
  const custo = calcularCustoMensal(db);
  document.getElementById('custo-mensal').textContent = custo.toFixed(2);
}

// 2. Gráficos
function updateCharts(db) {
  // Gráfico de tipos de manutenção
  const ctx1 = document.getElementById('chart-manutencoes').getContext('2d');
  new Chart(ctx1, {
    type: 'pie',
    data: {
      labels: ['Óleo', 'Freios', 'Pneus', 'Outros'],
      datasets: [{
        data: [
          db.manutencoes.filter(m => m.tipo === 'oleo').length,
          db.manutencoes.filter(m => m.tipo === 'freio').length,
          db.manutencoes.filter(m => m.tipo === 'pneu').length,
          db.manutencoes.filter(m => !['oleo','freio','pneu'].includes(m.tipo)).length
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Distribuição de Manutenções'
        }
      }
    }
  });

  // Gráfico de consumo por veículo (top 5)
  const ctx2 = document.getElementById('chart-consumo').getContext('2d');
  new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: db.veiculos.slice(0, 5).map(v => v.placa),
      datasets: [{
        label: 'Consumo (KM/L)',
        data: db.veiculos.slice(0, 5).map(v => 
          calcularConsumoVeiculo(db, v.id)),
        backgroundColor: '#3498db'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Top 5 - Melhor Consumo'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// 3. Alertas
function updateAlerts(db) {
  const alertas = [];
  
  // Alertas de troca de óleo
  db.veiculos.forEach(v => {
    if (v.kmAtual >= v.kmProximaTrocaOleo * 0.9) {
      alertas.push(`⚠️ Troca de óleo: ${v.placa} (${v.kmAtual} KM)`);
    }
  });
  
  // Alertas de manutenção atrasada
  const hoje = new Date();
  db.manutencoes.forEach(m => {
    if (!m.realizada && new Date(m.data) < hoje) {
      const veiculo = db.veiculos.find(v => v.id === m.veiculoId);
      alertas.push(`🔧 ${m.tipo} atrasada: ${veiculo?.placa || 'N/A'}`);
    }
  });
  
  // Exibe no HTML
  const lista = document.getElementById('lista-alertas');
  lista.innerHTML = alertas.map(a => `<li>${a}</li>`).join('') || 
    '<li>Nenhum alerta crítico</li>';
}

// Funções auxiliares
function calcularConsumoMedioFrota(db) {
  if (db.abastecimentos.length < 2) return 0;
  
  const kmTotal = Math.max(...db.abastecimentos.map(a => a.kmAtual)) - 
                 Math.min(...db.abastecimentos.map(a => a.kmAtual));
  const litrosTotal = db.abastecimentos.reduce((sum, a) => sum + a.litros, 0);
  
  return kmTotal / litrosTotal;
}

function calcularCustoMensal(db) {
  const umMesAtras = new Date();
  umMesAtras.setMonth(umMesAtras.getMonth() - 1);
  
  return db.abastecimentos
    .filter(a => new Date(a.data) > umMesAtras)
    .reduce((sum, a) => sum + a.valor, 0);
}

function calcularConsumoVeiculo(db, veiculoId) {
  const abastecimentos = db.abastecimentos
    .filter(a => a.veiculoId === veiculoId)
    .sort((a, b) => new Date(a.data) - new Date(b.data));
  
  if (abastecimentos.length < 2) return 0;
  
  const kmTotal = abastecimentos[abastecimentos.length - 1].kmAtual - 
                 abastecimentos[0].kmAtual;
  const litrosTotal = abastecimentos.slice(1).reduce((sum, a) => sum + a.litros, 0);
  
  return litrosTotal > 0 ? kmTotal / litrosTotal : 0;
}

// Inicialização
document.addEventListener('DOMContentLoaded', updateDashboard);
