import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Typography,
  Link,
  Chip
} from '@mui/material';
import { formatDate } from '../utils/helpers';

const UrlList = ({ urls, onUrlClick }) => {
  if (urls.length === 0) {
    return (
      <Typography variant="body1" sx={{ mt: 2 }}>
        No URLs have been shortened yet.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Short URL</TableCell>
            <TableCell>Original URL</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Expires</TableCell>
            <TableCell>Clicks</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {urls.map((url) => (
            <TableRow key={url.id}>
              <TableCell>
                <Link 
                  href={`/${url.shortcode}`} 
                  onClick={(e) => {
                    e.preventDefault();
                    onUrlClick(url.shortcode);
                  }}
                >
                  {url.shortcode}
                </Link>
              </TableCell>
              <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {url.longUrl}
              </TableCell>
              <TableCell>{formatDate(url.createdAt)}</TableCell>
              <TableCell>{formatDate(url.expiresAt)}</TableCell>
              <TableCell>{url.clicks.length}</TableCell>
              <TableCell>
                <Chip 
                  label={new Date() < new Date(url.expiresAt) ? 'Active' : 'Expired'} 
                  color={new Date() < new Date(url.expiresAt) ? 'success' : 'error'} 
                  size="small" 
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UrlList;