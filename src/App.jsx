import React from 'react';
import { 
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams
} from 'react-router-dom';
import { Container, CssBaseline, AppBar, Toolbar, Typography, Button } from '@mui/material';
import UrlShortenerForm from './components/UrlShortenerForm';
import UrlStatistics from './components/UrlStatistics';
import useUrlShortener from './hooks/useUrlShortener';
import useLogger from './hooks/useLogger';

const AppContent = () => {
  const navigate = useNavigate();
  const { shortcode } = useParams();
  const { 
    urls, 
    loading, 
    error, 
    shortenUrl, 
    recordClick, 
    getUrlByShortcode 
  } = useUrlShortener();
  const { logInfo } = useLogger();

  // Handle redirection if shortcode is in URL
  React.useEffect(() => {
    if (shortcode) {
      const url = getUrlByShortcode(shortcode);
      if (url) {
        logInfo('Redirecting from short URL', { shortcode, longUrl: url.longUrl });
        recordClick(shortcode, 'direct');
        window.location.href = url.longUrl;
      } else {
        logInfo('Short URL not found', { shortcode });
      }
    }
  }, [shortcode, getUrlByShortcode, recordClick, logInfo]);

  const handleShorten = async (longUrl, validityMinutes, shortcode) => {
    try {
      const shortenedUrl = await shortenUrl(longUrl, validityMinutes, shortcode);
      logInfo('URL shortened', { shortcode: shortenedUrl.shortcode });
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleUrlClick = (shortcode) => {
    recordClick(shortcode, 'stats-page');
    logInfo('URL clicked from stats page', { shortcode });
  };

  return (
    <Container maxWidth="lg">
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            URL Shortener
          </Typography>
          <Button 
            color="inherit" 
            onClick={() => navigate('/stats')}
          >
            Statistics
          </Button>
          <Button 
            color="inherit" 
            onClick={() => navigate('/')}
          >
            Shortener
          </Button>
        </Toolbar>
      </AppBar>
      
      <Routes>
        <Route path="/" element={
          <>
            <UrlShortenerForm 
              onShorten={handleShorten} 
              loading={loading} 
            />
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                Error: {error}
              </Typography>
            )}
            <UrlStatistics 
              urls={urls} 
              onUrlClick={handleUrlClick} 
            />
          </>
        } />
        <Route path="/stats" element={
          <UrlStatistics 
            urls={urls} 
            onUrlClick={handleUrlClick} 
          />
        } />
        <Route path="/:shortcode" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;