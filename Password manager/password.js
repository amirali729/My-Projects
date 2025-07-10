// Master Password Lock Screen Setup
window.addEventListener("DOMContentLoaded", () => {
    const master = localStorage.getItem("masterPassword");
    document.getElementById("lockscreen").style.display = "flex";
    document.getElementById("main-content").style.display = "none";
});

function maskPassword(pass) {
    return '*'.repeat(pass.length);
}

function copyText(txt) {
    navigator.clipboard.writeText(txt).then(() => {
        document.getElementById("alert").style.display = "inline";
        setTimeout(() => {
            document.getElementById("alert").style.display = "none";
        }, 2000);
    });
}

const deletePassword = (website) => {
    let data = localStorage.getItem("passwords");
    let arr = JSON.parse(data);
    let arrUpdated = arr.filter(e => e.website !== website);
    localStorage.setItem("passwords", JSON.stringify(arrUpdated));
    alert(`Deleted password for ${website}`);
    showPasswords();
};

const showPasswords = () => {
    let tb = document.getElementById("password-table");
    let data = localStorage.getItem("passwords");

    if (!data || JSON.parse(data).length === 0) {
        tb.innerHTML = `<tr><td colspan="4" style="text-align:center;">No passwords saved.</td></tr>`;
        return;
    }

    let arr = JSON.parse(data);
    tb.innerHTML = `<tr>
        <th>Website</th>
        <th>Username</th>
        <th>Password</th>
        <th>Delete</th>
    </tr>`;

    arr.forEach(element => {
        tb.innerHTML += `
        <tr>
            <td>${element.website} <img onclick="copyText('${element.website}')" src="./copy.svg" alt="Copy"></td>
            <td>${element.username} <img onclick="copyText('${element.username}')" src="./copy.svg" alt="Copy"></td>
            <td>${maskPassword(element.password)} <img onclick="copyText('${element.password}')" src="./copy.svg" alt="Copy"></td>
            <td><button class="btnsm" onclick="deletePassword('${element.website}')">Delete</button></td>
        </tr>`;
    });
};

document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    let website = document.getElementById("website").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let passwords = JSON.parse(localStorage.getItem("passwords") || "[]");
    passwords.push({ website, username, password });

    localStorage.setItem("passwords", JSON.stringify(passwords));
    alert("Password saved!");
    showPasswords();
    e.target.reset();
});

// Master password unlock function
function unlock() {
    const input = document.getElementById("master-input").value;
    const master = localStorage.getItem("masterPassword");

    if (!master) {
        localStorage.setItem("masterPassword", input);
        alert("Master password set.");
        document.getElementById("lockscreen").style.display = "none";
        document.getElementById("main-content").style.display = "block";
        showPasswords();
    } else if (input === master) {
        document.getElementById("lockscreen").style.display = "none";
        document.getElementById("main-content").style.display = "block";
        showPasswords();
    } else {
        alert("Incorrect master password!");
    }
}

function resetMaster() {
    localStorage.removeItem("masterPassword");
    alert("Master password reset. Reloading...");
    location.reload();
}

function toggleVisibility() {
    const passInput = document.getElementById("password");
    passInput.type = passInput.type === "password" ? "text" : "password";
}

function generatePassword() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let pass = "";
    for (let i = 0; i < 12; i++) {
        pass += chars[Math.floor(Math.random() * chars.length)];
    }
    document.getElementById("password").value = pass;
    checkStrength(pass);
}

document.getElementById("password").addEventListener("input", (e) => {
    checkStrength(e.target.value);
});

function checkStrength(pwd) {
    const strengthText = document.getElementById("strength-text");
    let strength = "Weak";

    if (pwd.length > 10 && /[A-Z]/.test(pwd) && /\d/.test(pwd) && /[^a-zA-Z0-9]/.test(pwd)) {
        strength = "Strong";
    } else if (pwd.length >= 8) {
        strength = "Moderate";
    }

    strengthText.innerText = `Strength: ${strength}`;
}
