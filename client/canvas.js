const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let tool="brush";
let drawing = false;
let current = { color: "#000000", width: 4, points: [] };
let allStrokes = []; // ✅ local copy of all strokes
const cursors = {};

const toggleBtn = document.getElementById("toggle-toolbar");
const toolbar = document.getElementById("toolbar");
const isMobile = window.innerWidth <= 768;

toggleBtn.addEventListener("click", () => {
  toolbar.classList.toggle("visible");
});

// --- Tool buttons ---
const brushBtn = document.getElementById("brush");
const eraserBtn = document.getElementById("eraser");

      // --- Color palette setup ---
      const colorBlocks = document.querySelectorAll('.color-block');
      const hiddenColorInput = document.getElementById('color');
      let selectedColor = '#000000';

      // Set first color as active by default
      colorBlocks[0].classList.add('active');

      colorBlocks.forEach(block => {
        block.addEventListener('click', () => {
          const color = block.getAttribute('data-color');
          selectedColor = color;
          hiddenColorInput.value = color;
          
          // Update active state
          colorBlocks.forEach(b => b.classList.remove('active'));
          block.classList.add('active');
        });
      });

const widthSlider = document.getElementById('width');
const widthValue = document.getElementById('width-value');

widthSlider.addEventListener('input', (e) => {
  widthValue.textContent = e.target.value;
});


function setActiveTool(selectedTool) {
  tool = selectedTool;
  document.querySelectorAll(".tool").forEach(btn => btn.classList.remove("active"));
  if (selectedTool === "brush") brushBtn.classList.add("active");
  if (selectedTool === "eraser") eraserBtn.classList.add("active");
}

eraserBtn.addEventListener("click", () => {
  setActiveTool("eraser");
  document.getElementById("color").disabled = true;
});

brushBtn.addEventListener("click", () => {
  setActiveTool("brush");
  document.getElementById("color").disabled = false;
});


function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 48;
  redrawAll();
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function drawStroke(data) {
  ctx.strokeStyle = data.color;
  ctx.lineWidth = data.width;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(data.from.x, data.from.y);
  ctx.lineTo(data.to.x, data.to.y);
  ctx.stroke();
}

function redrawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  allStrokes.forEach(drawStroke);
}

// ================= DRAWING LOGIC =================

canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  current.color = document.getElementById("color").value;
  current.width = document.getElementById("width").value;
  current.points = [getPos(e)];
});

canvas.addEventListener("mousemove", (e) => {
  const pos = getPos(e);
  socket.emit("cursor", pos);

  if (!drawing) return;

  const last = current.points[current.points.length - 1];
  const strokeColor = tool === "eraser" ? "#ffffff" : document.getElementById("color").value;

  const stroke = { color: strokeColor, width: current.width, from: last, to: pos };

  drawStroke(stroke);
  allStrokes.push(stroke);
  socket.emit("draw", stroke);

  current.points.push(pos);
});

canvas.addEventListener("mouseup", () => (drawing = false));
canvas.addEventListener("mouseleave", () => (drawing = false));

// ================= BUTTON HANDLERS =================

document.getElementById("clear").addEventListener("click", () => {
  allStrokes = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  socket.emit("clear");
});

document.getElementById("undo").addEventListener("click", () => {
  socket.emit("undo");
});

document.getElementById("redo").addEventListener("click", () => {
  socket.emit("redo");
});


// ================= SOCKET EVENT HANDLERS =================

socket.on("draw", (data) => {
  drawStroke(data);
  allStrokes.push(data);
});

socket.on("clear", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  allStrokes = [];
});

socket.on("history", (historyData) => {
  console.log("Received updated history:", historyData.length);
  allStrokes = historyData;
  redrawAll();
});

// ================= CURSOR SYNC =================

socket.on("cursor", (data) => {
  const { userId, color, pos } = data;
  if (!cursors[userId]) {
    const el = document.createElement("div");
    el.classList.add("remote-cursor");
    el.style.background = color;
    document.body.appendChild(el);
    cursors[userId] = el;
  }
  const toolbar = document.getElementById("toolbar");
  const toolbarRect = toolbar.getBoundingClientRect();

  const offsetTop = toolbarRect.bottom;  // distance from top of screen to bottom of toolbar
  const offsetLeft = toolbarRect.right;  // for vertical toolbar on small screens

  const el = cursors[userId];

  // Check if toolbar is horizontal or vertical
  if (window.innerWidth > 768) {
    // Desktop: toolbar on top
    el.style.left = `${pos.x}px`;
    el.style.top = `${pos.y + offsetTop}px`;
  } else {
    // Mobile: toolbar on left side
    el.style.left = `${pos.x + offsetLeft}px`;
    el.style.top = `${pos.y}px`;
  }
});

// --- Cursor removal when a user disconnects ---
socket.on("removeCursor", ({ userId }) => {
  if (cursors[userId]) {
    cursors[userId].remove();
    delete cursors[userId];
  }
});









