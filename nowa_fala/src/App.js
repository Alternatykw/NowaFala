import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { supabase } from './supabase';

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('ziomki') 
        .select('*')
        .order('wr', { ascending: false });
  
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
    <Container sx={{ width: '50%' }}>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <TableContainer 
          component={Paper} 
          sx={{
            backgroundColor: '#424254',
            display: 'flex',  
            justifyContent: 'center' 
          }}
        >
          <Table>
            <TableHead sx={{ '& th': { color: 'white', fontSize: '25px' } }}>
              <TableRow sx={{ borderBottom: '0.3rem solid #1C1C1F' }}>
                <TableCell align="center">Nick</TableCell>
                <TableCell align="center">Win/Loss</TableCell>
                <TableCell align="center">Winrate</TableCell>
              </TableRow>
            </TableHead>

            <TableBody sx={{ '& td': { color: 'white' } }}>
              {data.map((item) => (
                <TableRow key={item.id} sx={{ borderBottom: '0.3rem solid #1C1C1F' }}>
                  <TableCell align="center" width="10%">{item.name}</TableCell>
                  <TableCell align="center" width="10%">
                    <span style={{ backgroundColor: '#5383E8', padding: '2px 6px', borderRadius: '4px' }}>
                      {item.win}
                    </span>
                    <span style={{ backgroundColor: '#FF7074', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px' }}>
                      {item.lose}
                    </span>
                  </TableCell>
                  <TableCell align="center" width="10%">{item.wr}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      )}
    </Container>
  );
};

export default App;
