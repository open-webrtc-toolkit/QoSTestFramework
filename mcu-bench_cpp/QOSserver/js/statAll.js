/*
This file help you compare different 
*/
'use strict'

var selectedResultFolder=[];

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



function getSizebycount(inputparm){
    if(inputparm==1) return 1;
    if(inputparm>1 && inputparm<=4) return 2; //2x2
    if(inputparm>4 && inputparm<=9) return 3;
    if(inputparm>9) return 4;
}



function getCompareResultFolder(){
    var resultfolder=document.getElementById("resultfolder");
    var size = resultfolder.length
    console.log(size)
    for(var i = 0;i<size ;i++){
        resultfolder.remove(0)
    }
    $.ajax({
        data: {"blank" : " "},
        url: '/getCompareResultFolder',
        type: 'post',
        cache: false,
        timeout: 800000,
        async:true,
        success: function(data){
            var folders = data.folder.split("\n")
            console.log(data.folder)
            for(var i = 0;i<folders.length;i++){
                var optiondevice=document.createElement('option');
                optiondevice.text=folders[i]
                optiondevice.value=folders[i]
                resultfolder.add(optiondevice,null)
            }
      
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error : ' + textStatus + " " + errorThrown);
        },
    });
}




function getSelectedResultFolder(){
    var resultfolder=document.getElementById("resultfolder");
    var selectfolder = resultfolder.selectedOptions.length;
    if (selectfolder) {
        var strfolder = resultfolder.options[resultfolder.selectedIndex].text;
        $.ajax({
            data: {"folder" : strfolder},
            url: '/getCompareResultFolder',
            type: 'post',
            cache: false,
            timeout: 800000,
            async:true,
            success: function(data){
                selectedResultFolder = data.folder.split("\n")
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('error : ' + textStatus + " " + errorThrown);
            },
        });
  }
}


function getComparedResult(chartName,resultFile,threshold,) {
    var div4 = document.getElementById(chartName);
    var dataArray = [];
    var dataFolder;
    if (selectedResultFolder.length) {
        for(var k = 0;k < selectedResultFolder.length-1;k++) {
             selectedResultFolder[k].trim();
             dataArray.push(selectedResultFolder[k]);
             dataFolder=dataArray.join();
             console.log(dataFolder);
         }
        $.ajax({
        data: {"folder":dataFolder,"file":resultFile},
        url: '/displayData',
        type: 'post',
        cache: false,
        timeout: 20000,
        success: function(data){
            var aArray = data.data.split("#");
            var nAverage = 0;
            var nNum = 0;
            var ctx = document.getElementById(chartName).getContext("2d");
            var currentSets = { labels: [], datasets: []};
            var nLength = $("#jnum").val();
            nLength = parseInt(nLength);
            var fThreshold = $("#".threshold).val();
            fThreshold = parseFloat(fThreshold);
            var colorNames = Object.keys(window.chartColors);
                //increase dataset
            for(var k = 0;k < selectedResultFolder.length-1;k++) {             
                var colorName = colorNames[currentSets.datasets.length % colorNames.length];
                var newColor = window.chartColors[colorName];
                var newDataset = {
                    label: selectedResultFolder[k],
                    backgroundColor: newColor,
                    borderColor: newColor,
                    data: [],
                    fill: false
            };
            currentSets.datasets.push(newDataset);
            }
            var lastlength=0;
            for(var j = 0;j < aArray.length-1;j++) {
                currentData= aArray[j].split(',');
                if (currentData.length > lastlength) {
                currentSets.labels=[];
                }
                for(var i = 0;i < currentData.length-1 && i < nLength;i++) {
                    currentData[0]=currentData[0].replace(/\[\'/i, '');
                    currentData[i]=currentData[i].replace(/\'/i, '');
                    //if(currentData[i] > threshold) continue;
                    if (currentData[i]!=null && !(currentData[i].trim()==''))
                    {
                        console.log("currentData is",currentData[i]);
                        if (currentData.length > lastlength) {

                           currentSets.labels.push(i);                                  
                        }
                        currentSets.datasets[j].data.push(currentData[i]);
                        nAverage = nAverage + parseFloat(currentData[i]);

                        nNum++;
                    }
                    console.log(currentData[i]);
                 
                }
                console.log("currentData.length is", currentData.length);
                console.log("lastlength is", lastlength);
                if (currentData.length > lastlength) {
                 lastlength =currentData.length; 
                }
           }
            nAverage = parseFloat(nAverage/nNum);
            if (div4.style.display == 'none') {div4.style.display = 'inline'};
              Chart.Line(ctx, {
                data: currentSets,

                options: {
                    responsive: true,
                    title:{
                        display:true,
                        text:chartName,
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
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error : ' + textStatus + " " + errorThrown);
        }
    });
    }


}






