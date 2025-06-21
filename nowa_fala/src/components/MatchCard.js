import React, { Suspense } from 'react';
import { Card, CardContent, Typography, Collapse, IconButton, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CircularProgress from '@mui/material/CircularProgress';
import { getApiChampionName, getDisplayChampionName, formatMatchTime } from '../utils'; 
import MatchDetails from './MatchDetails'; 

export default function MatchCard({ match, username, expandedMatchId, handleExpandClick, renderPlayerRow }) {
  const mainPlayer = match.match_players.find(p => p.user_name === username);

  if (!mainPlayer) return <Typography key={match.id}>No matching player found.</Typography>;

  const winnerColor = '#44619e';
  const loserColor = '#ad3b50';

  return (
    <Card key={match.id}>
      <CardContent
        onClick={() => handleExpandClick(match.id)}
        sx={{
          cursor: 'pointer',
          backgroundColor: mainPlayer?.is_win ? winnerColor : loserColor,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/15.9.1/img/champion/${getApiChampionName(mainPlayer?.champion)}.png`}
              alt={mainPlayer?.champion}
              width={36}
              height={36}
              style={{ borderRadius: '50%' }}
            />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {formatMatchTime(match.time)}
              </Typography>
              <Typography variant="h6">
                {getDisplayChampionName(mainPlayer?.champion)} {mainPlayer?.role && `(${mainPlayer.role.toUpperCase()})`}
              </Typography>
              <Typography fontWeight="bold">{mainPlayer?.is_win ? 'WIN' : 'LOSE'}</Typography>
              <Typography variant="body1">
                KDA: {mainPlayer?.kills}/{mainPlayer?.deaths}/{mainPlayer?.assists} (
                  {mainPlayer?.deaths > 0
                    ? ((mainPlayer.kills + mainPlayer.assists) / mainPlayer.deaths).toFixed(2)
                    : 'Perfect'}
                )
              </Typography>
            </Box>
          </Box>
          <IconButton size="small">
            {expandedMatchId === match.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </CardContent>

      <Collapse in={expandedMatchId === match.id}>
        {expandedMatchId === match.id && (
          <Suspense fallback={<Box sx={{backgroundColor: '#44619e'}} p={2}><CircularProgress /></Box>}>
            <MatchDetails
              match={match}
              renderPlayerRow={renderPlayerRow}
            />
          </Suspense>
        )}
      </Collapse>
    </Card>
  );
}
