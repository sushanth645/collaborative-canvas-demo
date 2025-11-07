const fs = require("fs");
const path = require("path");

class DrawingState {
  constructor() {
    this.userHistories = {};
    this.savePath = path.join(__dirname, "../data/drawing.json");
    this.load();
  }

  addStroke(userId, stroke) {
    if (!this.userHistories[userId]) this.userHistories[userId] = [];
    this.userHistories[userId].push(stroke);
    this.save();
  }

  undo(userId) {
    if (this.userHistories[userId] && this.userHistories[userId].length > 0) {
      if (!this.redoStacks) this.redoStacks = {};
      if (!this.redoStacks[userId]) this.redoStacks[userId] = [];
      const stroke=this.userHistories[userId].pop();
      this.redoStacks[userId].push(stroke);
      this.save();
    }
  }

  redo(userId) {
  if (!this.userHistories[userId]) return;
  if (!this.redoStacks) this.redoStacks = {};
  if (!this.redoStacks[userId]) this.redoStacks[userId] = [];

  const userRedo = this.redoStacks[userId];
  if (userRedo.length > 0) {
    const stroke = userRedo.pop();
    this.userHistories[userId].push(stroke);
    this.save();
  }
  }

  clear(userId) {
    this.userHistories = {};
      this.save();
  }

  getCombinedHistory() {
    return Object.values(this.userHistories).flat();
  }

  save() {
    const dir = path.dirname(this.savePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(this.savePath, JSON.stringify(this.userHistories, null, 2));
  }

  load() {
    if (fs.existsSync(this.savePath)) {
      try {
        const data = JSON.parse(fs.readFileSync(this.savePath, "utf-8"));
        if (typeof data === "object") this.userHistories = data;
      } catch (err) {
        console.error("Error loading saved drawing:", err);
      }
    }
  }
}

module.exports = DrawingState;





