import { useState, useEffect } from 'react';
import axios from 'axios';

function Level1() {
  const [ip, setIp] = useState('');

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
      });
  }, []);

  return (
    <div>
      <h2>Your IP Address</h2>
      <p>{ip}</p>
    </div>
  );
}

export default Level1;
