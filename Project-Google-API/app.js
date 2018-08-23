const yargs = require("yargs");

const geocode = require('./geocode');
const weather = require('./weather');

const argv = yargs
  .options({
    a: {
      demand: true,
      alias: 'address',
      describe: 'Address to fetch weather for',
      string: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

geocode.geocodeAddress(argv.address)
  .then((address) => {
    return weather.getWeather(address.lat, address.lng)
  })
  .then((weather) => {
    console.log('Temperature', weather.temperature);
  })
  .catch((errMsg) => {
    console.log(errMsg);
  })
