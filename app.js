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

// Conta manutenções pendentes
function contarManutencoesPendentes() {
  const db = loadData();
  return db.manutencoes.filter(m => !m.realizada).length;
}

// Atualiza o dashboard com informações de veículos e manutenções
function updateDashboard() {
  const db = loadData();
  
  // Atualiza contagem de veículos
  document.getElementById('total-veiculos').textContent = db.veiculos.length;
  
  // Atualiza contagem de manutenções pendentes
  document.getElementById('prox-manutencao').textContent = contarManutencoesPendentes();
  
  // Gera alertas combinados (veículos + manutenções)
  const alertas = [];
  
  // 1. Alertas baseados em veículos (troca de óleo)
  db.veiculos.forEach(veiculo => {
    if (veiculo.kmProximaTrocaOleo && veiculo.kmAtual >= veiculo.kmProximaTrocaOleo * 0.9) {
      alertas.push({
        tipo: 'oleo',
        texto: `⚠️ Troca de óleo necessária: ${veiculo.placa} (KM: ${veiculo.kmAtual})`,
        prioridade: 1
      });
    }
  });
  
  // 2. Alertas de manutenções agendadas
  const hoje = new Date();
  db.manutencoes
    .filter(m => !m.realizada)
    .forEach(m => {
      const dataManutencao = new Date(m.data);
      const diasRestantes = Math.ceil((dataManutencao - hoje) / (1000 * 60 * 60 * 24));
      
      if (diasRestantes <= 7) {
        alertas.push({
          tipo: 'manutencao',
          texto: `🔧 ${m.tipo} agendado: ${m.placa} (${m.data} - em ${diasRestantes} dias)`,
          prioridade: diasRestantes <= 3 ? 1 : 2
        });
      }
    });
  
  // Ordena alertas por prioridade (mais urgentes primeiro)
  alertas.sort((a, b) => a.prioridade - b.prioridade);
  
  // Exibe alertas no HTML
  const listaAlertas = document.getElementById('lista-alertas');
  listaAlertas.innerHTML = alertas.length > 0 
    ? alertas.map(a => `<li class="alerta-${a.tipo}">${a.texto}</li>`).join('')
    : '<li>Nenhum alerta no momento</li>';
}

// Função para atualizar o dashboard quando houver mudanças nas manutenções
function atualizarDashboardManutencoes() {
  updateDashboard();
}

// Inicializa o app e configura atualização periódica
document.addEventListener('DOMContentLoaded', () => {
  initDB();
  updateDashboard();
  
  // Atualiza o dashboard a cada 30 segundos
  setInterval(updateDashboard, 30000);
});


//Menu Amburguer Car
function toggleMenu() {
  const nav = document.getElementById('menu');
  nav.classList.toggle('show');
}
