const fs = require("fs");
const path = require("path");

const settingsFilePath = path.join(__dirname, "settings.cfg");

let settings;

fs.readFile(settingsFilePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading settings file:", err);
    return;
  }

  try {
    settings = JSON.parse(data.replace(/\\/g, "\\\\"));
    console.log("Settings:", settings);
    init();
  } catch (error) {
    console.error("Error parsing settings file:", error);
  }
});

function init() {
  setTimeout(() => {
    startServer();
  });
  setTimeout(() => {
    openSite();
  });
}

function findFilesWithSearchString(directory, searchString, clients) {
  let matchingFiles = [];

  function searchFiles(dir) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      if (file.includes(searchString)) {
        matchingFiles.push(path.join(dir, file));
      }
    });
  }
  searchFiles(directory);

  matchingFiles.forEach((file) => {
    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading settings file:", err);
        return;
      }
      try {
        readArray(data, clients);

        fs.unlink(file, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          }
          console.log("File deleted successfully.");
        });
      } catch (error) {
        console.error("Error parsing settings file:", error);
      }
    });
  });
}

function flattenArray(arr) {
  let result = [];

  arr.forEach((element) => {
    if (Array.isArray(element)) {
      result = result.concat(flattenArray(element));
    } else {
      result.push(element);
    }
  });

  return result;
}

function findDuplicates(arr) {
  let duplicates = [];
  let singles = [];
  let seen = {};

  for (let i = 0; i < arr.length; i++) {
    if (seen[arr[i]]) {
      if (seen[arr[i]] === 1) {
        duplicates.push(arr[i]);
        singles = singles.filter((item) => item !== arr[i]); // Remove from singles if it becomes duplicate
      }
      seen[arr[i]]++;
    } else {
      seen[arr[i]] = 1;
      singles.push(arr[i]);
    }
  }

  return duplicates.concat(singles);
}

function trimString(inputString) {
  const firstParenIndex = inputString.indexOf("(");

  if (firstParenIndex !== -1) {
    const filteredString = inputString.substring(firstParenIndex + 1);
    const lastParenIndex = filteredString.lastIndexOf(")");
    if (lastParenIndex !== -1) {
      return filteredString.substring(0, lastParenIndex);
    }
  }

  return inputString;
}

function filterStrings(arr) {
  return arr.filter((item) => typeof item === "string");
}

function addIndexToArray(array) {
  if (!Array.isArray(array)) {
    console.error("Input is not an array");
    return [];
  }

  const result = array.map((element, index) => [index + 1, element]);

  return result;
}

function readArray(string, clients) {
  const arrOBJ = JSON.parse("[" + trimString(string) + "]");
  const flatArr = flattenArray(arrOBJ);
  const duplicates = findDuplicates(flatArr);
  const indexedArr = [Date.now(), addIndexToArray(duplicates)];

  function sendToAll(message) {
    clients.forEach((client) => {
      client.send(message);
    });
  }

  console.log(indexedArr);
  sendToAll(JSON.stringify(indexedArr));
}

function startServer() {
  const WebSocket = require("ws");

  const wss = new WebSocket.Server({ port: 808 });

  const clients = [];

  wss.on("connection", function connection(ws) {
    clients.push(ws);
    ws.on("close", function close() {
      const index = clients.indexOf(ws);
      if (index > -1) {
        clients.splice(index, 1);
      }
      console.log("Client disconnected");
    });

    setTimeout(() => {
      findFilesWithSearchString(settings.directory, settings.fileName, clients);
      setInterval(() => {
        findFilesWithSearchString(
          settings.directory,
          settings.fileName,
          clients
        );
      }, settings.scanTime);
    }, 1000);
  });
}

function openSite() {
  import("open")
    .then((open) => {
      const path = require("path");

      const filePath = path.resolve(__dirname, "./index.html");

      open.default(filePath);
    })
    .catch((err) => {
      console.error("Error:", err);
    });
}