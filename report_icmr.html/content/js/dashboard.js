/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5970873786407767, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://www.icmr.gov.in/index.html-40"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.icmr.gov.in/index.html-41"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.icmr.gov.in/index.html-42"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.icmr.gov.in/index.html-43"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/index.html-44"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.icmr.gov.in/index.html-45"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.icmr.gov.in/index.html-46"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/index.html-47"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/index.html-48"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.icmr.gov.in/index.html-49"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/aboutus.html-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/aboutus.html-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/aboutus.html-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/aboutus.html-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/aboutus.html-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/aboutus.html-1"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/tender.html-13"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/aboutus.html-8"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/tender.html-12"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/aboutus.html-9"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/tender.html-11"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/aboutus.html-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/tender.html-10"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/aboutus.html-7"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.icmr.gov.in/index.html-50"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/tender.html-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.icmr.gov.in/index.html-10"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.icmr.gov.in/index.html-11"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.icmr.gov.in/index.html-12"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.icmr.gov.in/index.html-13"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.icmr.gov.in/index.html-14"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/tender.html-5"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.icmr.gov.in/index.html-15"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/tender.html-6"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.icmr.gov.in/index.html-16"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/tender.html-7"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.icmr.gov.in/index.html-17"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/tender.html-8"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.icmr.gov.in/index.html-18"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/tender.html-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/index.html-19"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/tender.html-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/tender.html-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/tender.html-4"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.icmr.gov.in/index.html"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/tender.html-9"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/aboutus.html-10"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/index.html-20"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.icmr.gov.in/index.html-21"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/index.html-22"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/index.html-23"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/contactus.html-10"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.icmr.gov.in/index.html-24"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/contactus.html-11"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.icmr.gov.in/index.html-25"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.icmr.gov.in/index.html-26"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/tender.html"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.icmr.gov.in/index.html-27"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.icmr.gov.in/index.html-28"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.icmr.gov.in/index.html-29"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.icmr.gov.in/contactus.html"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/contactus.html-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/contactus.html-4"], "isController": false}, {"data": [0.75, 500, 1500, "https://www.icmr.gov.in/contactus.html-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/contactus.html-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/contactus.html-7"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/contactus.html-8"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/contactus.html-5"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.icmr.gov.in/contactus.html-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/contactus.html-9"], "isController": false}, {"data": [0.75, 500, 1500, "https://www.icmr.gov.in/index.html-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.icmr.gov.in/index.html-30"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.icmr.gov.in/index.html-31"], "isController": false}, {"data": [0.75, 500, 1500, "https://www.icmr.gov.in/index.html-4"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.icmr.gov.in/index.html-32"], "isController": false}, {"data": [0.25, 500, 1500, "https://www.icmr.gov.in/index.html-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.icmr.gov.in/index.html-33"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.icmr.gov.in/index.html-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.icmr.gov.in/index.html-34"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.icmr.gov.in/index.html-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.icmr.gov.in/index.html-35"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.icmr.gov.in/index.html-36"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.icmr.gov.in/index.html-37"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.icmr.gov.in/index.html-38"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.icmr.gov.in/index.html-39"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.icmr.gov.in/contactus.html-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.icmr.gov.in/index.html-8"], "isController": false}, {"data": [0.25, 500, 1500, "https://www.icmr.gov.in/index.html-7"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.icmr.gov.in/index.html-6"], "isController": false}, {"data": [0.75, 500, 1500, "https://www.icmr.gov.in/index.html-5"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.icmr.gov.in/aboutus.html"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.icmr.gov.in/index.html-9"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 102, 0, 0.0, 1161.2843137254904, 69, 15604, 475.0, 2942.6000000000004, 4136.35, 15303.639999999989, 1.606071580405927, 287.0044440059677, 1.999024621510337], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://www.icmr.gov.in/index.html-40", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 360.65730029926334, 1.151012891344383], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-41", 1, 0, 0.0, 1538.0, 1538, 1538, 1538.0, 1538.0, 1538.0, 1538.0, 0.6501950585175553, 155.77378291612484, 0.40129226267880364], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-42", 1, 0, 0.0, 1316.0, 1316, 1316, 1316.0, 1316.0, 1316.0, 1316.0, 0.7598784194528876, 204.77610301101822, 0.4645350493920972], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-43", 1, 0, 0.0, 2351.0, 2351, 2351, 2351.0, 2351.0, 2351.0, 2351.0, 0.4253509145044662, 51.65189015312633, 0.25919821352615907], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-44", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 243.34647280751707, 1.3858734339407746], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-45", 1, 0, 0.0, 2203.0, 2203, 2203, 2203.0, 2203.0, 2203.0, 2203.0, 0.45392646391284613, 156.16710522582844, 0.2766114389468906], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-46", 1, 0, 0.0, 1015.0, 1015, 1015, 1015.0, 1015.0, 1015.0, 1015.0, 0.9852216748768472, 83.1935036945813, 0.6061422413793104], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-47", 1, 0, 0.0, 326.0, 326, 326, 326.0, 326.0, 326.0, 326.0, 3.067484662576687, 63.29383148006135, 1.8782352377300613], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-48", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 120.1056168542654, 1.4579013625592419], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-49", 1, 0, 0.0, 638.0, 638, 638, 638.0, 638.0, 638.0, 638.0, 1.567398119122257, 187.68521012931035, 0.9520719043887147], "isController": false}, {"data": ["https://www.icmr.gov.in/aboutus.html-4", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.2406115879828326, 2.820714860515021], "isController": false}, {"data": ["https://www.icmr.gov.in/aboutus.html-5", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 1.2734030837004404, 2.912479350220264], "isController": false}, {"data": ["https://www.icmr.gov.in/aboutus.html-2", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 1.4299665178571428, 2.8773716517857144], "isController": false}, {"data": ["https://www.icmr.gov.in/aboutus.html-3", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 1.2721011513157894, 2.895422149122807], "isController": false}, {"data": ["https://www.icmr.gov.in/aboutus.html-0", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 53.18420890748031, 2.356822096456693], "isController": false}, {"data": ["https://www.icmr.gov.in/aboutus.html-1", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 1.3093820067264574, 2.9559627242152464], "isController": false}, {"data": ["Test", 1, 0, 0.0, 17681.0, 17681, 17681, 17681.0, 17681.0, 17681.0, 17681.0, 0.05655788699734178, 501.1351344663763, 3.4088830347548216], "isController": true}, {"data": ["https://www.icmr.gov.in/tender.html-13", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 4.771205357142857, 9.249441964285714], "isController": false}, {"data": ["https://www.icmr.gov.in/aboutus.html-8", 1, 0, 0.0, 75.0, 75, 75, 75.0, 75.0, 75.0, 75.0, 13.333333333333334, 4.453125, 8.854166666666668], "isController": false}, {"data": ["https://www.icmr.gov.in/tender.html-12", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 4.771205357142857, 9.374999999999998], "isController": false}, {"data": ["https://www.icmr.gov.in/aboutus.html-9", 1, 0, 0.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 73.0, 13.698630136986301, 4.575128424657534, 8.98972602739726], "isController": false}, {"data": ["https://www.icmr.gov.in/tender.html-11", 1, 0, 0.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 72.0, 13.888888888888888, 4.638671875, 9.223090277777779], "isController": false}, {"data": ["https://www.icmr.gov.in/aboutus.html-6", 1, 0, 0.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 4.704005281690141, 9.35299295774648], "isController": false}, {"data": ["https://www.icmr.gov.in/tender.html-10", 1, 0, 0.0, 97.0, 97, 97, 97.0, 97.0, 97.0, 97.0, 10.309278350515465, 3.443137886597938, 6.81580219072165], "isController": false}, {"data": ["https://www.icmr.gov.in/aboutus.html-7", 1, 0, 0.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 72.0, 13.888888888888888, 4.638671875, 9.182400173611112], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-50", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 10.294976635514018, 1.118939836448598], "isController": false}, {"data": ["https://www.icmr.gov.in/tender.html-0", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 87.14520155325444, 3.536427514792899], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-10", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 102.52385650951558, 1.0627297794117647], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-11", 1, 0, 0.0, 2690.0, 2690, 2690, 2690.0, 2690.0, 2690.0, 2690.0, 0.37174721189591076, 94.15042692843866, 0.22725952602230484], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-12", 1, 0, 0.0, 4127.0, 4127, 4127, 4127.0, 4127.0, 4127.0, 4127.0, 0.242306760358614, 130.6158851011631, 0.14836556518051855], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-13", 1, 0, 0.0, 4138.0, 4138, 4138, 4138.0, 4138.0, 4138.0, 4138.0, 0.2416626389560174, 21.746805521991302, 0.1474991692846786], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-14", 1, 0, 0.0, 1836.0, 1836, 1836, 1836.0, 1836.0, 1836.0, 1836.0, 0.5446623093681918, 76.1713431032135, 0.33296738834422657], "isController": false}, {"data": ["https://www.icmr.gov.in/tender.html-5", 1, 0, 0.0, 107.0, 107, 107, 107.0, 107.0, 107.0, 107.0, 9.345794392523365, 779.9540011682243, 5.73160046728972], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-15", 1, 0, 0.0, 3540.0, 3540, 3540, 3540.0, 3540.0, 3540.0, 3540.0, 0.2824858757062147, 48.941781426553675, 0.1729674258474576], "isController": false}, {"data": ["https://www.icmr.gov.in/tender.html-6", 1, 0, 0.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 4.08505721830986, 9.297975352112676], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-16", 1, 0, 0.0, 1614.0, 1614, 1614, 1614.0, 1614.0, 1614.0, 1614.0, 0.6195786864931846, 135.32953841387857, 0.3799759913258984], "isController": false}, {"data": ["https://www.icmr.gov.in/tender.html-7", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 4.129464285714286, 9.388950892857142], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-17", 1, 0, 0.0, 1941.0, 1941, 1941, 1941.0, 1941.0, 1941.0, 1941.0, 0.5151983513652757, 138.7382872874807, 0.3119365018031942], "isController": false}, {"data": ["https://www.icmr.gov.in/tender.html-8", 1, 0, 0.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 4.071302816901409, 9.311729753521128], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-18", 1, 0, 0.0, 1714.0, 1714, 1714, 1714.0, 1714.0, 1714.0, 1714.0, 0.5834305717619602, 83.48469862164528, 0.3549582482497083], "isController": false}, {"data": ["https://www.icmr.gov.in/tender.html-1", 1, 0, 0.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 73.0, 13.698630136986301, 3.999892979452055, 9.029858732876713], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-19", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 101.20219068066157, 1.5505725190839694], "isController": false}, {"data": ["https://www.icmr.gov.in/tender.html-2", 1, 0, 0.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 73.0, 13.698630136986301, 4.387842465753425, 8.829195205479452], "isController": false}, {"data": ["https://www.icmr.gov.in/tender.html-3", 1, 0, 0.0, 79.0, 79, 79, 79.0, 79.0, 79.0, 79.0, 12.658227848101266, 181.3068631329114, 7.787776898734177], "isController": false}, {"data": ["https://www.icmr.gov.in/tender.html-4", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 354.57824473180074, 2.3085787835249043], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html", 1, 0, 0.0, 15604.0, 15604, 15604, 15604.0, 15604.0, 15604.0, 15604.0, 0.0640861317610869, 541.2274722226673, 2.2717407195270445], "isController": false}, {"data": ["https://www.icmr.gov.in/tender.html-9", 1, 0, 0.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 72.0, 13.888888888888888, 15.041775173611112, 8.585611979166668], "isController": false}, {"data": ["https://www.icmr.gov.in/aboutus.html-10", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 4.771205357142857, 9.249441964285714], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-20", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 233.26280381944446, 3.385416666666667], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-21", 1, 0, 0.0, 779.0, 779, 779, 779.0, 779.0, 779.0, 779.0, 1.2836970474967906, 62.26808207637997, 0.7822528883183568], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-22", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 147.78772495136187, 2.3711089494163424], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-23", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 92.44665004863813, 2.3711089494163424], "isController": false}, {"data": ["https://www.icmr.gov.in/contactus.html-10", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 4.771205357142857, 9.374999999999998], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-24", 1, 0, 0.0, 2616.0, 2616, 2616, 2616.0, 2616.0, 2616.0, 2616.0, 0.382262996941896, 52.8571919199159, 0.23331481746941896], "isController": false}, {"data": ["https://www.icmr.gov.in/contactus.html-11", 1, 0, 0.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 4.704005281690141, 9.119168133802818], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-25", 1, 0, 0.0, 1124.0, 1124, 1124, 1124.0, 1124.0, 1124.0, 1124.0, 0.889679715302491, 188.96484374999997, 0.5464927157473309], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-26", 1, 0, 0.0, 1975.0, 1975, 1975, 1975.0, 1975.0, 1975.0, 1975.0, 0.5063291139240507, 66.9382911392405, 0.31200553797468356], "isController": false}, {"data": ["https://www.icmr.gov.in/tender.html", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 478.14690002860414, 20.498873712814646], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-27", 1, 0, 0.0, 1974.0, 1974, 1974, 1974.0, 1974.0, 1974.0, 1974.0, 0.5065856129685917, 116.56713050911854, 0.3116688829787234], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-28", 1, 0, 0.0, 1512.0, 1512, 1512, 1512.0, 1512.0, 1512.0, 1512.0, 0.6613756613756614, 52.48635912698413, 0.40237991898148145], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-29", 1, 0, 0.0, 1827.0, 1827, 1827, 1827.0, 1827.0, 1827.0, 1827.0, 0.5473453749315819, 151.3506174740011, 0.33193503694581283], "isController": false}, {"data": ["https://www.icmr.gov.in/contactus.html", 1, 0, 0.0, 1087.0, 1087, 1087, 1087.0, 1087.0, 1087.0, 1087.0, 0.9199632014719411, 174.4686853150874, 7.996672320607176], "isController": false}, {"data": ["https://www.icmr.gov.in/contactus.html-3", 1, 0, 0.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 72.0, 13.888888888888888, 4.0283203125, 9.168836805555557], "isController": false}, {"data": ["https://www.icmr.gov.in/contactus.html-4", 1, 0, 0.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 72.0, 13.888888888888888, 4.014756944444445, 9.12814670138889], "isController": false}, {"data": ["https://www.icmr.gov.in/contactus.html-1", 2, 0, 0.0, 309.5, 69, 550, 309.5, 550.0, 550.0, 550.0, 2.042900919305414, 172.99520397088867, 1.401501851378958], "isController": false}, {"data": ["https://www.icmr.gov.in/contactus.html-2", 1, 0, 0.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 73.0, 13.698630136986301, 4.387842465753425, 8.829195205479452], "isController": false}, {"data": ["https://www.icmr.gov.in/contactus.html-7", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 4.771205357142857, 9.486607142857142], "isController": false}, {"data": ["https://www.icmr.gov.in/contactus.html-8", 1, 0, 0.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 4.704005281690141, 9.311729753521128], "isController": false}, {"data": ["https://www.icmr.gov.in/contactus.html-5", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 4.129464285714286, 9.444754464285714], "isController": false}, {"data": ["https://www.icmr.gov.in/contactus.html-6", 1, 0, 0.0, 979.0, 979, 979, 979.0, 979.0, 979.0, 979.0, 1.021450459652707, 177.04310042134833, 1.5491333631256385], "isController": false}, {"data": ["https://www.icmr.gov.in/contactus.html-9", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 4.771205357142857, 9.486607142857142], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-0", 2, 0, 0.0, 301.5, 92, 511, 301.5, 511.0, 511.0, 511.0, 3.0534351145038165, 199.44239026717557, 1.8204317748091603], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-30", 1, 0, 0.0, 2786.0, 2786, 2786, 2786.0, 2786.0, 2786.0, 2786.0, 0.35893754486719315, 133.91525148061737, 0.22048019113424264], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-31", 1, 0, 0.0, 755.0, 755, 755, 755.0, 755.0, 755.0, 755.0, 1.3245033112582782, 118.9504863410596, 0.8058257450331126], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-4", 2, 0, 0.0, 470.5, 272, 669, 470.5, 669.0, 669.0, 669.0, 1.9860973187686195, 28.70143371400199, 1.2131873758689178], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-32", 1, 0, 0.0, 4120.0, 4120, 4120, 4120.0, 4120.0, 4120.0, 4120.0, 0.24271844660194175, 68.26361498786407, 0.14885467233009708], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-3", 2, 0, 0.0, 2131.5, 1050, 3213, 2131.5, 3213.0, 3213.0, 3213.0, 0.6224712107065049, 110.79349274431995, 1.7114918884220354], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-33", 1, 0, 0.0, 5592.0, 5592, 5592, 5592.0, 5592.0, 5592.0, 5592.0, 0.17882689556509299, 40.88709316881259, 0.11019508896638056], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-2", 2, 0, 0.0, 913.5, 263, 1564, 913.5, 1564.0, 1564.0, 1564.0, 1.050972149238045, 80.93203987125591, 0.6399229834471887], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-34", 1, 0, 0.0, 5158.0, 5158, 5158, 5158.0, 5158.0, 5158.0, 5158.0, 0.19387359441644048, 50.19735726056611, 0.1175737325513765], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-1", 2, 0, 0.0, 1617.5, 361, 2874, 1617.5, 2874.0, 2874.0, 2874.0, 0.6224712107065049, 35.41520774976657, 0.391172093837535], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-35", 1, 0, 0.0, 2972.0, 2972, 2972, 2972.0, 2972.0, 2972.0, 2972.0, 0.3364737550471063, 117.28246183125842, 0.21358197341857335], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-36", 1, 0, 0.0, 922.0, 922, 922, 922.0, 922.0, 922.0, 922.0, 1.0845986984815619, 150.96681805856832, 0.6619865103036876], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-37", 1, 0, 0.0, 752.0, 752, 752, 752.0, 752.0, 752.0, 752.0, 1.3297872340425532, 166.2104180518617, 0.8090404753989362], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-38", 1, 0, 0.0, 4305.0, 4305, 4305, 4305.0, 4305.0, 4305.0, 4305.0, 0.23228803716608595, 131.45098359465737, 0.14291158536585366], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-39", 1, 0, 0.0, 1566.0, 1566, 1566, 1566.0, 1566.0, 1566.0, 1566.0, 0.6385696040868455, 117.56665070242656, 0.3922463681353767], "isController": false}, {"data": ["https://www.icmr.gov.in/contactus.html-0", 2, 0, 0.0, 262.0, 100, 424, 262.0, 424.0, 424.0, 424.0, 3.7593984962406015, 32.757063557330824, 2.639655780075188], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-8", 1, 0, 0.0, 2780.0, 2780, 2780, 2780.0, 2780.0, 2780.0, 2780.0, 0.3597122302158273, 127.43051652428059, 0.22095604766187052], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-7", 2, 0, 0.0, 1058.0, 565, 1551, 1058.0, 1551.0, 1551.0, 1551.0, 0.8703220191470844, 32.065076969103565, 0.5286526327241079], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-6", 2, 0, 0.0, 905.0, 269, 1541, 905.0, 1541.0, 1541.0, 1541.0, 1.06439595529537, 18.40604626796168, 0.6506951836083023], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-5", 2, 0, 0.0, 720.0, 304, 1136, 720.0, 1136.0, 1136.0, 1136.0, 1.3568521031207597, 95.36059934701493, 0.8208690213704206], "isController": false}, {"data": ["https://www.icmr.gov.in/aboutus.html", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 30.12509889240506, 12.972564421338154], "isController": false}, {"data": ["https://www.icmr.gov.in/index.html-9", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 164.8430561722913, 1.075432948490231], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 102, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
