import { useState, useEffect, useRef } from 'react';
import useLogger from './useLogger';
import { validateUrl, validateShortcode } from '../utils/validation';
import { generateShortcode } from '../utils/helpers';

const useUrlShortener = () => {
  const { logError, logInfo } = useLogger();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const initialRender = useRef(true);
  const savingEnabled = useRef(true);

  // Load saved URLs from localStorage only on initial mount
  useEffect(() => {
    try {
      const savedUrls = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
      
      // Process loaded URLs
      const processedUrls = savedUrls.map(url => ({
        ...url,
        createdAt: new Date(url.createdAt),
        expiresAt: new Date(url.expiresAt),
        isValid: new Date() < new Date(url.expiresAt)
      }));

      // Filter out expired URLs
      const validUrls = processedUrls.filter(url => url.isValid);
      
      if (validUrls.length > 0) {
        setUrls(validUrls);
        logInfo('Initial URLs loaded', { count: validUrls.length });
      }
    } catch (error) {
      logError('Failed to load URLs', { error: error.message });
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Save URLs to localStorage when they change
  useEffect(() => {
    if (!savingEnabled.current || initialRender.current) {
      initialRender.current = false;
      return;
    }

    try {
      if (urls.length > 0) {
        localStorage.setItem('shortenedUrls', JSON.stringify(urls));
        logInfo('URLs saved to storage', { count: urls.length });
      } else {
        localStorage.removeItem('shortenedUrls');
      }
    } catch (error) {
      logError('Failed to save URLs', { error: error.message });
    }
  }, [urls]); // Only depends on urls state

  const shortenUrl = async (longUrl, validityMinutes = 30, customShortcode = '') => {
    savingEnabled.current = false;
    try {
      setLoading(true);
      setError(null);

      // Validate URL format
      if (!validateUrl(longUrl)) {
        throw new Error('Please enter a valid URL starting with http:// or https://');
      }

      // Validate custom shortcode if provided
      if (customShortcode && !validateShortcode(customShortcode)) {
        throw new Error('Custom shortcode must be 4-20 alphanumeric characters');
      }

      // Check for duplicate shortcodes
      if (customShortcode && urls.some(url => url.shortcode === customShortcode)) {
        throw new Error('This shortcode is already in use');
      }

      // Generate short URL data
      const shortcode = customShortcode || generateShortcode();
      const createdAt = new Date();
      const expiresAt = new Date(createdAt.getTime() + validityMinutes * 60000);

      const newUrl = {
        id: Date.now().toString(),
        longUrl,
        shortcode,
        shortUrl: `${window.location.origin}/${shortcode}`,
        createdAt,
        expiresAt,
        clicks: [],
        isValid: true
      };

      // Update state
      setUrls(prevUrls => {
        const updatedUrls = [...prevUrls, newUrl];
        return updatedUrls;
      });
      
      logInfo('URL shortened', {
        shortcode,
        longUrl: longUrl.length > 30 ? `${longUrl.substring(0, 30)}...` : longUrl,
        validityMinutes
      });

      return newUrl;
    } catch (error) {
      logError('URL shortening failed', {
        error: error.message,
        longUrl: longUrl.length > 30 ? `${longUrl.substring(0, 30)}...` : longUrl,
        customShortcode
      });
      setError(error.message);
      throw error;
    } finally {
      savingEnabled.current = true;
      setLoading(false);
    }
  };

  const recordClick = (shortcode, source = 'direct') => {
    const clickData = {
      timestamp: new Date(),
      source,
      location: 'Unknown'
    };

    // Try to get geolocation if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          clickData.location = `Lat: ${position.coords.latitude.toFixed(2)}, Lon: ${position.coords.longitude.toFixed(2)}`;
          updateUrlClicks(shortcode, clickData);
        },
        () => {
          clickData.location = 'Location blocked';
          updateUrlClicks(shortcode, clickData);
        }
      );
    } else {
      updateUrlClicks(shortcode, clickData);
    }
  };

  const updateUrlClicks = (shortcode, clickData) => {
    savingEnabled.current = false;
    setUrls(prevUrls =>
      prevUrls.map(url =>
        url.shortcode === shortcode
          ? {
              ...url,
              clicks: [...url.clicks, clickData],
              isValid: new Date() < new Date(url.expiresAt)
            }
          : url
      )
    );
    
    logInfo('URL click recorded', {
      shortcode,
      clickData: {
        ...clickData,
        timestamp: clickData.timestamp.toISOString()
      }
    });
    savingEnabled.current = true;
  };

  const getUrlByShortcode = shortcode => {
    return urls.find(url => url.shortcode === shortcode);
  };

  const deleteUrl = id => {
    savingEnabled.current = false;
    setUrls(prevUrls => prevUrls.filter(url => url.id !== id));
    logInfo('URL deleted', { id });
    savingEnabled.current = true;
  };

  return {
    urls,
    loading,
    error,
    shortenUrl,
    recordClick,
    getUrlByShortcode,
    deleteUrl
  };
};

export default useUrlShortener;