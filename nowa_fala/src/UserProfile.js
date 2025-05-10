import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import MatchList from './MatchList'; 


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
              is_win
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
      

    fetchMatches();
  }, [username]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Match History for {username}</h2>
      <MatchList matches={matches} />
    </div>
  );
}

export default UserProfile;
