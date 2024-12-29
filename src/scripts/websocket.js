let socket;

const stateElem = document.getElementById("state");
stateElem.innerHTML = "No WebSocket server found!";
stateElem.style.color = "var(--state_disconnected)"

function connectWebSocket() {
  socket = new WebSocket("ws://localhost:808");

  socket.addEventListener("open", function (event) {
    console.log("Connected to WebSocket server");
    stateElem.innerHTML = "Connected to WebSocket server";
    stateElem.style.color = "var(--state_active)";
  });

  socket.addEventListener("message", function (event) {
    const arr = JSON.parse(event.data);
    document.getElementById("rawData").innerHTML = event.data
    handleSocketMessage(arr);
  });

  socket.addEventListener("close", function (event) {
    console.log("Connection closed. Attempting to reconnect...");
    stateElem.innerHTML = "Connection closed. Reconnecting...";
    stateElem.style.color = "var(--state_reconnecting)";

    // Attempt to reconnect after 3 seconds
    setTimeout(connectWebSocket, 3000);
  });
}

function handleSocketMessage(arr) {
  let googleIndex = 0;
  let firstString = 0;
  let secondString = 0;

  let tempElem = ``;

  arr[1].forEach((element, i) => {
    tempElem += `<h2>${element[1]}</h2>`;
    if (typeof element[1] === "string" && element[1].match(/© \d+ Google/) && googleIndex === 0) {
      googleIndex = i;
    }
    if (firstString !== 0 && typeof element[1] === "string" && secondString === 0) {
      secondString = i;
    }
    if (googleIndex !== 0 && typeof element[1] === "string" && firstString === 0) {
      firstString = i;
    }
  });

  document.getElementById("display").innerHTML = tempElem;

  updateCoordinates(arr, secondString);
}

connectWebSocket();
