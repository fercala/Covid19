$(async function () {
    var api = new CovidAPI();
    var resultArg = await api.GetByCountry('argentina');
    var resultEsp = await api.GetByCountry('spain');

    var global = await api.GetByCountrys();

    var datosGraf = []
    var datosTable = []
    var datosGeo =[]
    var day = 1;
    
    datosGraf.push(['Day','Argentina','España'])
    datosGeo.push(['Country','Cantidad de Casos'])

    // datosGeo.push(['Argentina', resultArg[resultArg.length-1].count])
    // datosGeo.push(['Spain', resultEsp[resultEsp.length-1].count])

    global.forEach(element => {

            if(element.country == 'USA'){
                element.country ='United States'
            }
        datosGeo.push([element.country, element.cases]);
    });
    
    var filterArg = resultArg.filter(e => e.count > 0)
    var filterEsp = resultEsp.filter(e => e.count > 0)

    var maxCount = filterArg.length > filterEsp.length ? filterArg.length : filterEsp.length

    for (let index = 0; index < maxCount ; index++) {

        var valorArg = filterArg.length > index ? filterArg[index].count : null ;
        var valorEsp = filterEsp.length > index ? filterEsp[index].count : null ;

        datosGraf.push([index + 1,valorArg, valorEsp])
        datosTable.push([valorArg, valorEsp])
    }

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      var data = google.visualization.arrayToDataTable(datosGraf);

      var options = {
        title: 'Company Performance',
        curveType: 'function',
        legend: { position: 'bottom' }
      };

      var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

      chart.draw(data, options);
    }

    google.charts.load('current', {'packages':['table']});
    google.charts.setOnLoadCallback(drawTable);

    function drawTable() {
      var data = new google.visualization.DataTable();
      //   data.addColumn('number', 'Day');
      data.addColumn('number', 'Argentina');
      data.addColumn('number', 'España');
      data.addRows(datosTable);

      var table = new google.visualization.Table(document.getElementById('table_div'));

      table.draw(data, {showRowNumber: true, width: '10%', height: '100%'});
    }


    google.charts.load('current', {
        'packages':['geochart'],
        // Note: you will need to get a mapsApiKey for your project.
        // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
        'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
      });
      google.charts.setOnLoadCallback(drawRegionsMap);

      function drawRegionsMap() {
        var data = google.visualization.arrayToDataTable(datosGeo);

        var options = {
            colorAxis: {colors: ['#e7711c', '#4374e0']}
        };

        var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

        chart.draw(data, options);
      }
});

function CovidAPI() {

    this.GetByCountry = GetByCountry
    this.GetByCountrys = GetByCountrys

    async function GetByCountry(country) {
        var result = [];

        await GetByCountryAPI(country, function (data) {
            //Recorro todas las propiedades
            for (var key in data.timeline.cases) {
                result.push({ 'date': key, 'count': data.timeline.cases[key] });
            }
        }
        );


        return result;
    }

    async function GetByCountrys() {
        var result = [];

        await GetByCountrysAPI(function (data) {
            //Recorro todas las propiedades

            console.log(data);
            result = data
            for (var key in data) {
                result.push({ 'country': data[key].country,  'cases': data[key].cases});
            }
        }
        );
        return result;
    }


    async function GetByCountryAPI(country, callback) {
        const data = await fetch('https://corona.lmao.ninja/historical/' + country);
        const response = await data.json();
        callback(response);
    }

    async function GetByCountrysAPI(callback) {
        const data = await fetch('https://corona.lmao.ninja/countries/');
        const response = await data.json();
        callback(response);
    }


}