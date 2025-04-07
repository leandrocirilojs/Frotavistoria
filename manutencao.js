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
  const valor = parseFloat(document.getElementById('valor').value);

  const db = loadData();
  db.manutencoes.push({ 
    placa, 
    tipo, 
    data, 
    valor,  // Adiciona o valor aqui
    realizada: false,
    id: Date.now()
  });
  
  // Restante do código permanece igual...
  saveData(db);
  alert('Manutenção agendada!');
  listarManutencoes();
  atualizarDashboardManutencoes();
}

// Lista histórico com botão de excluir
function listarManutencoes() {
  const db = loadData();
  const lista = document.getElementById('lista-manutencoes');
  
  const manutencoesOrdenadas = [...db.manutencoes].sort((a, b) => 
    new Date(b.data) - new Date(a.data)
  );
  
  lista.innerHTML = manutencoesOrdenadas.map(m => `
    <li class="${m.realizada ? 'realizada' : 'pendente'}">
      ${m.placa} - ${m.tipo} (${formatarData(m.data)}) - R$ ${m.valor?.toFixed(2) || '0,00'}
      ${!m.realizada ? `<button onclick="marcarRealizada(${m.id})">✅ Realizar</button>` : ''}
      <button onclick="excluirManutencao(${m.id})" class="btn-excluir">🗑️ Excluir</button>
    </li>
  `).join('');
}

// Formata data para exibição (DD/MM/AAAA)
function formatarData(dataString) {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR');
}

// Marcar como realizada (agora usando ID)
function marcarRealizada(id) {
  if (confirm('Deseja marcar esta manutenção como realizada?')) {
    const db = loadData();
    const manutencao = db.manutencoes.find(m => m.id === id);
    if (manutencao) {
      manutencao.realizada = true;
      saveData(db);
      listarManutencoes();
      atualizarDashboardManutencoes();
    }
  }
}

// Excluir manutenção
function excluirManutencao(id) {
  if (confirm('Tem certeza que deseja excluir esta manutenção?')) {
    const db = loadData();
    const index = db.manutencoes.findIndex(m => m.id === id);
    if (index !== -1) {
      db.manutencoes.splice(index, 1);
      saveData(db);
      listarManutencoes();
      atualizarDashboardManutencoes();
    }
  }
}

// Adicione no HTML (antes do <ul id="lista-manutencoes">)


// Em manutencao.js


document.addEventListener('DOMContentLoaded', () => {
  carregarVeiculos();
  listarManutencoes();
});
