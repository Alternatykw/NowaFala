import React, { useState } from 'react';
import { Card, CardContent, Typography, Collapse, IconButton, Box, Divider } from '@mui/material';
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

  if (!matches || matches.length === 0) {
    return <Typography>No matches available.</Typography>;
  }

  const formatMatchTime = (time) => {
    if (!time) return 'N/A';
    
    const seconds = Math.floor(time / 1000); 
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
  
    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
  };

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
                    {mainPlayer?.champion || 'Unknown Champion'} {mainPlayer?.role ? `(${mainPlayer.role.toUpperCase()})` : ''}
                </Typography>
                <Typography fontWeight="bold">
                    {mainPlayer?.is_win === true ? 'WIN' : 'LOSE' || 'Unknown Result'}
                </Typography>
                <Typography variant="body2">
                    KDA: {mainPlayer?.deaths > 0
                    ? ((mainPlayer?.kills + mainPlayer?.assists) / mainPlayer?.deaths).toFixed(2)
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
            <Divider />
            <CardContent>
            {match.match_players && match.match_players.length > 0 ? (
                <>
                {(() => {
                    const roleOrder = ["TOP", "JUNGLE", "MIDDLE", "BOTTOM", "SUPPORT"];

                    const team1 = match.match_players
                    .filter((player) => player.team_number === 1)
                    .sort((a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role));

                    const team2 = match.match_players
                    .filter((player) => player.team_number === 2)
                    .sort((a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role));

                    return (
                    <>
                        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                        Team 1
                        </Typography>
                        {team1.map((player, index) => (
                        <Box key={`team1-${index}`} display="flex" alignItems="center" py={1}>
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
                                KDA: {player.kills}/{player.deaths}/{player.assists ?? 'N/A'} (
                                {player.deaths > 0
                                ? ((player.kills + player.assists) / player.deaths).toFixed(2)
                                : 'PERFECT'
                                })
                            </Typography>
                            </Box>

                            <Box sx={{ width: '80px' }}>
                            <Typography variant="body2">CS: {player.CS ?? 'N/A'}</Typography>
                            </Box>
                        </Box>
                        ))}

                        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                        Team 2
                        </Typography>
                        {team2.map((player, index) => (
                        <Box key={`team2-${index}`} display="flex" alignItems="center" py={1}>
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
                                KDA: {player.kills}/{player.deaths}/{player.assists ?? 'N/A'} (
                                {player.deaths > 0
                                ? ((player.kills + player.assists) / player.deaths).toFixed(2)
                                : 'PERFECT'
                                })
                            </Typography>
                            </Box>

                            <Box sx={{ width: '80px' }}>
                            <Typography variant="body2">CS: {player.CS ?? 'N/A'}</Typography>
                            </Box>
                        </Box>
                        ))}
                    </>
                    );
                })()}
                </>
            ) : (
                <Typography>No players data available.</Typography>
            )}
            </CardContent>
        </Collapse>
        </Card>
    );
    })}

    </Box>
  );
}

export default MatchList;
