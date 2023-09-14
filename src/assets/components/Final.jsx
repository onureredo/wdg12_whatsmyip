import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { DateTime } from 'luxon';
import { SpinnerRoundOutlined } from 'spinners-react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

function Final() {
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

  return (
    <div className='flex flex-col items-center justify-center mt-10 space-y-4'>
      <div className='text-center space-y-2'>
        <h1 className='text-3xl font-semibold'>What&rsquo;s my IP ?</h1>
        <p className='text-gray-500'>this is a cool text</p>
      </div>
      <div
        className={`w-full max-w-2xl h-[500px] rounded-lg relative overflow-hidden ${
          ip ? 'border-4 border-blue-500' : ''
        }`}
      >
        {!ip ? (
          <div className='absolute inset-0 flex items-center justify-center'>
            <SpinnerRoundOutlined
              size={100}
              thickness={100}
              speed={100}
              color='rgba(57, 131, 172, 1)'
            />
          </div>
        ) : (
          <MapContainer
            center={[location.lat, location.lng]}
            zoom={12}
            className='w-full h-full'
          >
            <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
            <Marker position={[location.lat, location.lng]}>
              <Popup>
                <div className='space-y-2 bg-white p-4 rounded-lg shadow-md'>
                  <img
                    src={countryInfo.flag}
                    alt={countryInfo.name}
                    className='w-16 mx-auto'
                  />
                  <div className='font-semibold'>
                    <p>
                      <span className='font-semibold'>Provider:</span> {isp}
                    </p>
                    Country: {countryInfo.name}{' '}
                    <p>
                      <span className='font-semibold'>Location:</span>{' '}
                      {location.city}
                    </p>
                    <p>
                      <span className='font-semibold'>Local Time:</span>{' '}
                      {localTime}
                    </p>
                    <p>
                      <span className='font-semibold'>Date:</span> {localDate}
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        )}
      </div>
    </div>
  );
}

export default Final;
