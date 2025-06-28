import React from 'react'
import { useState } from 'react'
import { TextField, Button, Grid, Card, CardContent, Typography, Alert } from '@mui/material';
function Shorterner() {
    const [url, seturl]= useState([{url: "",validity:"",shortcode:""}]);
    const [error, setError] = useState("");
    const [res,setres] = useState("");
    const valid=(url)=>{
        new URL(url);
        return true;
    }
    const handleChange = (index,field,value) => {
        const newUrl = [...url];
        newUrl[index][field] = value;
        seturl(newUrl);
    }
    const handleadddate = () => {
        if (url.some(item => item.url === "")) {
            setError("Please fill all the fields");
            return;
        }
        if(url.length<5)
        seturl([...url, { url: "", validity: "", shortcode: "" }]); 
    }
    const handleshorten = async () => {
        setError("");
        const newres=[];
        for (let i = 0; i < url.length; i++) {
            if (url[i].url === "") {
                setError("Please fill all the fields");
                return;
            }
            if (!valid(url[i].url)) {
                setError("Please enter a valid URL");
                return;
            }
            const response = await fetch("http://localhost:5000/shorten", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ url: url[i].url, validity: url[i].validity })
            });
            const data = await response.json();
            if (data.error) {
                setError(data.error);
                return;
            }
            newres.push(data);
        }
        const existing=json.parse(localStorage.getItem("shortenedUrls")) || [];
        localStorage.setItem("shortenedUrls", JSON.stringify([...existing, ...newres]));
        setres(newres);
    }
  return (
    <div>
      <Grid>
        <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ marginTop: '20px' }}>
          {url.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <TextField
                    label="URL"
                    variant="outlined"
                    fullWidth
                    value={item.url}
                    onChange={(e) => handleChange(index, "url", e.target.value)}
                  />
                  <TextField
                    label="Validity (in days)"
                    variant="outlined"
                    fullWidth
                    value={item.validity}
                    onChange={(e) => handleChange(index, "validity", e.target.value)}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleadddate}>Add URL</Button>
            <Button variant="contained" color="secondary" onClick={handleshorten}>Shorten URLs</Button>
          </Grid>
        </Grid>
        {error && <Alert severity="error">{error}</Alert>}
        {res && res.map((item, index) => (
          <Typography key={index} variant="body1">
            Shortened URL: {item.shortcode}
          </Typography>
        ))}
      </Grid>
    </div>
  )
}

export default Shorterner