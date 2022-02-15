const plotResultGraph = (standardScore, normalisedScore, categories) => {
    Highcharts.chart('container', {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'EQ asssessment'
        },
        subtitle: {
            text: ''
        },
        xAxis: [{
            categories: categories,
            crosshair: true
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: 'Standard Score',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        }, { // Secondary yAxis
            title: {
                text: 'Catergory score',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            opposite: true
        }],
        tooltip: {
            shared: true,
        },
        colors: [
        '#6d6e70', 
        '#000000', 
        '#d41f44', 
        '#1b3564', 
        '#929598', 
        ],
        plotOptions: {
        column: {
            colorByPoint: true
        }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 70,
            verticalAlign: 'top',
            y: 30,
            floating: true,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || // theme
                'rgba(255,255,255,0.25)'
        },
        series: [{
            name: 'Normalized Score',
            type: 'column',
            yAxis: 1,
            data: standardScore,
            tooltip: {
                valueSuffix: ' '
            }

        }, {
            name: 'Category score',
            type: 'spline',
            data: normalisedScore,
            tooltip: {
                valueSuffix: ''
            }
        }]
    });
}