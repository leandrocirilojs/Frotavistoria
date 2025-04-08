
// Carrega veículos no dropdown principal
function carregarVeiculosAbastecimento() {
  const db = loadData();
  const select = document.getElementById('placa-abastecimento');
  select.innerHTML = db.veiculos.map(v => 
    `<option value="${v.placa}">${v.placa} - ${v.modelo}</option>`
  ).join('');
}

// Carrega placas no filtro
function carregarFiltroPlacas() {
  const db = loadData();
  const select = document.getElementById('filtro-placa');
  select.innerHTML = '<option value="">Todas</option>' + db.veiculos.map(v => 
    `<option value="${v.placa}">${v.placa}</option>`
  ).join('');
}

// Registra abastecimento
function registrarAbastecimento() {
  const db = loadData();
  const placa = document.getElementById('placa-abastecimento').value;
  const data = document.getElementById('data-abastecimento').value;
  const litros = parseFloat(document.getElementById('litros').value);
  const valor = parseFloat(document.getElementById('valor').value);
  const kmAtual = parseInt(document.getElementById('km-atual').value);
  const tipo = document.getElementById('tipo-combustivel').value;

  const veiculo = db.veiculos.find(v => v.placa === placa);
  if (veiculo) veiculo.kmAtual = kmAtual;

  db.abastecimentos.push({
    placa,
    data,
    litros,
    valor,
    kmAtual,
    tipo,
    precoPorLitro: (valor / litros).toFixed(2)
  });

  saveData(db);
  alert('Abastecimento registrado!');
  listarAbastecimentos();
}

// Lista todos os abastecimentos
function listarAbastecimentos() {
  const db = loadData();
  const lista = document.getElementById('lista-abastecimentos');

  lista.innerHTML = db.abastecimentos.map((a, index) => `
    <li>
      <strong>${a.placa}</strong> - ${a.data}<br>
      ${a.litros}L de ${a.tipo} (R$ ${a.valor.toFixed(2)})<br>
      KM: ${a.kmAtual} | Preço/L: R$ ${a.precoPorLitro}
      <button onclick="excluirAbastecimento(${index})" class="btn-excluir">Excluir</button>
    </li>
  `).join('');
}

// Filtrar abastecimentos por placa e datas
function filtrarAbastecimentos() {
  const db = loadData();
  const placaFiltro = document.getElementById('filtro-placa').value;
  const dataInicio = document.getElementById('data-inicio').value;
  const dataFim = document.getElementById('data-fim').value;
  const lista = document.getElementById('lista-abastecimentos');

  const filtrados = db.abastecimentos.filter(a => {
    const data = new Date(a.data);
    const inicio = dataInicio ? new Date(dataInicio) : null;
    const fim = dataFim ? new Date(dataFim) : null;

    return (!placaFiltro || a.placa === placaFiltro) &&
           (!inicio || data >= inicio) &&
           (!fim || data <= fim);
  });

  lista.innerHTML = filtrados.map((a, index) => `
    <li>
      <strong>${a.placa}</strong> - ${a.data}<br>
      ${a.litros}L de ${a.tipo} (R$ ${a.valor.toFixed(2)})<br>
      KM: ${a.kmAtual} | Preço/L: R$ ${a.precoPorLitro}
      <button onclick="excluirAbastecimento(${index})" class="btn-excluir">Excluir</button>
    </li>
  `).join('');
}

// Excluir abastecimento
function excluirAbastecimento(index) {
  if (confirm('Tem certeza que deseja excluir este abastecimento?')) {
    const db = loadData();
    db.abastecimentos.splice(index, 1);
    saveData(db);
    listarAbastecimentos();
  }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  carregarVeiculosAbastecimento();
  carregarFiltroPlacas();
  listarAbastecimentos();
});
