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
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { useParams, Link } from 'react-router-dom';

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

const getDisplayChampionName = (apiName) =>
  Object.entries(championNameToApiName).find(([_, api]) => api === apiName)?.[0] || apiName;

const getApiChampionName = (displayName) =>
  championNameToApiName[displayName] || displayName?.replace(/\s+/g, '').replace(/['.]/g, '') || '';

const formatMatchTime = (time) => {
  if (!time) return 'N/A';
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const roleOrder = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'SUPPORT'];
const winnerColor = '#44619e';
const loserColor = '#ad3b50';

function MatchList({ matches }) {
  const [expandedMatchId, setExpandedMatchId] = useState(null);
  const { username } = useParams();

  const handleExpandClick = (matchId) =>
    setExpandedMatchId(expandedMatchId === matchId ? null : matchId);

  if (!matches?.length) {
    return <Typography>No matches available.</Typography>;
  }

  const renderPlayerRow = (player, key) => (
    <Box key={key} display="flex" alignItems="center" py={1}>
      <Box display="flex" alignItems="center" gap={1} sx={{ width: '175px' }}>
        <img
          src={`https://ddragon.leagueoflegends.com/cdn/15.9.1/img/champion/${getApiChampionName(player.champion)}.png`}
          alt={player.champion}
          width={24}
          height={24}
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

  const renderTeamSection = (team, teamNumber, isWinner) => (
    <Box sx={{ backgroundColor: isWinner ? winnerColor : loserColor, px: 2, py: 2 }}>
      <Box display="flex" alignItems="center" py={0.5} sx={{ fontWeight: 'bold' }}>
        <Box sx={{ width: '175px' }}>{isWinner ? 'Winners' : 'Losers'}</Box>
        <Box sx={{ width: '150px' }}>KDA</Box>
        <Box sx={{ width: '80px' }}>CS</Box>
        <Box sx={{ width: '80px' }}>DMG</Box>
        <Box sx={{ width: '80px' }}>DMG Taken</Box>
        <Box sx={{ width: '80px' }}>Turret DMG</Box>
      </Box>
      {team.map((player, i) => renderPlayerRow(player, `${teamNumber}-${i}`))}
    </Box>
  );

  const computeChampionWinrates = (matches, username) => {
    const stats = {};
  
    matches.forEach(match => {
      const player = match.match_players.find(p => p.user_name === username);
      if (!player) return;
  
      const champ = getApiChampionName(player.champion);
      if (!stats[champ]) {
        stats[champ] = {
          name: player.champion,
          wins: 0,
          losses: 0,
          kills: 0,
          deaths: 0,
          assists: 0,
        };
      }
  
      if (player.is_win) stats[champ].wins += 1;
      else stats[champ].losses += 1;
  
      stats[champ].kills += player.kills || 0;
      stats[champ].deaths += player.deaths || 0;
      stats[champ].assists += player.assists || 0;
    });
  
    return Object.entries(stats)
      .sort((a, b) => (b[1].wins + b[1].losses) - (a[1].wins + a[1].losses))
      .map(([apiName, data]) => {
        const totalGames = data.wins + data.losses;
        const winrate = totalGames > 0 ? ((data.wins / totalGames) * 100).toFixed(1) : '0.0';
  
        const kdaRatio =
          data.deaths > 0
            ? ((data.kills + data.assists) / data.deaths).toFixed(2)
            : 'Perfect';
  
        return {
          apiName,
          displayName: data.name,
          wins: data.wins,
          losses: data.losses,
          winrate,
          kda: kdaRatio,
        };
      });
  };  

  const computeTeammates = (matches, username) => {
    const teammateStats = {};
  
    matches.forEach(match => {
      const mainPlayer = match.match_players.find(p => p.user_name === username);
      if (!mainPlayer) return;
  
      const sameTeam = match.match_players.filter(
        p => p.team_number === mainPlayer.team_number && p.user_name !== username
      );
  
      sameTeam.forEach(teammate => {
        const name = teammate.user_name || 'Unknown Player';
        if (!teammateStats[name]) {
          teammateStats[name] = {
            wins: 0,
            totalGames: 0
          };
        }
        teammateStats[name].totalGames += 1;
        if (teammate.is_win) teammateStats[name].wins += 1;
      });
    });
  
    return Object.entries(teammateStats)
      .sort((a, b) => b[1].totalGames - a[1].totalGames) 
      .map(([name, stats]) => ({
        name,
        totalGames: stats.totalGames,
        wins: stats.wins,
        winrate: ((stats.wins / stats.totalGames) * 100).toFixed(1)
      }));
  };
  
  

  return (
    <Box display="flex" gap={2}>
    <Box display="flex" flexDirection="column" gap={2} flex="1" maxWidth="35%">

    <Box sx={{ backgroundColor: '#424254', p: 2, borderRadius: 2 }}>
      <Typography variant="h6" color="white" gutterBottom>
        Champion Winrates
      </Typography>
      {computeChampionWinrates(matches, username).map((champ, index) => {
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

    <Box sx={{ backgroundColor: '#424254', p: 2, borderRadius: 2 }}>
      <Typography variant="h6" color="white" gutterBottom>
        Teammate ratio
      </Typography>
      {computeTeammates(matches, username).map((teammate, index) => (
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

    </Box>
    <Box flex="2" maxWidth="75%" display="flex" flexDirection="column" gap={1}>
      {matches.map((match) => {
        const mainPlayer = match.match_players.find(p => p.user_name === username);
        if (!mainPlayer) return <Typography key={match.id}>No matching player found.</Typography>;

        const team1 = match.match_players
          .filter(p => p.team_number === 1)
          .sort((a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role));

        const team2 = match.match_players
          .filter(p => p.team_number === 2)
          .sort((a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role));

        const team1IsWinner = team1.some(p => p.is_win);
        const team2IsWinner = team2.some(p => p.is_win);

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
                    width={32}
                    height={32}
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
              {renderTeamSection(team1, 1, team1IsWinner)}
              <Divider sx={{ borderBottom: '3px solid #1C1C1F' }} />
              {renderTeamSection(team2, 2, team2IsWinner)}
            </Collapse>
          </Card>
        );
      })}
    </Box>
    </Box>
  );
}

export default MatchList;
