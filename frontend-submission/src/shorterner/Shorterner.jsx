import React, { useState } from 'react';
import { TextField, Button, Grid, Card, CardContent, Typography, Alert } from '@mui/material';
// import { logEvent } from '../../logging-middleware/logger';

const ShortenerPage = () => {
  const [inputs, setInputs] = useState([{ url: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (index, field, value) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };

  const handleAdd = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { url: '', validity: '', shortcode: '' }]);
    }
  };

  const handleShorten = () => {
    setError('');
    const newResults = [];
    const usedShortcodes = new Set(JSON.parse(localStorage.getItem('shortcodes')) || []);

    for (const input of inputs) {
      const { url, validity, shortcode } = input;
      if (!isValidURL(url)) {
        setError('Invalid URL detected.');
        return;
      }
      if (validity && isNaN(Number(validity))) {
        setError('Validity must be a number.');
        return;
      }
      if (shortcode && usedShortcodes.has(shortcode)) {
        setError(`Shortcode ${shortcode} already exists.`);
        return;
      }

      const short = shortcode || Math.random().toString(36).substring(2, 8);
      usedShortcodes.add(short);

      const expiresAt = new Date(Date.now() + (Number(validity || 30) * 60000));
      const newEntry = {
        originalUrl: url,
        shortcode: short,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        clicks: [],
      };

      newResults.push(newEntry);
    }

    const existing = JSON.parse(localStorage.getItem('urls')) || [];
    localStorage.setItem('urls', JSON.stringify([...existing, ...newResults]));
    localStorage.setItem('shortcodes', JSON.stringify(Array.from(usedShortcodes)));
    setResults(newResults);
    logEvent('Shorten URLs', newResults);
  };

  return (
   <Grid
  container
  spacing={3}
  sx={{
    padding: 4,
    backgroundColor: '#ffffff',
    color: 'black',
    minHeight: '100vh',
  }}
>
  <Grid item xs={12}>
    <Typography variant="h4" color="black" gutterBottom>
      URL Shortener
    </Typography>
  </Grid>
  {inputs.map((input, idx) => (
    <Grid
      item
      xs={12}
      key={idx}
      sx={{
        border: '1px solid #ccc',
        borderRadius: 2,
        padding: 2,
        backgroundColor: '#f9f9f9',
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Original URL"
            value={input.url}
            onChange={(e) => handleChange(idx, 'url', e.target.value)}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            fullWidth
            label="Validity (mins)"
            value={input.validity}
            onChange={(e) => handleChange(idx, 'validity', e.target.value)}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            fullWidth
            label="Custom Shortcode (optional)"
            value={input.shortcode}
            onChange={(e) => handleChange(idx, 'shortcode', e.target.value)}
          />
        </Grid>
      </Grid>
    </Grid>
  ))}
  <Grid item xs={12}>
    <Button
      variant="outlined"
      onClick={handleAdd}
      disabled={inputs.length >= 5}
      sx={{ marginRight: 2 }}
    >
      Add More
    </Button>
    <Button variant="contained" onClick={handleShorten}>
      Shorten URLs
    </Button>
    <Button variant="outlined" href="/analytics">View Analytics</Button>
  </Grid>
  {error && (
    <Grid item xs={12}>
      <Alert severity="error">{error}</Alert>
    </Grid>
  )}
  {results.map((res, i) => (
    <Grid item xs={12} key={i}>
      <Card sx={{ backgroundColor: '#f1f1f1' }}>
        <CardContent>
          <Typography variant="subtitle1" color="black">
            <b>Original URL:</b> {res.originalUrl}
          </Typography>
          <Typography variant="subtitle1" color="black">
            <b>Shortened URL:</b>{' '}
            <a
              href={`/${res.shortcode}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#1976d2' }}
            >
              {window.location.origin}/{res.shortcode}
            </a>
          </Typography>
          <Typography variant="subtitle1" color="black">
            <b>Expires At:</b> {res.expiresAt}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>
  );
};

export default ShortenerPage;