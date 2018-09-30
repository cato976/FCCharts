define(["require", "exports", 'Scripts/MindFusion.Charting'], function (require, exports, m) {
    "use strict";

    var Charting = m.MindFusion.Charting;
    var Controls = m.MindFusion.Charting.Controls;
    var Collections = m.MindFusion.Charting.Collections;
    var Drawing = m.MindFusion.Charting.Drawing;

    var stockChart = new Controls.CandlestickChart(document.getElementById('stockChart'));

    stockChart.title = "Frazier Cato Charts";
    stockChart.theme.titleFontSize = 16;

    stockChart.candlestickWidth = 12;

    stockChart.showLegend = false;
    stockChart.showXCoordinates = false;
    stockChart.xAxisLabelRotationAngle = 30;

    stockChart.xAxis.minValue = 0;
    stockChart.xAxis.interval = 1;
    stockChart.xAxis.maxValue = 40;
    stockChart.xAxis.title = "Time";
    stockChart.yAxis.title = "Price";

    stockChart.gridType = Charting.GridType.Horizontal;
    stockChart.theme.gridColor1 = new Drawing.Color("#ffffff");
    stockChart.theme.gridColor2 = new Drawing.Color("#fafafa");
    stockChart.theme.gridLineColor = new Drawing.Color("#cecece");
    stockChart.theme.gridLineStyle = Drawing.DashStyle.Dash;

    stockChart.plot.seriesStyle = new Charting.CandlestickSeriesStyle(new Drawing.Brush("#ff2f26"), new Drawing.Brush("#00b140"), new Drawing.Brush("#2e2e2a"), 2, Drawing.DashStyle.Solid, stockChart.plot.seriesRenderers.item(0));

    stockChart.theme.axisLabelsBrush = stockChart.theme.axisTitleBrush = stockChart.theme.axisStroke = new Drawing.Brush("#2e2e2e"); 
    stockChart.theme.highlightStroke = new Drawing.Brush("#cecece");


    var symbol = "CL"
    stockChart.title += "(" + symbol + ")";

    var dataList = new Collections.List();
    updateStock();

    function updateStock()
    {
        $.getJSON("https://api.iextrading.com/1.0/stock/"+symbol+"/chart/date/20180928", function(json) {

            var times = json;

            var update = false;

            if(stockChart.series.count() > 0)
                update = true;

            for(var time in times)
            {
                var stock_info = times[time];

                var dateString  = stock_info["date"];
                var year        = dateString.substring(0,4);
                var month       = dateString.substring(4,6);
                var day         = dateString.substring(6,8);

                var date        = new Date(year, month-1, day);
                var madeUpDate  = new Date(month + " " + day + ", " + year + " " + stock_info["minute"]);
                var dataItem = new Charting.StockPrice(stock_info["marketOpen"], stock_info["marketClose"], stock_info["marketLow"],
                    stock_info["marketHigh"], new Date(madeUpDate));

                dataList.add(dataItem);

                if(update)
                {
                    dataList.removeAt(0);
                    break;
                }                				  

            }



            var series = new Charting.StockPriceSeries(dataList);
            series.dateTimeFormat = Charting.DateTimeFormat.ShortTime;

            var data = new Collections.ObservableCollection();
            data.add(series);
            stockChart.series = data;
            stockChart.draw();


        });
    }

    setInterval(updateStock, 5000);

});
