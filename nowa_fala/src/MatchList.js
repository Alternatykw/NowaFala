import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Collapse,
  IconButton,
  Box,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useParams } from 'react-router-dom';

const championNameToApiName = {
  "Wukong": "MonkeyKing",
  "Nunu & Willump": "Nunu",
  "Cho'Gath": "Chogath",
  "Kai'Sa": "Kaisa",
  "Kha'Zix": "Khazix",
  "LeBlanc": "Leblanc",
  "Rek'Sai": "RekSai",
  "Vel'Koz": "Velkoz",
  "Dr. Mundo": "DrMundo",
  "Jarvan IV": "JarvanIV",
  "Tahm Kench": "TahmKench",
  "Twisted Fate": "TwistedFate",
  "Xin Zhao": "XinZhao",
  "Miss Fortune": "MissFortune",
  "Master Yi": "MasterYi",
  "Aurelion Sol": "AurelionSol",
  "Kog'Maw": "KogMaw",
  "Lee Sin": "LeeSin",
};

const getDisplayChampionName = (apiName) => {
  const entry = Object.entries(championNameToApiName).find(
    ([display, api]) => api === apiName
  );
  return entry ? entry[0] : apiName;
};

const getApiChampionName = (displayName) => {
  if (!displayName) return '';
  return championNameToApiName[displayName] || displayName.replace(/\s+/g, '').replace(/['.]/g, '');
};

function MatchList({ matches }) {
  const [expandedMatchId, setExpandedMatchId] = useState(null);
  const { username } = useParams();

  const handleExpandClick = (matchId) => {
    setExpandedMatchId(expandedMatchId === matchId ? null : matchId);
  };

  const formatMatchTime = (time) => {
    if (!time) return 'N/A';
    const seconds = Math.floor(time / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  if (!matches || matches.length === 0) {
    return <Typography>No matches available.</Typography>;
  }

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      {matches.map((match) => {
        const mainPlayer = match.match_players.find((player) => player.user_name === username);
        if (!mainPlayer) return <Typography>No matching player found.</Typography>;

        return (
          <Card key={match.id}>
            <CardContent
              onClick={() => handleExpandClick(match.id)}
              sx={{
                cursor: 'pointer',
                backgroundColor: mainPlayer?.is_win ? '#44619e' : '#ad3b50',
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1}>
                  <img
                    src={`https://ddragon.leagueoflegends.com/cdn/15.9.1/img/champion/${getApiChampionName(mainPlayer?.champion)}.png`}
                    alt={mainPlayer?.champion || 'Unknown'}
                    width={32}
                    height={32}
                    style={{ borderRadius: '50%' }}
                  />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      {formatMatchTime(match.time)}
                    </Typography>
                    <Typography variant="h6">
                      {getDisplayChampionName(mainPlayer?.champion)} {mainPlayer?.role ? `(${mainPlayer.role.toUpperCase()})` : ''}
                    </Typography>
                    <Typography fontWeight="bold">
                      {mainPlayer?.is_win ? 'WIN' : 'LOSE'}
                    </Typography>
                    <Typography variant="body2">
                      KDA:{' '}
                      {mainPlayer?.deaths > 0
                        ? ((mainPlayer.kills + mainPlayer.assists) / mainPlayer.deaths).toFixed(2)
                        : 'Perfect'}
                    </Typography>
                  </Box>
                </Box>
                <IconButton size="small">
                  {expandedMatchId === match.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
            </CardContent>

            <Collapse in={expandedMatchId === match.id}>
            <Divider sx={{ borderBottom: '3px solid #1C1C1F' }} />

                {(() => {
                    const roleOrder = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'SUPPORT'];
                    const team1 = match.match_players
                    .filter((p) => p.team_number === 1)
                    .sort((a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role));
                    const team2 = match.match_players
                    .filter((p) => p.team_number === 2)
                    .sort((a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role));

                    const team1IsWinner = team1.some((p) => p.is_win);
                    const team2IsWinner = team2.some((p) => p.is_win);

                    const winnerColor = '#44619e';
                    const loserColor = '#ad3b50';

                    const renderTeam = (team, teamNumber) =>
                    team.map((player, i) => (
                        <Box
                        key={`${teamNumber}-${i}`}
                        display="flex"
                        alignItems="center"
                        py={1}
                        >
                        <Box display="flex" alignItems="center" gap={1} sx={{ width: '175px' }}>
                            <img
                            src={`https://ddragon.leagueoflegends.com/cdn/15.9.1/img/champion/${getApiChampionName(player.champion)}.png`}
                            alt={player.champion}
                            width={24}
                            height={24}
                            />
                            <Typography variant="body2">{player.user_name || 'Unknown Player'}</Typography>
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
                        <Box sx={{ width: '80px' }}>
                            <Typography variant="body2">{player.CS ?? 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ width: '80px' }}>
                            <Typography variant="body2">{player.dmg_dealt ?? 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ width: '80px' }}>
                            <Typography variant="body2">{player.dmg_received ?? 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ width: '80px' }}>
                            <Typography variant="body2">{player.dmg_tower ?? 'N/A'}</Typography>
                        </Box>
                        </Box>
                    ));

                    const headerRow = (teamNumber) => {
                    const isWinner = match.match_players.some(
                        (player) => player.team_number === teamNumber && player.is_win
                    );
                    return (
                        <Box display="flex" alignItems="center" py={0.5} sx={{ fontWeight: 'bold' }}>
                        <Box sx={{ width: '175px' }}>
                            {isWinner ? 'Winners' : 'Losers'}
                        </Box>
                        <Box sx={{ width: '150px' }}>KDA</Box>
                        <Box sx={{ width: '80px' }}>CS</Box>
                        <Box sx={{ width: '80px' }}>DMG</Box>
                        <Box sx={{ width: '80px' }}>DMG Taken</Box>
                        <Box sx={{ width: '80px' }}>Turret DMG</Box>
                        </Box>
                    );
                    };

                    return (
                        <Box>
                            <Box sx={{ backgroundColor: team1IsWinner ? winnerColor : loserColor, px: 2, py: 2 }}>
                                {headerRow(1)}
                                {renderTeam(team1, 1)}
                            </Box>
                            <Divider sx={{ borderBottom: '3px solid #1C1C1F' }} />
                            <Box sx={{ backgroundColor: team2IsWinner ? winnerColor : loserColor, px: 2, py: 2 }}>
                                {headerRow(2)}
                                {renderTeam(team2, 2)}
                            </Box>
                        </Box>
                    );
                })()}
            </Collapse>

          </Card>
        );
      })}
    </Box>
  );
}

export default MatchList;
