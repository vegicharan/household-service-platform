const API = "https://household-service-platform-zyuo.onrender.com/";

async function proposePrice() {
  const jobId = document.getElementById("jobId").value;
  const workerId = document.getElementById("workerId").value;
  const proposedPrice = document.getElementById("proposedPrice").value;

  const res = await fetch(`${API}/api/workers/propose-price`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobId, workerId, proposedPrice })
  });

  const data = await res.json();
  alert(data.message);
}

async function completeJob() {
  const jobId = document.getElementById("completeJobId").value;

  const res = await fetch(`${API}/api/workers/complete-job`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobId })
  });

  const data = await res.json();
  alert(data.message);
}
