import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  Link as MuiLink,
} from "@mui/material";

export default function AnalyticsPage() {
  const [allLinks, setAllLinks] = useState({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("urls") || "[]");
    const formatted = {};
    stored.forEach((item) => {
      formatted[item.shortcode] = {
        originalUrl: item.originalUrl,
        createdAt: item.createdAt,
        expiresAt: item.expiresAt,
        clickEvents: item.clicks || [],
      };
    });
    setAllLinks(formatted);
  }, []);

  const sortedEntries = Object.entries(allLinks).sort(([, a], [, b]) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        URL Shortener Analytics
      </Typography>

      {sortedEntries.length === 0 ? (
        <Typography>No shortened URLs found.</Typography>
      ) : (
        sortedEntries.map(([code, data]) => (
          <Paper key={code} sx={{ p: 3, my: 2, backgroundColor: "#f9f9f9" }}>
            <Typography variant="h6" sx={{ color: "#1976d2" }}>
              <MuiLink
                href={`/${code}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {window.location.origin}/{code}
              </MuiLink>
            </Typography>

            <Typography variant="body1" gutterBottom>
              <strong>Original URL:</strong>{" "}
              <MuiLink href={data.originalUrl} target="_blank">
                {data.originalUrl}
              </MuiLink>
            </Typography>

            <Typography variant="body2">
              <strong>Created:</strong>{" "}
              {new Date(data.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body2">
              <strong>Expires:</strong>{" "}
              {new Date(data.expiresAt).toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Total Clicks:</strong>{" "}
              {data.clickEvents ? data.clickEvents.length : 0}
            </Typography>

            {data.clickEvents && data.clickEvents.length > 0 && (
              <>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Click Details:
                </Typography>
                {data.clickEvents.map((click, idx) => (
                  <Typography variant="body2" key={idx}>
                    • {new Date(click.time).toLocaleString()} —{" "}
                    {click.referrer || "Direct"} — {click.location}
                  </Typography>
                ))}
              </>
            )}
          </Paper>
        ))
      )}
    </Container>
  );
}
