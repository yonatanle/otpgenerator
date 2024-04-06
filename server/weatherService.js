const fetch = require('node-fetch');
const num = 3;

async function fetchWeather(city) {
    const apiKey = '8iZ327vrqUyPSulRCEBvbFsssToKsDg0';
    const url = `https://api.tomorrow.io/v4/weather/realtime?location=${city}&fields=temperature&units=metric&apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        // Extract temperature from the response data
        const temperature = data?.data?.values?.temperature;        
        console.log(`Temperature in ${city}:${temperature}`);
        return isNaN(temperature) ? '00' : parseInt(temperature);
    } catch (error) {
        console.error("Error fetching weather:", error.message);
        return null;
    }
}
 
async function getTemperatures(cities) {
    const temperatures = [];
    for (let i = 0; i < num; i++) {
        temp = await fetchWeather(cities[i]);
        temperatures.push(temp);
    }
    return temperatures;
}

module.exports.getTemperatures = getTemperatures;
 