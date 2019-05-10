/*
This file help you compare different
*/

'use strict'

var selectedResultFolder = [];
var chartMap = new Map()


window.chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(0, 64, 255)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)',
  yellow: 'rgb(255, 255, 0)',
  black: 'rgb(0,0,0)',
  skyblue: 'rgb(0,255,255)',
  bloodred: 'rgb(255,64,0)',
  lightgreen: 'rgb(0,255,0)'
};

function getSizebycount(inputparm) {
  if (inputparm == 1) return 1;
  if (inputparm > 1 && inputparm <= 4) return 2; // 2x2
  if (inputparm > 4 && inputparm <= 9) return 3;
  if (inputparm > 9) return 4;
}

function getHeader() {
  return {
    "Authorization": $("#authorization").val()
  }
}

function getCompareResultFolder() {
  let resultfolder = document.getElementById("resultfolder");
  let size = resultfolder.length
  for (var i = 0; i < size; i++) {
    resultfolder.remove(0)
  }
  doPost('/getCompareResultFolder', {
    "blank": " "
  }, getHeader(), 800000)
    .then(function(data) {
      let folders = data.folder.split("\n")
      for (let i = 0; i < folders.length; i++) {
        let optiondevice = document.createElement('option');
        optiondevice.text = folders[i]
        optiondevice.value = folders[i]
        resultfolder.add(optiondevice, null)
      }
    }).catch(function(err) {
      alert(err);
    })
}

function getSelectedResultFolder() {
  let resultfolder = document.getElementById("resultfolder");
  let selectfolder = resultfolder.selectedOptions.length;
  if (selectfolder) {
    let strfolder = resultfolder.options[resultfolder.selectedIndex].text;
    doPost('/getCompareResultFolder', {
      "folder": strfolder
    }, getHeader(), 800000)
      .then(function(data) {
        selectedResultFolder = data.folder.split("\n")
      }).catch(function(err) {
        alert(err);
      })
  }
}

function getComparedResult(canvasId, resultFile, thresholdId) {
  let chartName = canvasId
  let dataArray = [];
  let dataFolder;
  let nLength = parseInt($("#maxFrame").val());
  if (isNaN(fCount) || fCount < 0 || fCount > Number.MAX_SAFE_INTEGER) {
    console.log('max frame size must be a int or must big then zero and smaller then MAX_SAFE_INTEGER')
    return
  }
  let threshold = parseFloat($("#" + thresholdId).val());
  if (isNaN(threshold)) {
    console.log('threshold must be a Float')
    return
  }
  if (selectedResultFolder.length) {
    for (let k = 0; k < selectedResultFolder.length - 1; k++) {
      selectedResultFolder[k].trim();
      dataArray.push(selectedResultFolder[k]);
      dataFolder = dataArray.join();
    }
    doPost('/displayData', {
      "folder": dataFolder,
      "file": resultFile
    }, getHeader(), 20000)
      .then(function(data) {
        let aArray = data.data.split("#");
        let nAverage = 0;
        let currentSets = {
          labels: [],
          datasets: []
        };
        let colorNames = Object.keys(window.chartColors);
        // increase dataset
        for (let k = 0; k < selectedResultFolder.length - 1; k++) {
          let colorName = colorNames[currentSets.datasets.length % colorNames
            .length];
          let newColor = window.chartColors[colorName];
          let newDataset = {
            label: selectedResultFolder[k],
            backgroundColor: newColor,
            borderColor: newColor,
            data: [],
            fill: false
          };
          currentSets.datasets.push(newDataset);
        }
        let lastlength = 0;
        for (let j = 0; j < aArray.length; j++) {
          let nNum = 0;
          if (aArray.length > 1 && aArray.length == j + 1) {
            break;
          }
          let currentData = aArray[j].split(',');
          if (currentData.length > lastlength) {
            currentSets.labels = [];
          }
          currentData[0] = currentData[0].replace(/\[\'/i, '');
          for (let i = 0; i < currentData.length; i++) {
            if (nNum > nLength) {
              break;
            }
            currentData[i] = currentData[i].replace(/\'/i, '');
            if (currentData[i] != null && !(currentData[i].trim() == '')) {
              if (currentData[i] > threshold) continue;
              if (currentData.length > lastlength) {
                currentSets.labels.push(i);
              }
              currentSets.datasets[j].data.push(currentData[i]);
              nAverage = nAverage + parseFloat(currentData[i]);
              nNum++;
            }
          }
          if (currentData.length > lastlength) {
            lastlength = currentData.length;
          }
        }
        if (chartMap.has(chartName)) chartMap.get(chartName).destroy();
        chartMap.set(chartName, draw(canvasId, chartName, currentSets))
      }).catch(function(err) {
        alert(err);
      })
  }
}
