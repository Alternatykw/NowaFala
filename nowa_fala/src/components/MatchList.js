import React, { useState, useMemo, useCallback } from 'react';
import {
  Typography,
  Box,
} from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import TeammateRatio from './TeammateRatio';
import MatchCard from './MatchCard';
import ChampionWinrates from './ChampionWinrates';

import {
  getApiChampionName,
  computeChampionWinrates,
  computeTeammates,
} from '../utils';

function MatchList({ matches }) {
  const [expandedMatchId, setExpandedMatchId] = useState(null);
  const { username } = useParams();

  const handleExpandClick = (matchId) =>
    setExpandedMatchId(expandedMatchId === matchId ? null : matchId);

    const renderPlayerRow = (player, key) => (
      <Box key={key} display="flex" alignItems="center" py={1}>
        <Box display="flex" alignItems="center" gap={1} sx={{ width: '190px' }}>
          <img
            src={`https://ddragon.leagueoflegends.com/cdn/15.9.1/img/champion/${getApiChampionName(player.champion)}.png`}
            alt={player.champion}
            width={32}
            height={32}
          />
          <Typography variant="body2">
            <Link
              to={`/${player.user_name}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              {player.user_name || 'Unknown Player'}
            </Link>
          </Typography>
        </Box>
        <Box sx={{ width: '150px' }}>
          <Typography variant="body2">
            {player.kills}/{player.deaths}/{player.assists ?? 'N/A'} (
            {player.deaths > 0
              ? ((player.kills + player.assists) / player.deaths).toFixed(2)
              : 'PERFECT'}
            )
          </Typography>
        </Box>
        <Box sx={{ width: '80px' }}><Typography variant="body2">{player.CS ?? 'N/A'}</Typography></Box>
        <Box sx={{ width: '80px' }}><Typography variant="body2">{player.dmg_dealt ?? 'N/A'}</Typography></Box>
        <Box sx={{ width: '80px' }}><Typography variant="body2">{player.dmg_received ?? 'N/A'}</Typography></Box>
        <Box sx={{ width: '80px' }}><Typography variant="body2">{player.dmg_tower ?? 'N/A'}</Typography></Box>
      </Box>
    );

  const championsWR = useMemo(() => {
    if (!matches?.length) return [];
    return computeChampionWinrates(matches, username);
  }, [matches, username]);
  
  const teammates = useMemo(() => {
    if (!matches?.length) return [];
    return computeTeammates(matches, username);
  }, [matches, username]);

  const playerRow = useCallback(renderPlayerRow, []);
  
  if (!matches?.length) {
    return <Typography>No matches available.</Typography>;
  }

  return (
    <Box
      display="flex"
      gap={2}
      flexDirection={{ xs: 'column', md: 'row' }}
    >
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      flex={{ xs: 'unset', md: '1' }}
      maxWidth={{ xs: '100%', md: '35%' }}
    >

      <ChampionWinrates championsWR={championsWR} />
      <TeammateRatio teammates={teammates} />

    </Box>
    
    <Box
      flex={{ xs: 'unset', md: '2' }}
      maxWidth={{ xs: '100%', md: '70%' }}
      display="flex"
      flexDirection="column"
      gap={1}
    >

      {matches.map((match) => {
        return (
        <MatchCard
          key={match.id}
          match={match}
          username={username}
          expandedMatchId={expandedMatchId}
          handleExpandClick={handleExpandClick}
          renderPlayerRow={playerRow}
        />
        )
      })}
    </Box>
    </Box>
  );
}

export default React.memo(MatchList);