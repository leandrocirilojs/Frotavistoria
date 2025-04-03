// Preenche dropdown com veículos
function carregarVeiculos() {
  const db = loadData();
  const select = document.getElementById('placa-manutencao');
  select.innerHTML = db.veiculos.map(v => 
    `<option value="${v.placa}">${v.placa} - ${v.modelo}</option>`
  ).join('');
}

// Agenda manutenção
function agendarManutencao() {
  const placa = document.getElementById('placa-manutencao').value;
  const tipo = document.getElementById('tipo').value;
  const data = document.getElementById('data').value;

  const db = loadData();
  db.manutencoes.push({ placa, tipo, data, realizada: false });
  
  // Atualiza KM da última troca de óleo se for o caso
  if (tipo === 'oleo') {
    const veiculo = db.veiculos.find(v => v.placa === placa);
    veiculo.ultimaTrocaOleo = data;
    veiculo.kmProximaTrocaOleo = veiculo.kmAtual + 10000; // Exemplo: próxima troca em 10.000 KM
  }

  saveData(db);
  alert('Manutenção agendada!');
  listarManutencoes();
  
atualizarDashboardManutencoes();
}

// Lista histórico
function listarManutencoes() {
  const db = loadData();
  const lista = document.getElementById('lista-manutencoes');
  lista.innerHTML = db.manutencoes.map(m => `
    <li>
      ${m.placa} - ${m.tipo} (${m.data}) 
      <button onclick="marcarRealizada('${m.placa}', '${m.data}')">✅</button>
    </li>
  `).join('');
}

// Marcar como realizada
function marcarRealizada(placa, data) {
  const db = loadData();
  const manutencao = db.manutencoes.find(m => m.placa === placa && m.data === data);
  manutencao.realizada = true;
  saveData(db);
  listarManutencoes();
  atualizarDashboardManutencoes();
}

document.addEventListener('DOMContentLoaded', () => {
  carregarVeiculos();
  listarManutencoes();
});
