requireAuth("admin");

function showSection(name) {
  document.getElementById("section-carros").classList.add("hidden");
  document.getElementById("section-alugueis").classList.add("hidden");

  document.getElementById(`section-${name}`).classList.remove("hidden");
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

/* =========================
   CARROS
========================= */

async function loadCarros() {
  const tbody = document.getElementById("carros-tbody");
  tbody.innerHTML = "<tr><td colspan='6'>Carregando...</td></tr>";

  const { res, data } = await apiFetch("/carros");

  if (!res.ok) {
    tbody.innerHTML = `<tr><td colspan='6'>Erro ao buscar carros</td></tr>`;
    return;
  }

  tbody.innerHTML = "";

  data.forEach((c) => {
    tbody.innerHTML += `
      <tr>
        <td>${c.id}</td>
        <td>${c.marca}</td>
        <td>${c.modelo}</td>
        <td>${c.ano}</td>
        <td>${c.placa}</td>
        <td>R$ ${Number(c.valor_diaria).toFixed(2)}</td>
      </tr>
    `;
  });
}

document.getElementById("form-carro").addEventListener("submit", async (e) => {
  e.preventDefault();

  const carro = {
    marca: document.getElementById("marca").value,
    modelo: document.getElementById("modelo").value,
    ano: Number(document.getElementById("ano").value),
    placa: document.getElementById("placa").value,
    valor_diaria: Number(document.getElementById("valor_diaria").value),
  };

  const { res, data } = await apiFetch("/carros", {
    method: "POST",
    body: JSON.stringify(carro),
  });

  const msg = document.getElementById("msg-carro");

  if (!res.ok) {
    msg.innerText = data.error || "Erro ao cadastrar carro";
    return;
  }

  msg.innerText = "Carro cadastrado com sucesso!";
  e.target.reset();
  loadCarros();
});

/* =========================
   ALUGUEIS
========================= */

async function loadAlugueis() {
  const tbody = document.getElementById("alugueis-tbody");
  tbody.innerHTML = "<tr><td colspan='6'>Carregando...</td></tr>";

  const { res, data } = await apiFetch("/alugueis");

  if (!res.ok) {
    tbody.innerHTML = `<tr><td colspan='6'>Erro ao buscar aluguéis</td></tr>`;
    return;
  }

  tbody.innerHTML = "";

  data.forEach((a) => {
    tbody.innerHTML += `
      <tr>
        <td>${a.id}</td>
        <td>${a.cliente_id}</td>
        <td>${a.carro_id}</td>
        <td>${(a.data_inicio || "").slice(0, 10)}</td>
        <td>${(a.data_fim || "").slice(0, 10)}</td>
        <td>R$ ${Number(a.valor_total).toFixed(2)}</td>
      </tr>
    `;
  });
}

document.getElementById("form-aluguel").addEventListener("submit", async (e) => {
  e.preventDefault();

  const aluguel = {
    cliente_id: Number(document.getElementById("cliente_id").value),
    carro_id: Number(document.getElementById("carro_id").value),
    data_inicio: document.getElementById("data_inicio").value,
    data_fim: document.getElementById("data_fim").value,
    valor_diaria: Number(document.getElementById("valor_diaria_aluguel").value),
    valor_total: Number(document.getElementById("valor_total").value),
  };

  const { res, data } = await apiFetch("/alugueis", {
    method: "POST",
    body: JSON.stringify(aluguel),
  });

  const msg = document.getElementById("msg-aluguel");

  if (!res.ok) {
    msg.innerText = data.error || "Erro ao criar aluguel";
    return;
  }

  msg.innerText = "Aluguel criado com sucesso!";
  e.target.reset();
  loadAlugueis();
});

async function buscarAluguelPorId() {
  const id = document.getElementById("buscar_aluguel_id").value;
  const pre = document.getElementById("aluguel-detalhe");

  pre.innerText = "Carregando...";

  const { res, data } = await apiFetch(`/alugueis/${id}`);

  if (!res.ok) {
    pre.innerText = data.error || "Erro ao buscar aluguel";
    return;
  }

  pre.innerText = JSON.stringify(data, null, 2);
}

/* =========================
   INIT
========================= */

loadCarros();
loadAlugueis();
