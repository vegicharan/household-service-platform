const API = "http://localhost:5000";

// Get verified workers
async function getWorkers() {
  const skill = document.getElementById("skill").value;

  const res = await fetch(`${API}/api/users/workers/${skill}`);
  const workers = await res.json();

  const list = document.getElementById("workerList");
  list.innerHTML = "";

  workers.forEach(w => {
    const li = document.createElement("li");
    li.innerText = `${w.name} | Rating: ${w.rating}`;
    list.appendChild(li);
  });
}

// Create job
async function createJob() {
  const userId = document.getElementById("userId").value;
  const serviceType = document.getElementById("serviceType").value;
  const basePrice = document.getElementById("price").value;

  const res = await fetch(`${API}/api/users/create-job`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, serviceType, basePrice })
  });

  const data = await res.json();
  alert(data.message);
}
