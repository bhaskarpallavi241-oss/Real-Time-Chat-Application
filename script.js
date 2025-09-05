const socket = io();
let typingTimeout;

function setUsername() {
  const username = document.getElementById("usernameInput").value.trim();
  if (username) {
    socket.emit("set username", username);
    document.getElementById("usernameDiv").style.display = "none";
    document.getElementById("chatDiv").style.display = "block";
  }
}

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const typingIndicator = document.getElementById("typing");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", input.value);
    input.value = "";
    socket.emit("stop typing");
  }
});

input.addEventListener("input", () => {
  socket.emit("typing");

  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit("stop typing");
  }, 1000);
});

socket.on("chat message", function (msg) {
  const item = document.createElement("li");
  item.innerHTML = `<strong>${msg.user}:</strong> ${msg.text}`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on("user joined", (msg) => {
  const item = document.createElement("li");
  item.style.color = "green";
  item.textContent = msg;
  messages.appendChild(item);
});

socket.on("user left", (msg) => {
  const item = document.createElement("li");
  item.style.color = "red";
  item.textContent = msg;
  messages.appendChild(item);
});

socket.on("typing", (username) => {
  typingIndicator.textContent = `${username} is typing...`;
});

socket.on("stop typing", () => {
  typingIndicator.textContent = "";
});
