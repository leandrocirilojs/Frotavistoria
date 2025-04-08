// Carrega veículos no dropdown
function carregarVeiculosAbastecimento() {
  const db = loadData();
  const select = document.getElementById('placa-abastecimento');
  select.innerHTML = db.veiculos.map(v => 
    `<option value="${v.placa}">${v.placa} - ${v.modelo}</option>`
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

  // Atualiza KM do veículo
  const veiculo = db.veiculos.find(v => v.placa === placa);
  if (veiculo) veiculo.kmAtual = kmAtual;

  // Registra abastecimento
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

// Lista histórico de abastecimentos
// Lista histórico de abastecimentos com botão de excluir
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

// Função para excluir abastecimento
function excluirAbastecimento(index) {
  if (confirm('Tem certeza que deseja excluir este abastecimento?')) {
    const db = loadData();
    db.abastecimentos.splice(index, 1); // Remove o item no índice especificado
    saveData(db);
    listarAbastecimentos(); // Atualiza a lista
  }
}
// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  carregarVeiculosAbastecimento();
  listarAbastecimentos();
});
