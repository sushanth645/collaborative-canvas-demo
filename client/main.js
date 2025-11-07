socket.on("users", (users) => {
  console.log("✅ Received users:", users);
  const usersDiv = document.getElementById("users");
  usersDiv.innerHTML = "<strong>Online Users:</strong><br>";
  users.forEach((u) => {
    const div = document.createElement("div");
    div.textContent = u.name;
    div.style.color = u.color;
    usersDiv.appendChild(div);
  });
});
