
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and create the dropdown menu
d3.json(url).then(function (data) {
  console.log(data);
  buildDropdownMenu(data.names);
});

// Function to build the dropdown menu with options
function buildDropdownMenu(names) {
  const dropdownMenu = d3.select("#selDataset");

  // Populate the dropdown menu with options
  names.forEach((name) => {
    dropdownMenu.append("option").text(name).property("value", name);
  });

  // Add event listener to the dropdown menu to handle changes
  dropdownMenu.on("change", function () {
    const selectedSample = dropdownMenu.property("value");
    buildCharts(selectedSample); // Call the buildCharts function with the selected sample
    displaySampleMetadata(selectedSample);
  });

  // Initialize the charts and sample metadata with the first sample as default
  buildCharts(names[0]);
  displaySampleMetadata(names[0]);
}

// Function to build both bar chart and bubble chart
function buildCharts(selectedSample) {
  // Fetch the JSON data again to get the required sample data and metadata
  d3.json(url).then(function (data) {
    const selectedSampleData = data.samples.find((sample) => sample.id === selectedSample);
    const selectedSampleMetadata = data.metadata.find((sample) => sample.id === parseInt(selectedSample));

    // Build the bar chart
    const topTenSampleValues = selectedSampleData.sample_values.slice(0, 10).reverse();
    const topTenOTUIds = selectedSampleData.otu_ids.slice(0, 10).reverse().map((otuId) => `OTU ${otuId}`);
    const topTenOTULabels = selectedSampleData.otu_labels.slice(0, 10).reverse();

    const trace1 = {
      x: topTenSampleValues,
      y: topTenOTUIds,
      text: topTenOTULabels,
      type: "bar",
      orientation: "h",
    };

    const layout = {
      title: "Top 10 OTUs",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" },
    };

    Plotly.newPlot("bar", [trace1], layout);

    // Build the bubble chart
    const trace2 = {
      x: selectedSampleData.otu_ids,
      y: selectedSampleData.sample_values,
      text: selectedSampleData.otu_labels,
      mode: "markers",
      marker: {
        size: selectedSampleData.sample_values,
        color: selectedSampleData.otu_ids,
        colorscale: "Earth",
      },
    };

    const layout2 = {
      title: "Sample Biodiversity",
      xaxis: { title: "OTU IDs" },
      yaxis: { title: "Sample Values" },
    };

    Plotly.newPlot("bubble", [trace2], layout2);

    // Build the gauge chart
    const washFrequency = selectedSampleMetadata.wfreq;

    const trace3 = {
      type: "indicator",
      mode: "gauge+number",
      value: washFrequency,
      title: { text: "Belly Button Weekly Washing Frequency", font: { size: 18 } },
      gauge: {
        axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "darkblue" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 1], color: "#f8f3ec" },
          { range: [1, 2], color: "#f4f1e5" },
          { range: [2, 3], color: "#e9e6c9" },
          { range: [3, 4], color: "#e5e8b0" },
          { range: [4, 5], color: "#d5e599" },
          { range: [5, 6], color: "#b7cd8f" },
          { range: [6, 7], color: "#8ac086" },
          { range: [7, 8], color: "#89bc8d" },
          { range: [8, 9], color: "#84b589" },
        ],
      },
    };

    const layout3 = { width: 500, height: 400, margin: { t: 25, r: 25, l: 25, b: 25 } };

    Plotly.newPlot("gauge", [trace3], layout3);
  });
}

// Function to display sample metadata
function displaySampleMetadata(selectedSample) {
  // Fetch the JSON data again to get the required metadata
  d3.json(url).then(function (data) {
    const selectedSampleMetadata = data.metadata.find((sample) => sample.id === parseInt(selectedSample));

    // Clear previous metadata
    const metadataContainer = d3.select("#sample-metadata");
    metadataContainer.html("");

    // Populate the metadata panel with the selected sample's information
    Object.entries(selectedSampleMetadata).forEach(([key, value]) => {
      metadataContainer.append("p").text(`${key}: ${value}`);
    });
  });
}







    
    
    
    

  





  