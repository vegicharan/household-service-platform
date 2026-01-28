const API = "https://household-backend.onrender.com";


async function login() {
  const email = document.getElementById("email").value;

  if (!email) {
    alert("Please enter email");
    return;
  }

  try {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    })

    const data = await res.json();
    console.log("Login response:", data);

    if (!data.user) {
      alert("User not found");
      return;
    }

    // Save user
    localStorage.setItem("user", JSON.stringify(data.user));

    // Redirect by role
    if (data.user.role === "user") {
      window.location.href = "user-dashboard.html";
    } else if (data.user.role === "worker") {
      window.location.href = "worker-dashboard.html";
    } else if (data.user.role === "admin") {
      window.location.href = "admin-dashboard.html";
    } else {
      alert("Unknown role");
    }

  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed");
  }
}