import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Skeleton } from '@mui/material';
import { supabase } from './supabase';

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('users') 
          .select('*')
          .order('elo', { ascending: false });
        if (error) throw error;

        const enrichedData = data.map(user => ({
          ...user,
          losses: user.played - user.wins,
          winrate: user.played > 0 ? ((user.wins / user.played) * 100).toFixed(2) : '0.00',
        }));
  
        setData(enrichedData);
      } catch (error) {
        console.error('Supabase fetch error:', error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  return (
    <Container
      sx={{
        width: { xs: '95%', sm: '80%', md: '60%' },
        marginTop: '5rem',
        padding: 0,
      }}
    >
        {loading ? (
          <Skeleton
            variant="rectangular"
            height={400}
            sx={{
              borderRadius: '8px',
              backgroundColor: '#424254',
            }}
          />
        ) : (
        <TableContainer 
          component={Paper} 
          sx={{
            backgroundColor: '#424254',
            display: 'flex',  
            justifyContent: 'center',
            overflowX: 'auto'
          }}
        >
          <Table>
            <TableHead sx={{ '& th': { color: 'white', fontSize: '25px' } }}>
              <TableRow sx={{ borderBottom: '0.3rem solid #1C1C1F' }}>
                <TableCell align="center">Nick</TableCell>
                <TableCell align="center">Winrate</TableCell>
                <TableCell align="center">ELO</TableCell>
              </TableRow>
            </TableHead>

            <TableBody sx={{ '& td': { color: 'white' } }}>
              {data.map((item) => (
                <TableRow
                  onClick={() => navigate(`/${item.name}`)}
                  sx={{
                    borderBottom: '2px solid #1C1C1F',
                    height: '40px',
                    '& td': {
                      paddingTop: '4px',
                      paddingBottom: '4px',
                    },
                    '&:hover': {
                      cursor: 'pointer',
                      backgroundColor: '#2c2c36', 
                    },
                  }}
                >
                  <TableCell align="center" width="10%">{item.name}</TableCell>
                  <TableCell align="center" width="10%">
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                      <Box sx={{ width: '20px', display: 'flex', justifyContent: 'center', margin: '2px' }}>
                        <span style={{ backgroundColor: '#5383E8', padding: '2px 6px', borderRadius: '4px', display: 'inline-block' }}>
                          {item.wins}
                        </span>
                      </Box>
                      <Box sx={{ width: '20px', display: 'flex', justifyContent: 'center', margin: '2px' }}>
                        <span style={{ backgroundColor: '#FF7074', padding: '2px 6px', borderRadius: '4px', display: 'inline-block' }}>
                          {item.losses}
                        </span>
                      </Box>
                      <Box sx={{ width: 'auto', display: 'flex', justifyContent: 'center', margin: '2px' }}>
                        <span style={{ borderRadius: '4px', display: 'inline-block', marginLeft: '5px' }}>
                          ({item.winrate}%)
                        </span>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center" width="10%">{item.elo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      )}
    </Container>
  );
};

export default Home;
