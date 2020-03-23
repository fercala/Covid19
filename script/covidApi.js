$(async function () {
    var api = new CovidAPI();
    var result = await api.GetByCountry('argentina');

    result.forEach(element => {
        console.log(element.date+ ': '+element.count);
    });

});

function CovidAPI() {

    this.GetByCountry = GetByCountry

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


    async function GetByCountryAPI(country, callback) {
        const data = await fetch('https://corona.lmao.ninja/historical/' + country);
        const response = await data.json();
        callback(response);
    }


}