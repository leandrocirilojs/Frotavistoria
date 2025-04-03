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
