let lat, lon;

function main() {
  navigator.geolocation.getCurrentPosition(async position => {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    const api_url = `weather/${lat},${lon}`;
    const response = await fetch(api_url);
    const json = await response.json();
    document.getElementById('lat').textContent = lat;
    document.getElementById('lon').textContent = lon;
    document.getElementById('summary').textContent = json.weather.currently.summary;
    document.getElementById('temp').textContent = json.weather.currently.temperature;
    document.getElementById('air').textContent = JSON.stringify(json.air_quality.results[0].measurements[0]);

    const data = {
      lat,
      lon,
      weather: json.weather,
      air: json.air_quality
    };

    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    const db_response = await fetch('/api', options);
    const db_json = await db_response.json();

  });
}