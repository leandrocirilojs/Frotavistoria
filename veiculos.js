// Função melhorada para cadastrar veículo
function cadastrarVeiculo() {
  const placa = document.getElementById('placa').value;
  const modelo = document.getElementById('modelo').value;
  const kmAtual = parseFloat(document.getElementById('kmAtual').value);
  const kmTrocaOleo = parseFloat(document.getElementById('kmTrocaOleo').value);

  if (!validarPlaca(placa)) {
    Swal.fire('Erro', 'Placa inválida! Formato: ABC1D23', 'error');
    return;
  }

  const db = loadData();
  db.veiculos.push({
    placa,
    modelo,
    kmAtual,
    kmProximaTrocaOleo: kmAtual + kmTrocaOleo,
    ultimaTrocaOleo: null
  });

  saveData(db);
  Swal.fire('Sucesso!', 'Veículo cadastrado.', 'success');
  listarVeiculos();
  updateDashboard(); // Atualiza o resumo no dashboard
}


function apagarVeiculo(placa) {
  Swal.fire({
    title: 'Tem certeza?',
    text: `O veículo ${placa} será removido permanentemente!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Apagar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      const db = loadData();
      db.veiculos = db.veiculos.filter(v => v.placa !== placa);
      saveData(db);
      
      Swal.fire('Apagado!', 'Veículo removido com sucesso.', 'success');
      listarVeiculos();
      updateDashboard(); // Atualiza o resumo no dashboard
    }
  });
}






// Lista veículos na página
function listarVeiculos() {
  const db = loadData();
  const lista = document.getElementById('veiculos');
  lista.innerHTML = db.veiculos.map(veiculo => `
    <li>
      <strong>${veiculo.placa}</strong> - ${veiculo.modelo} (KM: ${veiculo.kmAtual})
      <div class="actions">
        <button onclick="editarVeiculo('${veiculo.placa}')">✏️ Editar KM</button>
        <button onclick="apagarVeiculo('${veiculo.placa}')" class="delete-btn">🗑️ Apagar</button>
      </div>
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

// Carrega a lista ao abrir a página
document.addEventListener('DOMContentLoaded', listarVeiculos);
