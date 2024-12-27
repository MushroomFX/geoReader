function updateCoordinates(arr, secondString) {
    let lat = arr[1][secondString + 2][1];
    let long = arr[1][secondString + 3][1];
  
    if (typeof arr[1][secondString + 1][1] !== "string") {
      lat = arr[1][secondString + 1][1];
      long = arr[1][secondString + 2][1];
    }
    console.log(arr)
    console.log(lat,long)
  
    document.getElementById("lat").innerHTML = lat;
    document.getElementById("long").innerHTML = long;
  
    document.getElementById("streetView").href = `https://www.google.com/maps?q&layer=c&cbll=${limitFloat(lat)},${limitFloat(long)}&cbp=0,undefined,0,0,undefined`;
    document.getElementById("streetMap").href = openStreetMap(lat, long);
    document.getElementById("streetMapEmbed").src = openStreetMapEmbed(lat, long);
    document.getElementById("streetMapEmbed").style.width = "100%"
    document.getElementById("streetMapEmbed").style.height = "auto"
    document.getElementById("streetMapEmbed").style.minHeight = "50vh";
  }
  
  function openStreetMap (lat, lon){
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`;
  };

  function openStreetMapEmbed(lat,long){
    const latDiff = 0.005
    const lonDiff = 0.02
    return `https://www.openstreetmap.org/export/embed.html?bbox=${long-lonDiff}%2C${lat-latDiff}%2C${long+lonDiff}%2C${lat+latDiff}&layer=mapnik&marker=${lat}%2C${long}`
  }
