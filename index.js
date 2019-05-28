const express = require('express');
const app = express();
const Datastore = require('nedb');
const database = new Datastore('database.db');
database.loadDatabase();
const fetch = require('node-fetch')
const port = process.env.PORT || 3000
require('dotenv').config();


app.listen(port, () => {
  console.log("I am listening ")
});

app.use(express.static('public'));
app.use(express.json({
  limit: '1mb'
}))

app.post('/api', (request, response) => {
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  database.insert(data);
  response.json(data);
});

app.get('/data', (request, response) => {
  response.json(database.getAllData());
})


app.get('/weather/:latlon', async (request, response) => {
  console.log(request.params);
  const latlon = request.params.latlon.split(',');
  const lat = latlon[0];
  const lon = latlon[1];
  const key = process.env.API_KEY;
  const weather_url = `https://api.darksky.net/forecast/${key}/${lat},${lon}/?units=si`;
  const air_quality_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;

  const wfetch = await fetch(weather_url);
  const wjson = await wfetch.json();

  const aqfetch = await fetch(air_quality_url);
  const aqjson = await aqfetch.json();

  const data = {
    weather: wjson,
    air_quality: aqjson
  }

  response.json(data);

});