import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Typography, 
  IconButton, 
  InputAdornment,
  FormControl,
  FormHelperText
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import useLogger from '../hooks/useLogger';
import { validateUrl, validateShortcode, validateValidityMinutes } from '../utils/validation';

const UrlShortenerForm = ({ onShorten, loading }) => {
  const { logInfo } = useLogger();
  const [urlForms, setUrlForms] = useState([
    { longUrl: '', validityMinutes: 30, shortcode: '', errors: {} }
  ]);

  const handleInputChange = (index, field, value) => {
    const newForms = [...urlForms];
    newForms[index] = { ...newForms[index], [field]: value };
    
    // Clear error when user types
    if (newForms[index].errors[field]) {
      newForms[index].errors[field] = '';
    }
    
    setUrlForms(newForms);
  };

  const addForm = () => {
    if (urlForms.length < 5) {
      setUrlForms([...urlForms, { longUrl: '', validityMinutes: 30, shortcode: '', errors: {} }]);
      logInfo('Added new URL form');
    }
  };

  const removeForm = (index) => {
    if (urlForms.length > 1) {
      const newForms = urlForms.filter((_, i) => i !== index);
      setUrlForms(newForms);
      logInfo('Removed URL form', { index });
    }
  };

  const validateForm = (form) => {
    const errors = {};
    
    if (!form.longUrl) {
      errors.longUrl = 'URL is required';
    } else if (!validateUrl(form.longUrl)) {
      errors.longUrl = 'Please enter a valid URL (include http:// or https://)';
    }
    
    if (form.validityMinutes && !validateValidityMinutes(form.validityMinutes)) {
      errors.validityMinutes = 'Please enter a positive number of minutes';
    }
    
    if (form.shortcode && !validateShortcode(form.shortcode)) {
      errors.shortcode = 'Shortcode must be 4-20 alphanumeric characters';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasErrors = false;
    
    // Validate all forms
    const validatedForms = urlForms.map(form => {
      const errors = validateForm(form);
      if (Object.keys(errors).length > 0) hasErrors = true;
      return { ...form, errors };
    });
    
    if (hasErrors) {
      setUrlForms(validatedForms);
      logInfo('Form validation failed', { errors: validatedForms.map(f => f.errors) });
      return;
    }
    
    try {
      // Process each valid form
      for (const form of urlForms) {
        await onShorten(
          form.longUrl,
          form.validityMinutes || 30,
          form.shortcode || ''
        );
      }
      
      // Reset forms after successful submission
      setUrlForms([{ longUrl: '', validityMinutes: 30, shortcode: '', errors: {} }]);
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Shorten URLs
      </Typography>
      <form onSubmit={handleSubmit}>
        {urlForms.map((form, index) => (
          <Grid container spacing={2} key={index} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Long URL"
                variant="outlined"
                value={form.longUrl}
                onChange={(e) => handleInputChange(index, 'longUrl', e.target.value)}
                error={!!form.errors.longUrl}
                helperText={form.errors.longUrl}
                placeholder="https://example.com"
                required
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                fullWidth
                label="Validity (minutes)"
                variant="outlined"
                type="number"
                value={form.validityMinutes}
                onChange={(e) => handleInputChange(index, 'validityMinutes', e.target.value)}
                error={!!form.errors.validityMinutes}
                helperText={form.errors.validityMinutes || 'Default: 30'}
                InputProps={{
                  inputProps: { min: 1 }
                }}
              />
            </Grid>
            <Grid item xs={5} sm={3}>
              <TextField
                fullWidth
                label="Custom Shortcode (optional)"
                variant="outlined"
                value={form.shortcode}
                onChange={(e) => handleInputChange(index, 'shortcode', e.target.value)}
                error={!!form.errors.shortcode}
                helperText={form.errors.shortcode}
              />
            </Grid>
            <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center' }}>
              {urlForms.length > 1 && (
                <IconButton onClick={() => removeForm(index)} color="error">
                  <RemoveIcon />
                </IconButton>
              )}
              {index === urlForms.length - 1 && urlForms.length < 5 && (
                <IconButton onClick={addForm} color="primary">
                  <AddIcon />
                </IconButton>
              )}
            </Grid>
          </Grid>
        ))}
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          disabled={loading}
          fullWidth
          sx={{ mt: 2 }}
        >
          {loading ? 'Shortening...' : 'Shorten URLs'}
        </Button>
      </form>
    </Paper>
  );
};

export default UrlShortenerForm;