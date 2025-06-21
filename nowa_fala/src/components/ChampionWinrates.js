import React from 'react';
import { Box, Typography } from '@mui/material';
import { getDisplayChampionName } from '../utils';

export default function ChampionWinrates({ championsWR }) {
  return (
    <Box sx={{ backgroundColor: '#424254', p: 2, borderRadius: 2 }}>
      <Typography variant="h6" color="white" gutterBottom>
        Champion Winrates
      </Typography>
      {championsWR.map((champ, index) => {
        let kdaColor = 'gray';
        const numericKDA = parseFloat(champ.kda);

        if (!isNaN(numericKDA)) {
          if (numericKDA > 5) kdaColor = '#FFD700'; 
          else if (numericKDA > 4) kdaColor = '#4FC3F7'; 
          else if (numericKDA > 3) kdaColor = '#81C784'; 
          else if (numericKDA <= 1) kdaColor = '#E57373'; 
        }

        return (
          <Box
            key={index}
            display="flex"
            alignItems="center"
            gap={1}
            py={0.5}
            sx={{ borderBottom: '1px solid #555' }}
          >
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/15.9.1/img/champion/${champ.apiName}.png`}
              alt={champ.displayName}
              width={24}
              height={24}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="white">
                {getDisplayChampionName(champ.displayName)}{' '}
                <Typography
                  variant="body2"
                  component="span"
                  sx={{ color: kdaColor }}
                >
                  ({champ.kda} KDA)
                </Typography>
              </Typography>
            </Box>
            <Typography variant="body2" color="white">
              {champ.wins}w/{champ.losses}l{' '}
              <Typography variant="body2" component="span" color="gray">
                ({champ.winrate}%)
              </Typography>
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
