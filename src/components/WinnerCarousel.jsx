// src/components/WinnerCarousel.jsx
import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

function WinnerCarousel({ players }) {
  // On fait défiler les noms rapidement
  const [displayedIndex, setDisplayedIndex] = useState(0);

  useEffect(() => {
    if (players.length === 0) return;
    const interval = setInterval(() => {
      setDisplayedIndex((prev) => (prev + 1) % players.length);
    }, 150); // toutes les 150ms
    return () => clearInterval(interval);
  }, [players]);

  if (players.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        width: "200px",
        height: "50px",
        margin: "0 auto",
        overflow: "hidden",
        backgroundColor: "#333",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.2rem",
        borderRadius: 1
      }}
    >
      <Typography variant="h6" component="div">
        {players[displayedIndex]?.name}
      </Typography>
    </Box>
  );
}

export default WinnerCarousel;
