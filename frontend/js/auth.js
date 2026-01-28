const API = "https://household-service-platform-zyuo.onrender.com/";

async function login() {
  const email = document.getElementById("email").value;

  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });

  const data = await res.json();

  if (!data.user) {
    alert("Login failed");
    return;
  }

  // Save user in local storage
  localStorage.setItem("user", JSON.stringify(data.user));

  // Redirect based on role
  if (data.user.role === "user") {
    window.location.href = "user-dashboard.html";
  } else if (data.user.role === "worker") {
    window.location.href = "worker-dashboard.html";
  } else if (data.user.role === "admin") {
    window.location.href = "admin-dashboard.html";
  }
}
