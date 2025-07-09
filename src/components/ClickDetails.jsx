import React from 'react';
import { 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Divider
} from '@mui/material';
import { formatDate } from '../utils/helpers';

const ClickDetails = ({ clicks }) => {
  if (clicks.length === 0) {
    return (
      <Typography variant="body2" sx={{ mt: 2 }}>
        No clicks recorded yet.
      </Typography>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Click Details
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clicks.map((click, index) => (
              <TableRow key={index}>
                <TableCell>{formatDate(click.timestamp)}</TableCell>
                <TableCell>{click.source}</TableCell>
                <TableCell>{click.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ClickDetails;