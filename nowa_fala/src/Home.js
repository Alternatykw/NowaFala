import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { supabase } from './supabase';

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('users') 
        .select('*')
        .order('elo', { ascending: false });
  
      if (error) {
        console.error('Supabase fetch error:', error.message);
      } else {
        setData(data);
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
        <Typography>Loading...</Typography>
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
                  key={item.id}
                  component={Link}
                  to={`/${item.name}`}
                  sx={{
                    borderBottom: '2px solid #1C1C1F',
                    height: '40px',
                    textDecoration: 'none',
                    color: 'white',
                    '& td': {
                      paddingTop: '4px',
                      paddingBottom: '4px',
                    },
                    '&:hover': {
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
                          {item.played - item.wins}
                        </span>
                      </Box>
                      <Box sx={{ width: 'auto', display: 'flex', justifyContent: 'center', margin: '2px' }}>
                        <span style={{ borderRadius: '4px', display: 'inline-block' }}>
                          ({((item.wins / item.played) * 100).toFixed(2)}%)
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
