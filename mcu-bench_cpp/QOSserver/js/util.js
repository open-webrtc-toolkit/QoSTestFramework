'use strict'

function doPost(url, data, timeout) {
  return new Promise((resolve, reject) => {
    $.ajax({
      data: data,
      url: url,
      type: 'post',
      cache: false,
      timeout: timeout,
      async: true,
      success: function(data) {
        resolve(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        reject('error : ' + textStatus + " " + errorThrown);
      },
    });
  });
}

function draw(canvasId, chartName, data) {
  let div = document.getElementById(canvasId);
  let cxt = document.getElementById(canvasId).getContext("2d");
  if (div.style.display == 'none') {
    div.style.display = 'inline'
  }
  return Chart.Line(cxt, {
    data: data,
    options: {
      responsive: true,
      title: {
        display: true,
        text: chartName,
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
          }
        }]
      }
    }
  })
}

function initChartDate(labelName, Color) {
  return {
    labels: [],
    datasets: [{
      label: labelName,
      backgroundColor: Color,
      borderColor: Color,
      data: [],
      fill: false
    }]
  };
}
