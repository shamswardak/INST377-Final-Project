async function mainEvent() {
    const form = document.querySelector("#date_form");
    const tableBody = document.querySelector("#earthquake_table tbody");
    const refreshTableData = document.getElementById("refresh");
    const reset = document.getElementById("reset");
    const sortByMagnitude = document.getElementById("sort_by_magnitude");
    const top10Quakes = [];

    var map = L.map("map").setView([1, 1], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "Map data &copy; OpenStreetMap contributors",
      maxZoom: 18,
    }).addTo(map);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        tableBody.innerHTML = "";

        const month = localStorage.getItem('selectedMonth'); //load input data from local storage
        const year = localStorage.getItem('selectedYear');

        const startDate = new Date(year, month-1, 1).toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'});
        const endDate = new Date(year, month, 0).toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'});

        fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDate}&endtime=${endDate}`) //An asynchronous data request to my API
        .then((response) => response.json())
        .then((data) => {
          data.features.forEach((earthquake) => {
            const { mag, place, time } = earthquake.properties;
            const { coordinates } = earthquake.geometry;
            const row = document.createElement("tr");
            row.innerHTML = `<td>${new Date(time)}</td><td>${mag}</td><td>${place}</td>`;
            tableBody.appendChild(row);
            top10Quakes.push({mag,place,coordinates,});
          });
          top10Quakes.sort((quake1, quake2) => quake2.mag - quake1.mag);

          top10Quakes.slice(0, 10).forEach((quake) => {
          const { coordinates, mag, place, time } = quake;
          const [longitude, latitude] = coordinates;
          createMarker(latitude, longitude, mag, place, time);
          });
        });
      });
      
      function createMarker(latitude, longitude, mag, place, time) {
      const marker = L.marker([latitude, longitude]).addTo(map);
      marker.bindPopup(`<strong>Magnitude:</strong> ${mag}<br><strong>Place:</strong> ${place}<br><strong>Time:</strong> ${new Date(time)}`);
      }

      function sortTableByMagnitude() {
      const rows = Array.from(tableBody.querySelectorAll("tr"));

      rows.sort((row1, row2) => {
      const magnitude1 = parseFloat(row1.querySelector("td:nth-child(2)").textContent);
      const magnitude2 = parseFloat(row2.querySelector("td:nth-child(2)").textContent);

      if (isNaN(magnitude1)) {
        return 1; // Treat null or non-numeric value as lower magnitude
      }

      if (isNaN(magnitude2)) {
        return -1; // Treat null or non-numeric value as lower magnitude
      }

      return magnitude2 - magnitude1; // Sort in descending order
    });

    rows.forEach((row) => {
      tableBody.appendChild(row);
    });
  }

      sortByMagnitude.addEventListener("click", (event) => {
        event.preventDefault();
        sortTableByMagnitude();
      });

      
      refreshTableData.addEventListener("click", (event) => {
        event.preventDefault();
        localStorage.clear();
        window.location.href = "index.html";
      });
    
    }
    
    document.addEventListener("DOMContentLoaded", async () => {
      await mainEvent();
    });