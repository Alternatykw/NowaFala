export const championNameToApiName = {
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
  
  export const getDisplayChampionName = (apiName) =>
    Object.entries(championNameToApiName).find(([_, api]) => api === apiName)?.[0] || apiName;
  
  export const getApiChampionName = (displayName) =>
    championNameToApiName[displayName] || displayName?.replace(/\s+/g, '').replace(/['.]/g, '') || '';
  
  export const formatMatchTime = (time) => {
    if (!time) return 'N/A';
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  export const computeChampionWinrates = (matches, username) => {
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
  
  export const computeTeammates = (matches, username) => {
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
  