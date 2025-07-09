import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab,
  Paper
} from '@mui/material';
import UrlList from './UrlList';
import ClickDetails from './ClickDetails';
import useLogger from '../hooks/useLogger';

const UrlStatistics = ({ urls, onUrlClick }) => {
  const { logInfo } = useLogger();
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    logInfo('Switched statistics tab', { tabIndex: newValue });
  };

  const handleUrlSelect = (shortcode) => {
    const url = urls.find(u => u.shortcode === shortcode);
    setSelectedUrl(url);
    setTabValue(1);
    logInfo('Selected URL for details', { shortcode });
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        URL Statistics
      </Typography>
      
      <Paper elevation={1} sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="All URLs" />
          <Tab label="URL Details" disabled={!selectedUrl} />
        </Tabs>
      </Paper>
      
      {tabValue === 0 && (
        <UrlList 
          urls={urls} 
          onUrlClick={(shortcode) => {
            onUrlClick(shortcode);
            handleUrlSelect(shortcode);
          }} 
        />
      )}
      
      {tabValue === 1 && selectedUrl && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Details for: {selectedUrl.shortcode}
          </Typography>
          <Typography variant="body1">
            Original URL: <a href={selectedUrl.longUrl} target="_blank" rel="noopener noreferrer">
              {selectedUrl.longUrl}
            </a>
          </Typography>
          <Typography variant="body1">
            Created: {new Date(selectedUrl.createdAt).toLocaleString()}
          </Typography>
          <Typography variant="body1">
            Expires: {new Date(selectedUrl.expiresAt).toLocaleString()}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Total Clicks: {selectedUrl.clicks.length}
          </Typography>
          
          <ClickDetails clicks={selectedUrl.clicks} />
        </Box>
      )}
    </Box>
  );
};

export default UrlStatistics;