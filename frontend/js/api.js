const API_BASE = "http://localhost:3000";

function getToken() {
  return localStorage.getItem("token");
}

function parseJwt(token) {
  const base64 = token.split(".")[1];
  return JSON.parse(atob(base64));
}

function requireAuth(role = null) {
  const token = getToken();
  if (!token) window.location.href = "index.html";

  const payload = parseJwt(token);

  if (role && payload.role !== role) {
    alert("Acesso negado. Você não é admin.");
    window.location.href = "index.html";
  }

  return payload;
}

async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  return { res, data };
}
