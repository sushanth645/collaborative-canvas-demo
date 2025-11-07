Project: Real-Time Collaborative Drawing Canvas

Technical Stack Used : HTML5 Canvas + Vanilla JS + Node.js + Socket.IO

Data Flow Diagram:

   User Action → Client Event → Server Logic → Broadcast → All Clients Update

| User Action | Client Emits | Server Handles                  | Broadcasts To  | Client Reaction  |
| ----------- | ------------ | ------------------------------- | -------------- | ---------------- |
| Draw Stroke | `draw`       | `addStroke(userId, data)`       | `draw`         | Render stroke    |
| Move Cursor | `cursor`     | Broadcasts with `{userId, pos}` | `cursor`       | Show live cursor |
| Undo        | `undo`       | Removes user’s last stroke      | `history`      | Redraw canvas    |
| Clear       | `clear`      | Clears all user histories       | `clear`        | Clears canvas    |
| Disconnect  | `disconnect` | Removes user + cursor           | `removeCursor` | Hides cursor     |


WebSocket Protocol:

   Events from Client → Server

| Event    | Payload                      | Description                                  |
| -------- | ---------------------------- | -------------------------------------------- |
| `draw`   | `{ color, width, from, to }` | Send stroke segment to server                |
| `undo`   | None                         | Request to undo last stroke for current user |
| `clear`  | None                         | Request to clear the full canvas             |
| `cursor` | `{ x, y }`                   | Update cursor position                       |

   Events from Server → Client

| Event          | Payload                        | Description                            |
| -------------- | ------------------------------ | -------------------------------------- |
| `draw`         | `{ color, width, from, to }`   | Draw incoming stroke from another user |
| `history`      | `[stroke, ...]`                | Redraw full canvas after undo/redo     |
| `clear`        | None                           | Clear entire canvas                    |
| `cursor`       | `{ userId, color, pos }`       | Show another user’s cursor             |
| `removeCursor` | `{ userId }`                   | Remove disconnected user’s cursor      |
| `users`        | `[ { id, name, color }, ... ]` | List of currently active users         |



Undo / Redo Strategy:

   Undo Logic
    ->Each user maintains a separate stroke list in userHistories[userId].
    ->When a user triggers Undo, only that user’s last stroke is removed.
    ->Server emits updated combined history (io.emit("history", getCombinedHistory())).
   
   undo(userId) {
   if (this.userHistories[userId]?.length > 0) {
    this.userHistories[userId].pop();
    this.save();
     }
   }

   Redo Logic
    -> It can be implemented by maintaining a per-user redoStack.
    -> when we undo a task it is added to redoStack and it is popped from stack and added to user History.
    ->The drawing is redrawn after changes are made.

    redo(userId) {
      const userRedo = this.redoStacks[userId];
      if (userRedo.length > 0) {
          const stroke = userRedo.pop();
          this.userHistories[userId].push(stroke);
          this.save();
       }
     } 


Conflict Resolution:

    Challenge:

    ->If two users draw overlapping strokes, they both modify the same shared canvas.

    Strategy:

    ->Each user’s strokes are stored separately (userHistories[userId]).
    ->Undo actions only affect the initiating user’s strokes.
    ->The combined history ensures deterministic redrawing across clients.
    ->This prevents user A from undoing user B’s drawings.


Performance Considerations:
    
    | Technique                      | Description                                                     |
    | ------------------------------ | --------------------------------------------------------------- |
    |   smoothness of drawing        | Emits only minimal stroke data (`from`, `to`), not entire paths |
    |   Canvas Redraw Optimization   | Redraws only when necessary (undo, clear)                       |
    |   Persistent Caching           | Saves to JSON file for recovery                                 |
    |   Socket Broadcasts            | Uses `socket.broadcast.emit` to avoid redundant local redraws   |






