const axios = require('axios');

const num = 3;
//get  3  random  cities 
async function fetchCity() {
    const offset = 1 + Math.floor(Math.random() * 26000);
    const url = `http://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=1&offset=${offset}&hateoasMode=off`;
    try {
        const response = await axios.get(url);
        const cityName = response.data.data[0].name;
        console.log(cityName);
        return cityName;
    } catch (error) {
        console.error("Error fetching data:", error.message);
        return null;
    }
}

async function getRandomCities() {
    const cities = [];
    for (let i = 0; i < num; i++) {
        city = await fetchCity();
        cities.push(city);
    }
    return cities;
}

module.exports.getRandomCities = getRandomCities;
