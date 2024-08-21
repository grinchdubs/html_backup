let ws = new WebSocket("wss://tdcontrol.onrender.com");

let controllTD = document.querySelector(".controllTD");
controllTD.addEventListener(
  "input",
  (event) => {
    ws.send(JSON.stringify({ slider1: controllTD.value / 100 }));
  },
  false
);

let controlledByTD = document.querySelector(".controlledByTD");

ws.addEventListener("open", (event) => {
  console.log("Socket connection open");
  // alert('Successfully connected to socket server 🎉');
  ws.send("pong");
});

ws.addEventListener("message", (message) => {
  if (message && message.data) {
    if (message.data === "ping") {
      console.log("got ping");
      ws.send("pong");
      return;
    }
    let data = JSON.parse(message.data);
    if (data) {
      if ("slider1" in data) {
        controlledByTD.value = data["slider1"] * 100;
      }
      console.log("got data", data);
    }
  }
  console.log("message", message);
});

ws.addEventListener("error", (error) => {
  console.error("Error in the connection", error);
  alert("error connecting socket server", error);
});

ws.addEventListener("close", (event) => {
  console.log("Socket connection closed");
  alert("closing socket server");
});
