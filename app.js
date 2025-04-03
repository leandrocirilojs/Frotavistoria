// Banco de dados no LocalStorage
const DB_NAME = "frota_manager";

// Inicializa o banco de dados se não existir
function initDB() {
  if (!localStorage.getItem(DB_NAME)) {
    localStorage.setItem(DB_NAME, JSON.stringify({
      veiculos: [],
      manutencoes: [],
      abastecimentos: []
    }));
  }
}

// Carrega dados do LocalStorage
function loadData() {
  return JSON.parse(localStorage.getItem(DB_NAME));
}

// Salva dados no LocalStorage
function saveData(data) {
  localStorage.setItem(DB_NAME, JSON.stringify(data));
}

// Atualiza o dashboard
function updateDashboard() {
  const db = loadData();
  document.getElementById('total-veiculos').textContent = db.veiculos.length;
  
  const alertas = [];
  db.veiculos.forEach(veiculo => {
    if (veiculo.kmProximaTrocaOleo && veiculo.kmAtual >= veiculo.kmProximaTrocaOleo * 0.9) {
      alertas.push(`Troca de óleo necessária: ${veiculo.placa}`);
    }
  });
  
  const listaAlertas = document.getElementById('lista-alertas');
  listaAlertas.innerHTML = alertas.map(alerta => `<li>${alerta}</li>`).join('');
}

// Inicializa o app
document.addEventListener('DOMContentLoaded', () => {
  initDB();
  updateDashboard();
});










function criarDadosExemplo() {
  const db = {
    veiculos: [
      { id: 1, placa: "ABC1D23", modelo: "Fiat Toro", kmAtual: 45000, kmProximaTrocaOleo: 50000 },
      { id: 2, placa: "XYZ4E56", modelo: "VW Gol", kmAtual: 32000, kmProximaTrocaOleo: 35000 }
    ],
    manutencoes: [
      { id: 1, veiculoId: 1, tipo: "oleo", data: "2023-12-01", realizada: false },
      { id: 2, veiculoId: 2, tipo: "freio", data: "2023-11-15", realizada: true }
    ],
    abastecimentos: [
      { id: 1, veiculoId: 1, litros: 40, valor: 280, kmAtual: 44000, data: "2023-11-10" },
      { id: 2, veiculoId: 1, litros: 35, valor: 245, kmAtual: 45000, data: "2023-11-20" }
    ],
    nextId: 3
  };
  
  localStorage.setItem(DB_NAME, JSON.stringify(db));
}
// Descomente para usar:
// criarDadosExemplo();
