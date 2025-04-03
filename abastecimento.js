// Carrega dados do localStorage
function loadData() {
  const data = localStorage.getItem('vehicleDB');
  if (data) {
    return JSON.parse(data);
  }
  // Retorna estrutura inicial se não existir
  return {
    veiculos: [],
    abastecimentos: [],
    manutencoes: []
  };
}

// Salva dados no localStorage
function saveData(db) {
  localStorage.setItem('vehicleDB', JSON.stringify(db));
}

// Formata data para exibição
function formatarData(dataString) {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dataString).toLocaleDateString('pt-BR', options);
}

// Carrega veículos no dropdown
function carregarVeiculosAbastecimento() {
  const db = loadData();
  const select = document.getElementById('placa-abastecimento');
  
  // Limpa e adiciona a opção padrão
  select.innerHTML = '<option value="">Selecione um veículo</option>';
  
  // Adiciona os veículos
  select.innerHTML += db.veiculos.map(v => 
    `<option value="${v.placa}">${v.placa} - ${v.modelo}</option>`
  ).join('');
}

// Atualiza o campo KM ao selecionar um veículo
document.getElementById('placa-abastecimento').addEventListener('change', function() {
  const placa = this.value;
  if (placa) {
    const db = loadData();
    const veiculo = db.veiculos.find(v => v.placa === placa);
    if (veiculo) {
      document.getElementById('km-atual').value = veiculo.kmAtual;
    }
  }
});

// Registra abastecimento
function registrarAbastecimento() {
  const db = loadData();
  const placa = document.getElementById('placa-abastecimento').value;
  const data = document.getElementById('data-abastecimento').value;
  const litros = parseFloat(document.getElementById('litros').value);
  const valor = parseFloat(document.getElementById('valor').value);
  const kmAtual = parseInt(document.getElementById('km-atual').value);
  const tipo = document.getElementById('tipo-combustivel').value;

  // Validações básicas
  if (!placa || !data || isNaN(litros) || isNaN(valor) || isNaN(kmAtual)) {
    alert('Preencha todos os campos corretamente!');
    return;
  }

  // Atualiza KM do veículo
  const veiculo = db.veiculos.find(v => v.placa === placa);
  if (veiculo) {
    veiculo.kmAtual = kmAtual;
  }

  // Registra abastecimento
  db.abastecimentos.push({
    placa,
    data,
    litros,
    valor,
    kmAtual,
    tipo,
    precoPorLitro: parseFloat((valor / litros).toFixed(2))
  });

  saveData(db);
  alert('Abastecimento registrado com sucesso!');
  
  // Limpa o formulário
  document.getElementById('form-abastecimento').reset();
  
  // Atualiza as listas
  carregarVeiculosAbastecimento();
  listarAbastecimentos();
}

// Lista histórico de abastecimentos
function listarAbastecimentos() {
  const db = loadData();
  const lista = document.getElementById('lista-abastecimentos');
  
  // Verifica se existem abastecimentos
  if (!db.abastecimentos || db.abastecimentos.length === 0) {
    lista.innerHTML = '<li class="sem-registros">Nenhum abastecimento registrado ainda.</li>';
    return;
  }

  // Ordena por data (mais recente primeiro)
  const abastecimentosOrdenados = [...db.abastecimentos].sort((a, b) => 
    new Date(b.data) - new Date(a.data)
  );

  lista.innerHTML = abastecimentosOrdenados.map(a => `
    <li class="abastecimento-item">
      <div class="abastecimento-header">
        <strong>${a.placa}</strong> - ${formatarData(a.data)}
        <span class="tipo-combustivel ${a.tipo}">${a.tipo.toUpperCase()}</span>
      </div>
      <div class="abastecimento-detalhes">
        ${a.litros.toFixed(2)}L | R$ ${a.valor.toFixed(2)} 
        | KM: ${a.kmAtual} | R$ ${a.precoPorLitro}/L
      </div>
    </li>
  `).join('');
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  carregarVeiculosAbastecimento();
  listarAbastecimentos();
  
  // Define a data atual como padrão
  document.getElementById('data-abastecimento').valueAsDate = new Date();
});
