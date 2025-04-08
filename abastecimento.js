// Carrega dados do localStorage
function loadData() {
  return JSON.parse(localStorage.getItem('db')) || { veiculos: [], abastecimentos: [] };
}

// Salva dados no localStorage
function saveData(db) {
  localStorage.setItem('db', JSON.stringify(db));
}

// Carrega veículos no dropdown
function carregarVeiculosAbastecimento() {
  const db = loadData();
  const select = document.getElementById('placa-abastecimento');
  const filtroSelect = document.getElementById('filtro-placa');

  select.innerHTML = db.veiculos.map(v =>
    `<option value="${v.placa}">${v.placa} - ${v.modelo}</option>`
  ).join('');

  filtroSelect.innerHTML = '<option value="">Todas</option>' +
    db.veiculos.map(v =>
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

// Lista abastecimentos com filtro
function listarAbastecimentos(filtro = {}) {
  const db = loadData();
  const lista = document.getElementById('lista-abastecimentos');
  let abastecimentos = db.abastecimentos;

  if (filtro.placa) {
    abastecimentos = abastecimentos.filter(a => a.placa === filtro.placa);
  }
  if (filtro.data) {
    abastecimentos = abastecimentos.filter(a => a.data === filtro.data);
  }

  lista.innerHTML = abastecimentos.map((a, index) => `
    <li>
      <strong>${a.placa}</strong> - ${a.data}<br>
      ${a.litros}L de ${a.tipo} (R$ ${a.valor.toFixed(2)})<br>
      KM: ${a.kmAtual} | Preço/L: R$ ${a.precoPorLitro}
      <button onclick="excluirAbastecimento(${index})" class="btn-excluir">Excluir</button>
    </li>
  `).join('');
}

// Aplica filtro de histórico
function aplicarFiltro() {
  const placa = document.getElementById('filtro-placa').value;
  const data = document.getElementById('filtro-data').value;
  listarAbastecimentos({ placa, data });
}

// Gera PDF do histórico filtrado
async function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const db = loadData();
  const placa = document.getElementById('filtro-placa').value;
  const data = document.getElementById('filtro-data').value;

  let abastecimentos = db.abastecimentos;

  if (placa) abastecimentos = abastecimentos.filter(a => a.placa === placa);
  if (data) abastecimentos = abastecimentos.filter(a => a.data === data);

  const doc = new jsPDF();
  doc.setFontSize(12);
  doc.text('Histórico de Abastecimento', 14, 15);

  let y = 25;
  abastecimentos.forEach((a, i) => {
    doc.text(`${i + 1}. ${a.placa} - ${a.data}`, 14, y);
    y += 6;
    doc.text(`   ${a.litros}L de ${a.tipo} | R$ ${a.valor.toFixed(2)} | KM: ${a.kmAtual}`, 14, y);
    y += 10;
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save('historico_abastecimento.pdf');
}

// Exclui abastecimento
function excluirAbastecimento(index) {
  if (confirm('Tem certeza que deseja excluir este abastecimento?')) {
    const db = loadData();
    db.abastecimentos.splice(index, 1);
    saveData(db);
    listarAbastecimentos();
  }
}

// Inicializa a página
document.addEventListener('DOMContentLoaded', () => {
  carregarVeiculosAbastecimento();
  listarAbastecimentos();
});
