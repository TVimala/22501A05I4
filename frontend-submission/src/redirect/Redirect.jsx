import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
// import { logEvent } from '../../logging-middleware/logger';

const RedirectHandler = () => {
  const { shortcode } = useParams();

  useEffect(() => {
    const urls = JSON.parse(localStorage.getItem('urls')) || [];
    const urlData = urls.find(u => u.shortcode === shortcode);

    if (!urlData) return alert('Short URL not found');

    const now = new Date();
    if (new Date(urlData.expiresAt) < now) return alert('URL expired');

    urlData.clicks.push({
      time: now.toISOString(),
      source: 'redirect',
      location: 'Vijayawada, India' 
    });

    const updatedUrls = urls.map(u => u.shortcode === shortcode ? urlData : u);
    localStorage.setItem('urls', JSON.stringify(updatedUrls));
    // logEvent('Redirect Click', urlData);
    window.location.href = urlData.originalUrl;
  }, [shortcode]);

  return <p>Redirecting...</p>;
};

export default RedirectHandler;
