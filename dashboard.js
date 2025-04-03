function updateDashboard() {
  const db = loadDB();
  
  // 1. Atualiza cards principais
  document.getElementById('total-veiculos').textContent = db.veiculos.length;
  
  // 2. Calcula alertas
  const alertas = calcularAlertas(db);
  document.getElementById('total-alertas').textContent = alertas.length;
  
  // 3. Calcula consumo médio
  const consumo = calcularConsumoMedio(db);
  document.getElementById('consumo-medio').textContent = `${consumo.toFixed(1)} KM/L`;
  
  // 4. Exibe alertas
  renderAlertas(alertas);
  
  // 5. Exibe últimos registros
  renderUltimosRegistros(db);
}

function calcularAlertas(db) {
  const alertas = [];
  const hoje = new Date();
  
  // Alertas de troca de óleo (90% da quilometragem)
  db.veiculos.forEach(veiculo => {
    if (veiculo.kmAtual >= veiculo.kmProximaTrocaOleo * 0.9) {
      alertas.push({
        tipo: 'oleo',
        mensagem: `Troca de óleo necessária: ${veiculo.placa}`,
        prioridade: 'alta'
      });
    }
  });
  
  // Alertas de manutenção atrasada
  db.manutencoes.forEach(manutencao => {
    if (!manutencao.realizada && new Date(manutencao.data) < hoje) {
      const veiculo = db.veiculos.find(v => v.id === manutencao.veiculoId);
      alertas.push({
        tipo: 'manutencao',
        mensagem: `Manutenção atrasada: ${veiculo?.placa || 'N/A'} - ${manutencao.tipo}`,
        prioridade: 'media'
      });
    }
  });
  
  return alertas;
}

function calcularConsumoMedio(db) {
  if (db.abastecimentos.length < 2) return 0;
  
  // Ordena por data
  const abastecimentos = [...db.abastecimentos].sort((a, b) => 
    new Date(a.data) - new Date(b.data));
  
  // Calcula KM total e litros totais
  const kmTotal = abastecimentos[abastecimentos.length - 1].kmAtual - abastecimentos[0].kmAtual;
  const litrosTotal = abastecimentos.slice(1).reduce((total, a) => total + a.litros, 0);
  
  return litrosTotal > 0 ? kmTotal / litrosTotal : 0;
}

function renderAlertas(alertas) {
  const lista = document.getElementById('lista-alertas');
  
  if (alertas.length === 0) {
    lista.innerHTML = '<li>Nenhum alerta no momento</li>';
    return;
  }
  
  lista.innerHTML = alertas.map(alerta => `
    <li class="${alerta.prioridade}">
      ${alerta.tipo === 'oleo' ? '🛢️' : '🔧'} ${alerta.mensagem}
    </li>
  `).join('');
}

function renderUltimosRegistros(db) {
  const container = document.getElementById('ultimas-acoes');
  
  // Combina e ordena os últimos registros
  const registros = [
    ...db.veiculos.map(v => ({ tipo: 'veiculo', data: v.createdAt, texto: `Veículo ${v.placa} cadastrado` })),
    ...db.manutencoes.map(m => ({ tipo: 'manutencao', data: m.data, texto: `Manutenção ${m.tipo} agendada` })),
    ...db.abastecimentos.map(a => ({ tipo: 'abastecimento', data: a.data, texto: `Abastecido ${a.litros}L` }))
  ].sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 5);
  
  container.innerHTML = registros.map(reg => `
    <div class="registro">
      <span class="data">${formatarData(reg.data)}</span>
      <span class="texto">${reg.texto}</span>
    </div>
  `).join('');
}

function formatarData(dataString) {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dataString).toLocaleDateString('pt-BR', options);
}

// Inicializa ao carregar
document.addEventListener('DOMContentLoaded', updateDashboard);
