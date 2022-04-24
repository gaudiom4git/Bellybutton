function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("../resources/samples.json").then((data) => {

    var sampleNames = data.names;
    console.log("Start Init");
    console.log(sampleNames);

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("../resources/samples.json").then((data) => {
    var metadata = data.metadata;
    console.log("Metadata");
    console.log(metadata);
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("../resources/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    console.log("MetaDataResult0");
    console.log(samples);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    console.log("FilteredArray");
    console.log(resultArray);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
  
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var OTUID10 = result.otu_ids.slice(0,10).map(OTUIDX => `OT ${OTUIDX}`).reverse();
    var OTULABELS10 = result.otu_labels.slice(0,10).reverse();
    var OTUVALUES10 = result.sample_values.slice(0,10).reverse();

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    console.log(OTUID10);
    console.log(result.otu_ids);
    var yticks = OTUID10;

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: OTUVALUES10,
      y: yticks,
      text: OTULABELS10,
      type: "bar",
      orientation: 'h'
    }];
    console.log("BarData X");
    console.log(OTUVALUES10);
    console.log("BarData Y");
    console.log(OTUID10);
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>" + "Top 10 Bacteria Cultures Found" + "</b>",
      xaxis: {title: "Frequency" },
      yaxis: {title: "Bacteria ID"}
    };
    // 10. Use Plotly to plot the data with the layout.
      Plotly.newPlot("bar", barData, barLayout);


  // 1. Create the trace for the bubble chart.
  var OTUID = result.otu_ids;
  var OTULABELS = result.otu_labels;
  var OTUVALUES = result.sample_values;
  console.log('BubbleChart Time')
  console.log('OTUVALUES ',OTUVALUES);
  var bubbleData = [{
    x: OTUID,
    y: OTUVALUES,
    text: OTULABELS,
    mode: 'markers',
    marker: {
      size: OTUVALUES,
      color: OTUID
    }
  }];
  // 2. Create the layout for the bubble chart.
  var bubbleLayout = {
    title: '<b>' + 'Bacteria Cultures Per Sample' + '</b>', 
    showlegend: false,
    height: 600,
    width: 1200,
  };
  // 3. Use Plotly to plot the data with the layout.
  Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
  //
  // 4. Create the trace for the gauge chart.
  console.log("In Gauge");
  d3.json("../resources/samples.json").then((data) => {
    var MetaData2 = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = MetaData2.filter(sampleObj => sampleObj.id == sample);
    var result2 = resultArray[0].wfreq;
    console.log(result2);
    console.log("convert to float");
    console.log(parseFloat(result2));

    var gaugeData = [
      { 
        domain: { x: [0, 1], 
        y: [0, 1] },
        value: result2,
        title: { text: "<b>" + "Belly Button Washing Frequency" + "</b>" + "<br>" + "Scrubs per Week" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10] },
          bar: { color: "black" },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" }
          ]
          // threshold: {
          //   line: { color: "black", width: 4 },
          //   thickness: 0.75,
          //   value: result2
          // }
        }
      }
    ];
  
  // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600, 
      height: 450, 
      margin: { t: 0, b: 0 } 
    };

  // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout);
  })
});  
}
