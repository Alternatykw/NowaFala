import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import MatchList from './MatchList'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';

function UserProfile() {
  const { username } = useParams();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    const fetchMatches = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('matches')
          .select(`
            id,
            date_played,
            time,
            match_players (
              user_name,
              team_number,
              role,
              champion,
              kills,
              deaths,
              assists,
              CS,
              is_win,
              dmg_dealt,
              dmg_received,
              dmg_tower
            )
          `)
          .order('date_played', { ascending: false });
      
        if (error) {
          console.error(error);
          setLoading(false);
          return;
        }
      
        const filteredMatches = data.filter(match => 
          match.match_players.some(player => player.user_name === username)
        );
      
        setMatches(filteredMatches);
        setLoading(false);
      };
      

      const timeout = setTimeout(() => {
        fetchMatches();
      }, 300);
    
      return () => clearTimeout(timeout);
  }, [username]);

  if (loading) return <div><CircularProgress /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            <ArrowBackIcon sx={{ '&:hover': { color: 'gray' }, cursor: 'pointer' }} />
          </Link>
          <h2 style={{ marginBottom: 26}}>
            Match History for {username}
          </h2>
        </span>

      <MatchList matches={matches} />
    </div>
  );
  
  
}

export default UserProfile;
