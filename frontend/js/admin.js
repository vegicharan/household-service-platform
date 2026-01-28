const API = "http://localhost:5000";

async function verifyWorker() {
  const workerId = document.getElementById("verifyWorkerId").value;

  const res = await fetch(`${API}/api/admin/verify-worker`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ workerId })
  });

  const data = await res.json();
  alert(data.message);
}

async function releaseSupport() {
  const workerId = document.getElementById("supportWorkerId").value;
  const amount = document.getElementById("amount").value;

  const res = await fetch(`${API}/api/admin/release-support`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ workerId, amount })
  });

  const data = await res.json();
  alert(data.message);
}
