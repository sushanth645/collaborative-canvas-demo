PROJECT DEMO LINK: https://collaborative-canvas-demo.onrender.com/

AUTHOR:
  LAKKOJU SUSHANTH
  Email: sushanthlakkoju66@gmail.com
  Aspiring Web Developer
  LinkedIn Profile Link: https://www.linkedin.com/in/sushanth-lakkoju-ba308525b/
  Github Profile: https://github.com/sushanth645


REAL-TIME COLLABORATIVE DRAWING CURVE
  A multi-user collaborative drawing app built using Node.js, Socket.io, and HTML5 Canvas — allowing multiple users to draw together in real time on a shared canvas.

FEATURES:
1) Drawing Tools:
   ->Brush and Eraser tools
   ->Adjustable stroke width
   ->Multiple color options (palette + input color picker)
   ->Real-time cursor positions of all users
   
2) Real-Time Collaboration:
   ->Live drawing synchronization using WebSockets (Socket.io)
   ->Instant updates across all connected users
   ->Smooth cursor tracking with unique user colors

3) Canvas Management:
   ->Global Undo / Redo functionality across users
   ->Clear Canvas resets for everyone
   ->Persistent storage – previous drawings are saved and reloaded automatically

4) User Management:
   ->Unique user ID & color assigned on connection
   ->Online user list updates dynamically
   ->Cursor automatically removed when user disconnects


PROJECT STRUCTURE:

  collaborative-canvas/
├── client/
│   ├── index.html           # Main frontend interface
│   ├── style.css            # Toolbar, canvas, and layout styling
│   ├── canvas.js            # Canvas drawing logic + event handlers
│   ├── socket.js            # Socket.io connection setup
│   └── assets/              # (optional) Icons, images, etc.
├── server/
│   ├── server.js            # Express + Socket.io setup
│   ├── room.js              # Manages user sessions & socket events
│   └── drawing-state.js     # Handles canvas history, undo, redo, persistence
├── data/
│   └── drawing.json         # Saved canvas state
├── package.json
├── README.md
└── ARCHITECTURE.md          # System design explanation


INSTALLATION & SETUP:
 1) Clone the repository:
    git clone https://github.com/<your-username>/collaborative-canvas-demo.git
    cd collaborative-canvas-demo

2)  Install dependencies:
    npm install

3)  Start the server:
    npm start


TESTING WITH MULTIPLE USERS:
   -> Open http://localhost:8000 in one browser window.
   -> Open the same link in another browser (or incognito).
   -> Draw on one — changes will appear instantly in the other!

 BUGS/ISSUES:
   -> After Installation and setup the application works with atmost precision and undo/redo works well while doing and undoing the strokes made by that user.
   -> After deploying the cursor and the user-specific color dots are having a little lag while using it in the demo link.
   -> I can make the input color palette but I choose to make different color blocks such that when we click them the colored strokes are visible, but when we collapse it the colored blocks becomes vertically           flexed.
   -> High latency on poor network connections may cause slight cursor delay.
   -> Persistence uses local file storage (not database-backed).

Time spent on the project: 3 days.





