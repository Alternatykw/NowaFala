import React from 'react';
import { Box, Divider } from '@mui/material';

const winnerColor = '#44619e';
const loserColor = '#ad3b50';
const roleOrder = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'SUPPORT'];

export default function MatchDetails({ match, renderPlayerRow }) {
  const team1 = match.match_players
    .filter(p => p.team_number === 1)
    .sort((a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role));

  const team2 = match.match_players
    .filter(p => p.team_number === 2)
    .sort((a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role));

  const team1IsWinner = team1.some(p => p.is_win);
  const team2IsWinner = team2.some(p => p.is_win);

  const renderTeamSection = (team, teamNumber, isWinner) => (
    <Box sx={{ backgroundColor: isWinner ? winnerColor : loserColor, px: 2, paddingBottom: 2 }}>
      <Box display="flex" alignItems="center" py={2} sx={{ fontWeight: 'bold' }}>
        <Box sx={{ width: '190px' }}>{isWinner ? 'Winners' : 'Losers'}</Box>
        <Box sx={{ width: '150px' }}>KDA</Box>
        <Box sx={{ width: '80px' }}>CS</Box>
        <Box sx={{ width: '80px' }}>DMG</Box>
        <Box sx={{ width: '80px' }}>DMG Taken</Box>
        <Box sx={{ width: '80px' }}>Turret DMG</Box>
      </Box>

      <Divider sx={{ backgroundColor: '#1C1C1F', mb: 0.5 }} />

      {team.map((player, i) => (
        <React.Fragment key={`${teamNumber}-${i}`}>
          {renderPlayerRow(player, `${teamNumber}-${i}`)}
          <Divider sx={{ backgroundColor: '#1C1C1F', my: 0.5 }} />
        </React.Fragment>
      ))}
    </Box>
  );

  return (
    <Box>
        <Box
            sx={{
                overflowX: 'scroll',
                minWidth: '100%',
                '&::-webkit-scrollbar': {
                    height: '2px',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#888',
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: '#333',
                },
            }}
        >
        <Box sx={{ minWidth: '600px' }}>
          <Divider sx={{ borderBottom: '3px solid #1C1C1F' }} />
          {renderTeamSection(team1, 1, team1IsWinner)}
        </Box>
      </Box>
      <Box
            sx={{
                overflowX: 'scroll',
                minWidth: '100%',
                '&::-webkit-scrollbar': {
                    height: '2px',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#888',
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: '#333',
                },
            }}
        >
        <Box sx={{ minWidth: '600px' }}>
          <Divider sx={{ borderBottom: '3px solid #1C1C1F' }} />
          {renderTeamSection(team2, 2, team2IsWinner)}
        </Box>
      </Box>
    </Box>
  );
}
