async function mainEvent() {
    const form = document.querySelector("#date_form");
    const tableBody = document.querySelector("#earthquake_table tbody");
  
  

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const month = localStorage.getItem('selectedMonth');
        const year = localStorage.getItem('selectedYear');

        const startDate = new Date(year, month-1, 1).toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'});
        const endDate = new Date(year, month, 0).toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'});

        fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDate}&endtime=${endDate}`) //An asynchronous data request to my API
        .then((response) => response.json())
        .then((data) => {
          data.features.forEach((earthquake) => { // A processing request that uses array methods (forEach array method that iterates over each feature inside of an earthquake array)
            const { mag, place, time } = earthquake.properties;
            const row = document.createElement("tr");
            row.innerHTML = `<td>${time}</td><td>${mag}</td><td>${place}</td>`;
            tableBody.appendChild(row);
          })
        })
      })

  }
    
document.addEventListener("DOMContentLoaded", async () => {
    await mainEvent();
})
      