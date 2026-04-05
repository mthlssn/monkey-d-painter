const screen = document.getElementById('screen');
const ctx = screen.getContext('2d');
const horaDiv = document.getElementById('hora');

const width = screen.width;
const height = screen.height;

const cores = [
  "red", "yellow", "blue", "green", "orange", "purple",
  "black", "white", "gray", "pink", "brown", "beige", "aqua", "gold", "silver"
];

let timestampUTC = 0; 
let requisicaoFeita = false;
let minutoAnterior = null;

function corRandom() {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);

  return cores[(array[0] % 15)];
}

async function draw() {
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const color = corRandom();
      ctx.fillStyle = color;
      ctx.fillRect(i, j, 1, 1);
    }
  }
}

async function pegarHoraAPI() {
  try {
    const res = await fetch("https://timeapi.io/api/Time/current/zone?timeZone=UTC");
    if (!res.ok) throw new Error("Erro na API");
    const data = await res.json();
    timestampUTC = new Date(data.dateTime).getTime();
    requisicaoFeita = true;
    
  } catch (err) {
    console.error("Erro ao pegar a hora:", err);
  }
}

pegarHoraAPI();

function atualizarHora() {
  if (!requisicaoFeita) return;

  const agora = Date.now();
  const diff = agora - timestampUTC;
  const horaAtual = new Date(timestampUTC + diff);

  const dia = horaAtual.getUTCDate().toString().padStart(2, '0');
  const mes = (horaAtual.getUTCMonth()+1).toString().padStart(2, '0');
  const ano = horaAtual.getUTCFullYear();
  const hora = horaAtual.getUTCHours().toString().padStart(2,'0');
  const min = horaAtual.getUTCMinutes().toString().padStart(2,'0');
  const seg = horaAtual.getUTCSeconds().toString().padStart(2,'0');

  horaDiv.textContent = `${ano}-${mes}-${dia} ${hora}:${min}:${seg} (UTC+0)`;
}

// função só pra atualizar a imagem
function atualizarImagem() {
  const agora = new Date();
  const minutoAtual = agora.getUTCMinutes();

  if (minutoAtual !== minutoAnterior) {
    minutoAnterior = minutoAtual;

    draw();
  }
}

// loop único pra chamar ambas funções
setInterval(() => {
  atualizarHora();
  atualizarImagem();
}, 1000);

document.addEventListener("DOMContentLoaded", draw);

async function compartilhar() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Meu projeto",
        text: "Olha isso aqui",
        url: "https://example.com"
      });
      console.log("Compartilhado!");
    } catch (err) {
      console.log("Erro:", err);
    }
  } else {
    alert("Seu navegador não suporta compartilhamento 😢");
  }
}