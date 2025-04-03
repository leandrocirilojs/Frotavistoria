// Função para cadastrar veículo (com todas as validações)
function cadastrarVeiculo() {
  const placa = document.getElementById('placa').value.trim().toUpperCase();
  const modelo = document.getElementById('modelo').value.trim();
  const kmAtual = parseFloat(document.getElementById('kmAtual').value);
  const kmTrocaOleo = parseFloat(document.getElementById('kmTrocaOleo').value);

  // Validações
  if (!validarPlaca(placa)) {
    Swal.fire('Erro', 'Placa inválida! Formato: ABC1D23', 'error');
    return;
  }

  if (isNaN(kmAtual) || kmAtual < 0) {
    Swal.fire('Erro', 'Quilometragem atual inválida!', 'error');
    return;
  }

  const db = loadData();
  
  // Verifica placa duplicada
  if (db.veiculos.some(v => v.placa === placa)) {
    Swal.fire('Erro', 'Esta placa já está cadastrada!', 'error');
    return;
  }

  // Cadastra veículo
  db.veiculos.push({
    placa,
    modelo,
    kmAtual,
    kmProximaTrocaOleo: kmAtual + kmTrocaOleo,
    ultimaTrocaOleo: null
  });

  saveData(db);
  Swal.fire('Sucesso!', 'Veículo cadastrado.', 'success');
  document.getElementById('form-veiculo').reset(); // Limpa o formulário
  listarVeiculos();
  updateDashboard();
}

// Função para apagar veículo (já está ótima!)
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
      updateDashboard();
    }
  });
}

// Lista veículos com ações (edit/apagar)
function listarVeiculos() {
  const db = loadData();
  const lista = document.getElementById('veiculos');
  
  if (db.veiculos.length === 0) {
    lista.innerHTML = '<li>Nenhum veículo cadastrado.</li>';
    return;
  }

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

// Editar KM com SweetAlert
function editarVeiculo(placa) {
  const db = loadData();
  const veiculo = db.veiculos.find(v => v.placa === placa);

  Swal.fire({
    title: `Editar KM - ${veiculo.placa}`,
    input: 'number',
    inputValue: veiculo.kmAtual,
    inputLabel: 'Nova Quilometragem:',
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value || parseFloat(value) < 0) return 'Digite um valor válido!';
    }
  }).then((result) => {
    if (result.isConfirmed) {
      veiculo.kmAtual = parseFloat(result.value);
      saveData(db);
      listarVeiculos();
      updateDashboard();
      Swal.fire('Atualizado!', 'KM alterada com sucesso.', 'success');
    }
  });
}

// Inicialização
document.addEventListener('DOMContentLoaded', listarVeiculos);
