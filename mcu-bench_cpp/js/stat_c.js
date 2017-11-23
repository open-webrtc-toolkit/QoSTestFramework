var qChart = null;
var qChart2 = null;
var qChart3 = null;



function getQuality() {

    var div1 = document.getElementById("chartQuality");
    var div2 = document.getElementById("chartQuality2");
    var selectfolder = resultfolder.selectedOptions.length;
    if (selectfolder) {
        var strfolder = resultfolder.options[resultfolder.selectedIndex].text;
        $.ajax({
            data: {"folder":strfolder,"file":"quality.txt"},
            url: '/displayData',
            type: 'post',
            cache: false,
            timeout: 800000,
            success: function(data){
                $("#quality-btn").removeAttr('disabled');
                $("#vmaf-btn").removeAttr('disabled');
                $("#NR-btn").removeAttr('disabled');
                var quality = data.data;
                var ctx = document.getElementById("chartQuality").getContext("2d");
                var ctx2 = document.getElementById("chartQuality2").getContext("2d");
                var psnrData = { labels: [], datasets: [ {
                        label: "PSNR",
                        fillColor: "rgba(151,187,205,0.5)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",

                        data: []
                    }]};

                var ssimData = { labels: [], datasets: [ {
                        label: "SSIM",
                        fillColor: "rgba(151,187,205,0.5)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                        data: []
                    }]};

                quality = quality.split(",");
                console.log(quality);
                var fnum = $("#qnum").val();
                fnum = parseInt(fnum);
                for(var i = 0;i < quality.length-1 && i < 2*fnum;i += 2) {
                    quality[0]=quality[0].replace(/\[\'/i, '');
                    psnrData.labels.push(i/2);
                    ssimData.labels.push(i/2);
                    psnrData.datasets[0].data.push(quality[i]);
                    ssimData.datasets[0].data.push(quality[i+1]);
                    //psData.labels.push(quality[i+1]);
                    //psData.labels.push(i/3);
                    //psData.datasets[0].data.push(quality[i+2]);
                }

                if (div1.style.display == 'none') {div1.style.display = 'inline'};
                if (div2.style.display == 'none') {div2.style.display = 'inline'};
               // if (div3.style.display == 'none') {div3.style.display = 'inline'};

                if(qChart != null) qChart.destroy();
                if(qChart2 != null) qChart2.destroy();
               // if(qChart3 != null) qChart3.destroy();
                qChart = new Chart(ctx).Line(psnrData, {responsive: true, maintainAspectRatio: true, scaleShowLabels: true});
                qChart2 = new Chart(ctx2).Line(ssimData, {responsive: true, maintainAspectRatio: true, scaleShowLabels: true});
               // qChart3 = new Chart(ctx3).Line(psData, {responsive: true, maintainAspectRatio: true, scaleShowLabels: true});
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('error : ' + textStatus + " " + errorThrown);
            }
        });
    }else{
        $.ajax({
            data: {"blank" : " "},
            url: '/quality',
            type: 'post',
            cache: false,
            timeout: 800000,
            success: function(data){
                $("#quality-btn").removeAttr('disabled');
                $("#vmaf-btn").removeAttr('disabled');
                $("#NR-btn").removeAttr('disabled');
                var quality = data.quality;
                var ctx = document.getElementById("chartQuality").getContext("2d");
                var ctx2 = document.getElementById("chartQuality2").getContext("2d");
                var psnrData = { labels: [], datasets: [ {
                        label: "PSNR",
                        fillColor: "rgba(151,187,205,0.5)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",

                        data: []
                    }]};

                var ssimData = { labels: [], datasets: [ {
                        label: "SSIM",
                        fillColor: "rgba(151,187,205,0.5)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                        data: []
                    }]};

                quality = quality.split("\n");
                console.log(quality);
                var fnum = $("#qnum").val();
                fnum = parseInt(fnum);
                for(var i = 0;i < quality.length-1 && i < 2*fnum;i += 2) {
                    psnrData.labels.push(i/2);
                    ssimData.labels.push(i/2);
                    psnrData.datasets[0].data.push(quality[i]);
                    ssimData.datasets[0].data.push(quality[i+1]);
                    //psData.labels.push(quality[i+1]);
                    //psData.labels.push(i/3);
                    //psData.datasets[0].data.push(quality[i+2]);
                }

                if (div1.style.display == 'none') {div1.style.display = 'inline'};
                if (div2.style.display == 'none') {div2.style.display = 'inline'};
               // if (div3.style.display == 'none') {div3.style.display = 'inline'};

                if(qChart != null) qChart.destroy();
                if(qChart2 != null) qChart2.destroy();
               // if(qChart3 != null) qChart3.destroy();
                qChart = new Chart(ctx).Line(psnrData, {responsive: true, maintainAspectRatio: true, scaleShowLabels: true});
                qChart2 = new Chart(ctx2).Line(ssimData, {responsive: true, maintainAspectRatio: true, scaleShowLabels: true});
               // qChart3 = new Chart(ctx3).Line(psData, {responsive: true, maintainAspectRatio: true, scaleShowLabels: true});
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('error : ' + textStatus + " " + errorThrown);
            }
        });        
    }
    $("#quality-btn").attr('disabled',' true');
    $("#vmaf-btn").attr('disabled',' true');
    $("#NR-btn").attr('disabled',' true');
}