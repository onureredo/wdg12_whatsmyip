import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { DateTime } from 'luxon';

function Level3() {
  const [ip, setIp] = useState('');
  const [isp, setIsp] = useState('');
  const [location, setLocation] = useState({});
  const [countryInfo, setCountryInfo] = useState({});

  useEffect(() => {
    axios
      .get(
        `https://geo.ipify.org/api/v1?apiKey=${
          import.meta.env.VITE_IPIFY_API_KEY
        }`
      )
      .then((res) => {
        // console.log(res.data);
        setIp(res.data.ip);
        setIsp(res.data.isp);
        setLocation({
          lat: res.data.location.lat,
          lng: res.data.location.lng,
          city: res.data.location.city,
          country: res.data.location.country,
        });
      });
  }, []);

  useEffect(() => {
    if (location.country) {
      axios
        .get(`https://restcountries.com/v3.1/alpha/${location.country}`)
        .then((res) => {
          //   console.log(res.data);
          const data = res.data[0];
          setCountryInfo({
            name: data.name.common,
            flag: data.flags.png,
            capital: data.capital,
            population: data.population,
          });
        });
    }
  }, [location.country]);

  const localDate = DateTime.now().toLocaleString(DateTime.DATE_FULL);
  const localTime = DateTime.now().toLocaleString(DateTime.TIME_SIMPLE);
  const nyTime = DateTime.now()
    .setZone('America/New_York')
    .toLocaleString(DateTime.TIME_SIMPLE);

  if (!ip) return <p>Loading...</p>;

  return (
    <div>
      <div>
        <h2>WHATS MY IP ?</h2>
        <p>Your IP:{ip}</p>
        <p>Location: {location.city}</p>
        <p>
          Country: {countryInfo.name}{' '}
          <img src={countryInfo.flag} alt={countryInfo.name} width='30' />
        </p>
        <p>Capital: {countryInfo.capital}</p>
        <p>Population: {countryInfo.population}</p>
        <p>Local Date: {localDate}</p>
        <p>Local Time: {localTime}</p>
        <p>Time in NewY: {nyTime}</p>
      </div>
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={12}
        style={{
          height: '400px',
          width: '100%',
          borderRadius: '15px',
          border: '2px solid #e74c3c',
        }}
      >
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
        <Marker position={[location.lat, location.lng]}>
          <Popup>Provider: {isp}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default Level3;
