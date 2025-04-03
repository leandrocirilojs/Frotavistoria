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










