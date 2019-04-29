/*
This file could help you collect the video data and
get some parameters about your peer connection
*/
'use strict'

var chartMap = new Map()
var Color = 'rgb(255, 99, 132)';


function startVideoQualityMeasureTesting() {
    $.ajax({
        data: {
            "blank": " "
        },
        url: '/startTest',
        type: 'post',
        cache: false,
        async: true,
        timeout: 400000,
    });
}

function stopVideoQualityMeasureTesting() {
    $.ajax({
        data: {
            "blank": " "
        },
        url: '/stopTest',
        type: 'post',
        cache: false,
        async: true,
        timeout: 400000,
    });
}

function getResultFolder() {
    let resultfolder = document.getElementById("resultfolder");
    let size = resultfolder.length
    for (let i = 0; i < size; i++) {
        resultfolder.remove(0)
    }
    doPost('/getResultFolder', {
            "blank": " "
        }, 800000)
        .then(function (data) {
            let folders = data.folder.split("\n")
            for (var i = 0; i < folders.length; i++) {
                let optiondevice = document.createElement('option');
                optiondevice.text = folders[i]
                optiondevice.value = folders[i]
                resultfolder.add(optiondevice, null)
            }
        }).catch(function (error) {
            alert('error : ' + error);
        })
}

function getQuality(thresholdId) {
    let resultfolder = document.getElementById("resultfolder");
    let fCount = parseInt($("#maxFrame").val());
    if (isNaN(fCount)) {
        fCount = 30
    }
    let threshold = parseFloat($("#" + thresholdId).val());
    if (isNaN(threshold)) {
        threshold = 1000
    }
    let selectfolder = resultfolder.selectedOptions.length;
    let psnrArray = new Array()
    let ssimArray = new Array()
    let psnrData = initChartDate("PSNR Chart", Color)
    let ssimData = initChartDate("SSIM Chart", Color)
    $("#quality-btn").attr('disabled', ' true');
    $("#vmaf-btn").attr('disabled', ' true');
    $("#NR-btn").attr('disabled', ' true');
    if (selectfolder) {
        let strfolder = resultfolder.options[resultfolder.selectedIndex].text;
        doPost('/displayData', {
                "folder": strfolder,
                "file": "quality.txt"
            }, 800000)
            .then(function (data) {
                $("#quality-btn").removeAttr('disabled');
                $("#vmaf-btn").removeAttr('disabled');
                $("#NR-btn").removeAttr('disabled');
                let quality = data.data.split(",");
                quality[0] = quality[0].replace(/\[\'/i, '');
                for (let i = 0; i < quality.length - 1; i += 2) {
                    if (quality[i] != '') {
                        psnrArray.push(quality[i]);
                        ssimArray.push(quality[i + 1]);
                    }
                }
                setData("psnr", "chartPsnr", "PSNR Chart", psnrData, psnrArray, fCount, threshold);
                setData("ssim", "chartSsim", "SSIM Chart", ssimData, ssimArray, fCount, threshold);
            }).catch(function (error) {
                alert('error : ' + error);
            })
    } else {
        doPost('/quality', {
                "blank": " "
            }, 800000)
            .then(function (data) {
                $("#quality-btn").removeAttr('disabled');
                $("#vmaf-btn").removeAttr('disabled');
                $("#NR-btn").removeAttr('disabled');
                let quality = data.quality.split("\n");
                quality[0] = quality[0].replace(/\[\'/i, '');
                for (let i = 0; i < quality.length - 1; i += 2) {
                    if (quality[i] != '') {
                        psnrArray.push(quality[i]);
                        ssimArray.push(quality[i + 1]);
                    }
                }
                setData("psnr", "chartPsnr", "PSNR Chart", psnrData, psnrArray, fCount, threshold);
                setData("ssim", "chartSsim", "SSIM Chart", ssimData, ssimArray, fCount, threshold);
            }).catch(function (error) {
                alert('error : ' + error);
            })
    }
}

/*
 * it's an API
 * User use this function to set data and draw picture
 */
function setData(chartName, canvasId, chartTitle, chartData, dataList, fCount, threshold, avgId = undefined) {
    let average = 0;
    let num = 0;
    for (let i = 0; i < dataList.length - 1 && num < fCount; i++) {
        if (dataList[i] > threshold) continue;
        dataList[0] = dataList[0].replace(/\[\'/i, '');
        if (dataList[i] != "") {
            chartData.labels.push(i);
            chartData.datasets[0].data.push(dataList[i]);
            average = average + parseFloat(dataList[i]);
            num++;
        }
    }
    if (avgId != undefined) {
        average = parseFloat(average / num);
        console.log("average:",average)
        $('#' + avgId).val(average);
    }
    if (chartMap.has(chartName)) chartMap.get(chartName).destroy();
    chartMap.set(chartName, draw(canvasId, chartTitle, chartData))
}

/*
 * it's an API
 * User use this function to get date
 */
function getData(canvasId, thresholdId, chartName, avgId = undefined) {
    let resultfolder = document.getElementById("resultfolder");
    let selectfolder = resultfolder.selectedOptions.length;
    let fCount = parseInt($("#maxFrame").val());
    if (isNaN(fCount)) {
        fCount = 30
    }
    let threshold = parseFloat($("#" + thresholdId).val());
    if (isNaN(threshold)) {
        threshold = 1000
    }
    let chartData = initChartDate(chartName, Color);
    let fileName = undefined;
    let chartTitle = undefined;
    let dataList = undefined;
    let url = undefined;
    if (chartName === 'jitter') {
        fileName = 'jitter.txt';
        chartTitle = 'Jitter Chart';
        url = '/jitter'
    } else if (chartName === 'latency') {
        fileName = 'latency.txt';
        chartTitle = 'Latency Chart';
        url = '/latency'
    } else if (chartName === 'fps') {
        fileName = 'fps.txt';
        chartTitle = 'Fps Chart';
        url = '/fps'
    } else if (chartName === 'bitrate') {
        fileName = 'bitrate.txt';
        chartTitle = 'Bitrate Chart';
        url = '/bitrate'
    } else if (chartName === 'vmaf') {
        fileName = 'VMAF_score';
        chartTitle = 'Vmaf Chart';
        url = '/vmaf'
    }
    if (selectfolder) {
        let strfolder = resultfolder.options[resultfolder.selectedIndex].text;
        doPost('/displayData', {
                "folder": strfolder,
                "file": fileName
            }, 20000)
            .then(function (data) {
                dataList = data.data.split(",");
                setData(chartName, canvasId, chartTitle, chartData, dataList, fCount, threshold, avgId);
            }).catch(function (error) {
                alert('error : ' + error);
            })
    } else {
        doPost(url, {
                "blank": " "
            }, 20000)
            .then(function (data) {
                if (chartName === 'jitter') {
                    dataList = data.jitter.split("\n")
                } else if (chartName === 'latency') {
                    dataList = data.latency.split("\n")
                } else if (chartName === 'fps') {
                    dataList = data.fps.split("\n")
                } else if (chartName === 'bitrate') {
                    dataList = data.bitrate.split("\n")
                } else if (chartName === 'vmaf') {
                    dataList = data.vmaf.split("\n")
                }
                setData(chartName, canvasId, chartTitle, chartData, dataList, fCount, threshold, avgId);
            }).catch(function (error) {
                alert('error : ' + error);
            })
    }
}

function getNR() {
    let resultfolder = document.getElementById("resultfolder");
    let selectfolder = resultfolder.selectedOptions.length;
    let fCount = parseInt($("#maxFrame").val());
    if (isNaN(fCount)) {
        fCount = 30
    }
    let BlockinessData = initChartDate("blockiness", Color);
    let BlocklossData = initChartDate("Blockloss", Color);
    let BlurData = initChartDate("Blur", Color);
    let NoiseData = initChartDate("Noise", Color);
    let InterlaceData = initChartDate("Interlace", Color);
    let FreezeData = initChartDate("Freeze", Color);
    let index = 0
    if (selectfolder) {
        let strfolder = resultfolder.options[resultfolder.selectedIndex].text;
        doPost('/displayData', {
                "folder": strfolder,
                "file": "NR_score"
            }, 800000)
            .then(function (data) {
                let NR = data.data.split(",");
                NR[0] = NR[0].replace(/\[\'/i, '');
                for (let i = 0; i < NR.length - 1 && index < fCount; i += 6) {
                    BlockinessData.labels.push(i / 6);
                    BlocklossData.labels.push(i / 6);
                    BlurData.labels.push(i / 6);
                    NoiseData.labels.push(i / 6);
                    InterlaceData.labels.push(i / 6);
                    FreezeData.labels.push(i / 6);
                    BlockinessData.datasets[0].data.push(NR[i]);
                    BlocklossData.datasets[0].data.push(NR[i + 1]);
                    BlurData.datasets[0].data.push(NR[i + 2]);
                    NoiseData.datasets[0].data.push(NR[i + 3]);
                    InterlaceData.datasets[0].data.push(NR[i + 4]);
                    FreezeData.datasets[0].data.push(NR[i + 5]);
                    index ++ ;
                }

                if (chartMap.has('blockinessChart')) chartMap.get('blockinessChart').destroy();
                if (chartMap.has('blocklossChart')) chartMap.get('blocklossChart').destroy();
                if (chartMap.has('blurChart')) chartMap.get('blurChart').destroy();
                if (chartMap.has('noiseChart')) chartMap.get('noiseChart').destroy();
                if (chartMap.has('interlaceChart')) chartMap.get('interlaceChart').destroy();
                if (chartMap.has('FreezeChart')) chartMap.get('FreezeChart').destroy();

                chartMap.set('blockinessChart', draw('chartNR1', 'Blockiness Chart', BlockinessData))
                chartMap.set('blocklossChart', draw('chartNR2', 'BlocklossData Chart', BlocklossData))
                chartMap.set('blurChart', draw('chartNR3', 'BlurData Chart', BlurData))
                chartMap.set('noiseChart', draw('chartNR4', 'NoiseData Chart', NoiseData))
                chartMap.set('interlaceChart', draw('chartNR5', 'InterlaceData Chart', InterlaceData))
                chartMap.set('FreezeChart', draw('chartNR6', 'FreezeData Chart', FreezeData))
            }).catch(function (error) {
                alert('error : ' + error);
            })
    } else {
        doPost('/NR', {
                "blank": " "
            }, 800000)
            .then(function (data) {
                let NR = data.NR.split("\n");
                NR[0] = NR[0].replace(/\[\'/i, '');
                for (let i = 0; i < NR.length - 1; i += 6) {
                    BlockinessData.labels.push(i / 6);
                    BlocklossData.labels.push(i / 6);
                    BlurData.labels.push(i / 6);
                    NoiseData.labels.push(i / 6);
                    InterlaceData.labels.push(i / 6);
                    FreezeData.labels.push(i / 6);
                    BlockinessData.datasets[0].data.push(NR[i]);
                    BlocklossData.datasets[0].data.push(NR[i + 1]);
                    BlurData.datasets[0].data.push(NR[i + 2]);
                    NoiseData.datasets[0].data.push(NR[i + 3]);
                    InterlaceData.datasets[0].data.push(NR[i + 4]);
                    FreezeData.datasets[0].data.push(NR[i + 5]);
                }

                if (chartMap.has('blockinessChart')) chartMap.get('blockinessChart').destroy();
                if (chartMap.has('blocklossChart')) chartMap.get('blocklossChart').destroy();
                if (chartMap.has('blurChart')) chartMap.get('blurChart').destroy();
                if (chartMap.has('noiseChart')) chartMap.get('noiseChart').destroy();
                if (chartMap.has('interlaceChart')) chartMap.get('interlaceChart').destroy();
                if (chartMap.has('FreezeChart')) chartMap.get('FreezeChart').destroy();

                chartMap.set('blockinessChart', draw('chartNR1', 'Blockiness Chart', BlockinessData))
                chartMap.set('blocklossChart', draw('chartNR2', 'BlocklossData Chart', BlocklossData))
                chartMap.set('blurChart', draw('chartNR3', 'BlurData Chart', BlurData))
                chartMap.set('noiseChart', draw('chartNR4', 'NoiseData Chart', NoiseData))
                chartMap.set('interlaceChart', draw('chartNR5', 'InterlaceData Chart', InterlaceData))
                chartMap.set('FreezeChart', draw('chartNR6', 'FreezeData Chart', FreezeData))
            }).catch(function (error) {
                alert('error : ' + error);
            })
    }
}

function getPESQ() {
    let resultfolder = document.getElementById("resultfolder");
    let selectfolder = resultfolder.selectedOptions.length;
    let pesqData = initChartDate("PESQ Chart", Color);
    if (selectfolder) {
        var strfolder = resultfolder.options[resultfolder.selectedIndex].text;
        doPost('/displayData', {
                "folder": strfolder,
                "file": "pesq.txt"
            }, 20000)
            .then(function (data) {
                let pesq = data.data.split(",");
                let average = 0;
                let num = 0;
                pesq[0] = pesq[0].replace(/\[\'/i, '');
                for (let i = 0; i < pesq.length - 1; i++) {

                    pesqData.labels.push(i);
                    pesqData.datasets[0].data.push(pesq[i]);
                    average = average + parseFloat(pesq[i]);
                    num++;
                }
                average = parseFloat(average / num);
                $("#pesq_avg").val(average);
                console.log(pesqData.datasets[0].data);
                draw('chartgoogPESQ', 'PESQ Chart', pesqData);
            }).catch(function (error) {
                alert('error : ' + error);
            })
    } else {
        doPost('/pesq', {
                "blank": " "
            }, 20000)
            .then(function (data) {
                let pesq = data.pesq.split("\n");
                let average = 0;
                let num = 0;
                for (let i = 0; i < pesq.length; i++) {
                    pesqData.labels.push(i);
                    pesqData.datasets[0].data.push(pesq[i]);
                    average = average + parseFloat(pesq[i]);
                    num++;
                }
                average = parseFloat(average / num);
                $("#pesq_avg").val(average);
                console.log(pesqData.datasets[0].data);
                draw('chartgoogPESQ', 'PESQ Chart', pesqData);
            }).catch(function (error) {
                alert('error : ' + error);
            })
    }
}