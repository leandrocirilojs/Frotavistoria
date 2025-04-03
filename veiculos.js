// Cadastra veículo
function cadastrarVeiculo() {
  const placa = document.getElementById('placa').value;
  const modelo = document.getElementById('modelo').value;
  const kmAtual = parseFloat(document.getElementById('kmAtual').value);
  const kmTrocaOleo = parseFloat(document.getElementById('kmTrocaOleo').value);

  const db = loadData();
  db.veiculos.push({
    placa,
    modelo,
    kmAtual,
    kmProximaTrocaOleo: kmAtual + kmTrocaOleo,
    ultimaTrocaOleo: null
  });
  saveData(db);
  alert('Veículo cadastrado!');
  listarVeiculos();
}

// Lista veículos na página
function listarVeiculos() {
  const db = loadData();
  const lista = document.getElementById('veiculos');
  lista.innerHTML = db.veiculos.map(veiculo => `
    <li>
      <strong>${veiculo.placa}</strong> - ${veiculo.modelo} (KM: ${veiculo.kmAtual}) 
      <button onclick="editarVeiculo('${veiculo.placa}')">Editar KM</button>
      <button onclick="excluirVeiculo('${veiculo.placa}')" class="delete-btn">Excluir</button>
    </li>
  `).join('');
}

// Editar KM (simplificado)
function editarVeiculo(placa) {
  const novoKm = prompt("Nova quilometragem:");
  if (novoKm) {
    const db = loadData();
    const veiculo = db.veiculos.find(v => v.placa === placa);
    veiculo.kmAtual = parseFloat(novoKm);
    saveData(db);
    listarVeiculos();
  }
}


// Adicione esta função junto com as outras
function excluirVeiculo(placa) {
  if (confirm(`Tem certeza que deseja excluir o veículo ${placa}?`)) {
    const db = loadData();
    db.veiculos = db.veiculos.filter(v => v.placa !== placa);
    saveData(db);
    listarVeiculos();
    alert('Veículo excluído com sucesso!');
  }
}






// Carrega a lista ao abrir a página
document.addEventListener('DOMContentLoaded', listarVeiculos);
