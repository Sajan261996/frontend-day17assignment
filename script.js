const API_URL = "https://day17assignment.onrender.com";
let token = localStorage.getItem("token");

const loginPage = document.getElementById("loginPage");
const signupPage = document.getElementById("signupPage");
const dashboardPage = document.getElementById("dashboardPage");

document.getElementById("goSignup").onclick = () => { loginPage.style.display="none"; signupPage.style.display="block"; };
document.getElementById("goLogin").onclick = () => { signupPage.style.display="none"; loginPage.style.display="block"; };

document.getElementById("loginForm").addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    try {
        const res = await axios.post(`${API_URL}/login`, { email, password });
        token = res.data.token;
        localStorage.setItem("token", token);
        showDashboard();
    } catch(err) {
        alert(err.response?.data?.message || "Login failed");
    }
});

document.getElementById("signupForm").addEventListener("submit", async e => {
    e.preventDefault();
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    try {
        const res = await axios.post(`${API_URL}/signup`, { name, email, password });
        token = res.data.token;
        localStorage.setItem("token", token);
        showDashboard();
    } catch(err) {
        alert(err.response?.data?.message || "Signup failed");
    }
});

function showDashboard() {
    loginPage.style.display = "none";
    signupPage.style.display = "none";
    dashboardPage.style.display = "block";
    fetchUsers();
}

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    token = null;
    dashboardPage.style.display = "none";
    loginPage.style.display = "block";
});

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", () => fetchUsers(searchInput.value));

async function fetchUsers(query="") {
    try {
        const res = await axios.get(`${API_URL}/users?q=${query}`, { headers: { Authorization: `Bearer ${token}` } });
        renderUsers(res.data);
    } catch(err) {
        alert("Failed to fetch users");
    }
}

const tableBody = document.querySelector("#usersTable tbody");
function renderUsers(users) {
    tableBody.innerHTML = "";
    users.forEach((user, i) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${i+1}</td><td>${user.name}</td><td>${user.email}</td>
        <td>
            <button onclick="editUser('${user._id}')">Edit</button>
            <button onclick="deleteUser('${user._id}')">Delete</button>
        </td>`;
        tableBody.appendChild(row);
    });
}

window.editUser = async (id) => {
    const newName = prompt("Enter new name");
    if (!newName) return;
    await axios.put(`${API_URL}/users/${id}`, { name: newName }, { headers: { Authorization: `Bearer ${token}` } });
    fetchUsers(searchInput.value);
};

window.deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    await axios.delete(`${API_URL}/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchUsers(searchInput.value);
};

if (token) showDashboard();

