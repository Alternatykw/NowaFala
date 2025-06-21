import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function TeammateRatio({ teammates }) {
  return (
    <Box sx={{ backgroundColor: '#424254', p: 2, borderRadius: 2 }}>
      <Typography variant="h6" color="white" gutterBottom>
        Teammate ratio
      </Typography>
      {teammates.map((teammate, index) => (
        <Box
          key={index}
          display="flex"
          justifyContent="space-between" 
          alignItems="center" 
          py={0.5}
          sx={{ borderBottom: '1px solid #555' }}
        >
          <Typography variant="body2" color="white" sx={{ flex: 1 }}>
            <Link to={`/${teammate.name}`} style={{ color: 'white', textDecoration: 'none' }}>
              <Box
                sx={{
                  '&:hover': {
                    color: 'gray',
                    textDecoration: 'underline', 
                  },
                }}
              >
                {teammate.name}
              </Box>
            </Link>
          </Typography>

          <Typography variant="body2" color="white" sx={{ textAlign: 'right', mr: 2 }}>
            {teammate.wins}w / {teammate.totalGames - teammate.wins}l
          </Typography>

          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <Typography variant="body2" color="gray">
              ({teammate.winrate}%)
            </Typography>
            <Typography variant="body2" color="white">
              {teammate.totalGames} games
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
