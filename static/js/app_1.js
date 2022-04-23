// import the data from data.js
const tableData = data;
// Reference the HTML table using d3
var tbody = d3.select("tbody");
// Simple JavaScript console.log statement
function printHello() {
    console.log("Hello there!");
  }
// 11.5.2 - Add forEach to Your Table
//Build Table function
function buildTable(data) {
    // Clear out any existing data
    tbody.html("");

    //Loop through each object in the data
    // and append  a row and cells for each value in the row
    data.forEach((dataRow) => {
        // Append a row to the table body
        let row = tbody.append("tr");

        // Loop through each field in the dataRow and add
        // each value as a talbe cell (td)
        Object.values(dataRow).forEach((val) => {
            let cell = row.append("td");
            cell.text(val);
        });
    });
}
// 11.5.3 - D3 Add a button for Click
function handleClick() {
    // Look for datetime id in HTML tags and grab value (property) and place in
    // date variable.
    let date = d3.select("#datetime").property("value");
    let filteredData = tableData;
    // 11.5.4
    // Check to see if a date was entered and filter the
    // data using that date.
    if (date) {
        filteredData = filteredData.filter(row => row.datetime === date);
    };
    // Rebuild the table using the filtered data
    // @NOTE: If no date was entered, then filteredData will
    // just be the original tableData.
    buildTable(filteredData);
}
// Listen for the click
// filter-btn name in our HTML that will execute this when clicked.
d3.selectAll("#filter-btn").on("click", handleClick);

// Build the table when the page loads
buildTable(tableData);