const crypto = require("crypto");
const DrawingState = require("./drawing-state");

const users = {};
const state = new DrawingState();

const colorPalette = [
  "#e6194b", "#3cb44b", "#ffe119",
  "#4363d8", "#f58231", "#911eb4",
  "#46f0f0", "#f032e6", "#9A6324",
  "#800000", "#808000", "#469990"
];

const usedColors = new Set();

// Assign unique color
function getUniqueColor() {
  const available = colorPalette.find(c => !usedColors.has(c));
  if (available) {
    usedColors.add(available);
    return available;
  }
  return "#" + Math.floor(Math.random() * 16777215).toString(16); // fallback
}

// Release color when user leaves
function releaseColor(color) {
  if (usedColors.has(color)) usedColors.delete(color);
}

function setupCanvasHandlers(io, socket) {
  const userId = crypto.randomBytes(3).toString("hex");
  const color = getUniqueColor();
  const name = `User-${userId}`;

  users[socket.id] = { id: userId, name, color };
  console.log(`${name} connected`);

  // Send existing canvas + users to new client
  io.emit("users", Object.values(users));
  socket.emit("history", state.getCombinedHistory());

  // Draw handler
  socket.on("draw", (data) => {
    const stroke = { ...data, userId };
    state.addStroke(userId, stroke);  // ✅ pass userId correctly
    socket.broadcast.emit("draw", stroke);
  });

  // Undo only user’s strokes
  socket.on("undo", () => {
    state.undo(userId);
    io.emit("history", state.getCombinedHistory());
  });


  socket.on("redo", () => {
  state.redo(userId);
  io.emit("history", state.getCombinedHistory());
  });


  // Clear only user’s strokes
  socket.on("clear", () => {
    state.clear();       
    io.emit("clear");
  });

  // Cursor updates
  socket.on("cursor", (pos) => {
    io.emit("cursor", { userId, color, pos });
  });

  // Disconnect cleanup
  socket.on("disconnect", () => {
    const removedUser = users[socket.id];
    console.log(`${name} disconnected`);
    if (removedUser) {
      releaseColor(removedUser.color);
      io.emit("removeCursor", { userId: removedUser.id });
    }
    delete users[socket.id];
    io.emit("users", Object.values(users));
  });
}

module.exports = { setupCanvasHandlers };







