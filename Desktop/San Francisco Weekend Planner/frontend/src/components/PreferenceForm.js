import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Paper,
  Chip,
  Divider,
  Stack,
  Fade,
  Slide,
  Grow,
} from '@mui/material';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const PreferenceForm = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attributes, setAttributes] = useState({});
  const [prompts, setPrompts] = useState({});
  const [preferences, setPreferences] = useState({});

  const steps = [
    'Location',
    'Budget',
    'Vibe',
    'Distance',
    'Food',
    'WiFi',
    'Plugs',
    'Ambience',
    'Accessibility',
  ];


  useEffect(() => {
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/attributes`);
      setAttributes(response.data.attributes);
      setPrompts(response.data.prompts);
    } catch (err) {
      setError('Failed to load form options. Please check if the backend is running.');
      console.error('Error fetching attributes:', err);
    }
  };

  const handlePreferenceChange = (attribute, value) => {
    setPreferences(prev => ({
      ...prev,
      [attribute]: value
    }));
  };

  const isStepCompleted = (stepIndex) => {
    const stepAttributes = {
      0: 'location_type',
      1: 'budget', 
      2: 'vibe',
      3: 'distance',
      4: 'food',
      5: 'wifi',
      6: 'plugs',
      7: 'ambience',
      8: 'wheelchair'
    };
    
    const attribute = stepAttributes[stepIndex];
    return attribute && preferences[attribute] && preferences[attribute] !== '';
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    // Check if any preferences have been selected
    // Consider it valid if user has made any selection, including "No Preference"
    const hasPreferences = Object.keys(preferences).length > 0 && 
      Object.values(preferences).some(value => value && value !== '');

    if (!hasPreferences) {
      setError('Please choose at least one preference to generate recommendations.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/recommendations`, preferences);
      
      // Check if no recommendations were found
      if (!response.data.recommendations || response.data.recommendations.length === 0) {
        setError('No places match your criteria. Try adjusting your preferences!');
        setLoading(false);
        return;
      }
      
      // Store recommendations in localStorage for the results page
      localStorage.setItem('recommendations', JSON.stringify(response.data));
      
      navigate('/recommendations');
    } catch (err) {
      setError('Failed to get recommendations. Please try again.');
      console.error('Error getting recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ width: '100%' }}>
            <Typography variant="h5" component="h2" sx={{ 
              fontWeight: 'bold', 
              mb: 3, 
              textAlign: 'center',
              color: 'text.primary'
            }}>
              {prompts.location_type}
            </Typography>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
              maxWidth: 800,
              mx: 'auto'
            }}>
              {/* Indoor Option */}
              <Card 
                elevation={preferences.location_type === 'indoor' ? 8 : 2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  border: preferences.location_type === 'indoor' ? '3px solid' : '1px solid',
                  borderColor: preferences.location_type === 'indoor' ? 'primary.main' : 'divider',
                  backgroundColor: preferences.location_type === 'indoor' ? 'primary.50' : 'white',
                  transform: preferences.location_type === 'indoor' ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handlePreferenceChange('location_type', preferences.location_type === 'indoor' ? '' : 'indoor')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    fontSize: '1.1rem',
                    color: preferences.location_type === 'indoor' ? 'primary.main' : 'text.primary'
                  }}>
                    Indoor
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Museums, cafes, libraries, shopping centers
                      </Typography>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: preferences.location_type === 'indoor' ? 'none' : '2px solid',
                    borderColor: preferences.location_type === 'indoor' ? 'primary.main' : 'grey.400',
                    backgroundColor: preferences.location_type === 'indoor' ? 'primary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {preferences.location_type === 'indoor' && (
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                    )}
                    </Box>
                </CardContent>
              </Card>

              {/* Outdoor Option */}
              <Card 
                elevation={preferences.location_type === 'outdoor' ? 8 : 2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  border: preferences.location_type === 'outdoor' ? '3px solid' : '1px solid',
                  borderColor: preferences.location_type === 'outdoor' ? 'primary.main' : 'divider',
                  backgroundColor: preferences.location_type === 'outdoor' ? 'primary.50' : 'white',
                  transform: preferences.location_type === 'outdoor' ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handlePreferenceChange('location_type', preferences.location_type === 'outdoor' ? '' : 'outdoor')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    fontSize: '1.1rem',
                    color: preferences.location_type === 'outdoor' ? 'primary.main' : 'text.primary'
                  }}>
                    Outdoor
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Parks, beaches, hiking trails, outdoor markets
                      </Typography>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: preferences.location_type === 'outdoor' ? 'none' : '2px solid',
                    borderColor: preferences.location_type === 'outdoor' ? 'primary.main' : 'grey.400',
                    backgroundColor: preferences.location_type === 'outdoor' ? 'primary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {preferences.location_type === 'outdoor' && (
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                    )}
                    </Box>
                </CardContent>
              </Card>

              {/* No Preference Option */}
              <Card 
                elevation={preferences.location_type === 'none' ? 8 : 2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  border: preferences.location_type === 'none' ? '3px solid' : '1px solid',
                  borderColor: preferences.location_type === 'none' ? 'primary.main' : 'divider',
                  backgroundColor: preferences.location_type === 'none' ? 'primary.50' : 'white',
                  transform: preferences.location_type === 'none' ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handlePreferenceChange('location_type', preferences.location_type === 'none' ? '' : 'none')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    fontSize: '1.1rem',
                    color: preferences.location_type === 'none' ? 'primary.main' : 'text.primary'
                  }}>
                    No Preference
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        I'm open to both indoor and outdoor options
                      </Typography>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: preferences.location_type === 'none' ? 'none' : '2px solid',
                    borderColor: preferences.location_type === 'none' ? 'primary.main' : 'grey.400',
                    backgroundColor: preferences.location_type === 'none' ? 'primary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {preferences.location_type === 'none' && (
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                    )}
                    </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ width: '100%' }}>
            <Typography variant="h5" component="h2" sx={{ 
              fontWeight: 'bold', 
              mb: 3, 
              textAlign: 'center',
              color: 'text.primary'
            }}>
              {prompts.budget}
            </Typography>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
              gap: 3,
              maxWidth: 1000,
              mx: 'auto'
            }}>
              {/* Free Option */}
              <Card 
                elevation={preferences.budget === 'free' ? 8 : 2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  border: preferences.budget === 'free' ? '3px solid' : '1px solid',
                  borderColor: preferences.budget === 'free' ? 'primary.main' : 'divider',
                  backgroundColor: preferences.budget === 'free' ? 'primary.50' : 'white',
                  transform: preferences.budget === 'free' ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handlePreferenceChange('budget', preferences.budget === 'free' ? '' : 'free')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    fontSize: '1.1rem',
                    color: preferences.budget === 'free' ? 'primary.main' : 'text.primary'
                  }}>
                    Free
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        No cost activities and attractions
                      </Typography>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: preferences.budget === 'free' ? 'none' : '2px solid',
                    borderColor: preferences.budget === 'free' ? 'primary.main' : 'grey.400',
                    backgroundColor: preferences.budget === 'free' ? 'primary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {preferences.budget === 'free' && (
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                    )}
                    </Box>
                </CardContent>
              </Card>

              {/* Low Budget Option */}
              <Card 
                elevation={preferences.budget === 'low' ? 8 : 2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  border: preferences.budget === 'low' ? '3px solid' : '1px solid',
                  borderColor: preferences.budget === 'low' ? 'primary.main' : 'divider',
                  backgroundColor: preferences.budget === 'low' ? 'primary.50' : 'white',
                  transform: preferences.budget === 'low' ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handlePreferenceChange('budget', preferences.budget === 'low' ? '' : 'low')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    fontSize: '1.1rem',
                    color: preferences.budget === 'low' ? 'primary.main' : 'text.primary'
                  }}>
                    Low ($1-$20)
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Affordable options for a budget-friendly weekend
                      </Typography>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: preferences.budget === 'low' ? 'none' : '2px solid',
                    borderColor: preferences.budget === 'low' ? 'primary.main' : 'grey.400',
                    backgroundColor: preferences.budget === 'low' ? 'primary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {preferences.budget === 'low' && (
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                    )}
                    </Box>
                </CardContent>
              </Card>

              {/* High Budget Option */}
              <Card 
                elevation={preferences.budget === 'high' ? 8 : 2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  border: preferences.budget === 'high' ? '3px solid' : '1px solid',
                  borderColor: preferences.budget === 'high' ? 'primary.main' : 'divider',
                  backgroundColor: preferences.budget === 'high' ? 'primary.50' : 'white',
                  transform: preferences.budget === 'high' ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handlePreferenceChange('budget', preferences.budget === 'high' ? '' : 'high')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    fontSize: '1.1rem',
                    color: preferences.budget === 'high' ? 'primary.main' : 'text.primary'
                  }}>
                    High ($20+)
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Premium experiences and fine dining
                      </Typography>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: preferences.budget === 'high' ? 'none' : '2px solid',
                    borderColor: preferences.budget === 'high' ? 'primary.main' : 'grey.400',
                    backgroundColor: preferences.budget === 'high' ? 'primary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {preferences.budget === 'high' && (
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                    )}
                    </Box>
                </CardContent>
              </Card>

              {/* No Preference Option */}
              <Card 
                elevation={preferences.budget === 'none' ? 8 : 2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  border: preferences.budget === 'none' ? '3px solid' : '1px solid',
                  borderColor: preferences.budget === 'none' ? 'primary.main' : 'divider',
                  backgroundColor: preferences.budget === 'none' ? 'primary.50' : 'white',
                  transform: preferences.budget === 'none' ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handlePreferenceChange('budget', preferences.budget === 'none' ? '' : 'none')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    fontSize: '1.1rem',
                    color: preferences.budget === 'none' ? 'primary.main' : 'text.primary'
                  }}>
                    No Preference
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Price is not a deciding factor
                      </Typography>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: preferences.budget === 'none' ? 'none' : '2px solid',
                    borderColor: preferences.budget === 'none' ? 'primary.main' : 'grey.400',
                    backgroundColor: preferences.budget === 'none' ? 'primary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {preferences.budget === 'none' && (
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                    )}
                    </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        );

      case 2:
        const vibeOptions = attributes.vibe || [];
        
        return (
          <Box sx={{ width: '100%' }}>
            <Typography variant="h5" component="h2" sx={{ 
              fontWeight: 'bold', 
              mb: 3, 
              textAlign: 'center',
              color: 'text.primary'
            }}>
              {prompts.vibe}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              You can select multiple vibes that match your mood
            </Typography>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
              maxWidth: 800,
              mx: 'auto'
            }}>
              {vibeOptions.map((vibe) => {
                const vibeDescriptions = {
                  chill: 'Relaxed, calm atmosphere for unwinding',
                  romantic: 'Intimate, cozy setting for couples',
                  social: 'Lively, interactive environment for meeting people',
                  sport: 'Active, energetic atmosphere for physical activities',
                  study: 'Quiet, focused environment for concentration'
                };
                
                return (
                  <Card 
                  key={vibe}
                    elevation={preferences.vibe && preferences.vibe.includes(vibe) ? 8 : 2}
                  sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease-in-out',
                      border: preferences.vibe && preferences.vibe.includes(vibe) ? '3px solid' : '1px solid',
                      borderColor: preferences.vibe && preferences.vibe.includes(vibe) ? 'primary.main' : 'divider',
                    backgroundColor: preferences.vibe && preferences.vibe.includes(vibe) ? 'primary.50' : 'white',
                      transform: preferences.vibe && preferences.vibe.includes(vibe) ? 'scale(1.02)' : 'scale(1)',
                      '&:hover': {
                        elevation: 4,
                        transform: 'translateY(-2px)',
                        borderColor: 'primary.main'
                      }
                    }}
                    onClick={() => {
                          const currentVibes = preferences.vibe ? preferences.vibe.split(',') : [];
                      if (preferences.vibe && preferences.vibe.includes(vibe)) {
                            const newVibes = currentVibes.filter(v => v !== vibe);
                            handlePreferenceChange('vibe', newVibes.length > 0 ? newVibes.join(',') : 'none');
                      } else {
                        const newVibes = [...currentVibes.filter(v => v !== 'none'), vibe];
                        handlePreferenceChange('vibe', newVibes.join(','));
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                      <Typography variant="h6" component="h3" sx={{ 
                        fontWeight: 'bold', 
                        mb: 2,
                        fontSize: '1.1rem',
                        color: preferences.vibe && preferences.vibe.includes(vibe) ? 'primary.main' : 'text.primary'
                      }}>
                        {vibe.charAt(0).toUpperCase() + vibe.slice(1)}
                        </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        {vibeDescriptions[vibe] || 'A unique atmosphere for your experience'}
                      </Typography>
                      <Box sx={{ 
                        width: 24, 
                        height: 24, 
                        borderRadius: '50%', 
                        border: preferences.vibe && preferences.vibe.includes(vibe) ? 'none' : '2px solid',
                        borderColor: preferences.vibe && preferences.vibe.includes(vibe) ? 'primary.main' : 'grey.400',
                        backgroundColor: preferences.vibe && preferences.vibe.includes(vibe) ? 'primary.main' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {preferences.vibe && preferences.vibe.includes(vibe) && (
                          <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
              
              {/* No Preference Option */}
              <Card 
                elevation={preferences.vibe === 'none' ? 8 : 2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  border: preferences.vibe === 'none' ? '3px solid' : '1px solid',
                  borderColor: preferences.vibe === 'none' ? 'primary.main' : 'divider',
                  backgroundColor: preferences.vibe === 'none' ? 'primary.50' : 'white',
                  transform: preferences.vibe === 'none' ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => {
                  if (preferences.vibe === 'none') {
                    handlePreferenceChange('vibe', '');
                  } else {
                          handlePreferenceChange('vibe', 'none');
                        }
                      }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    fontSize: '1.1rem',
                    color: preferences.vibe === 'none' ? 'primary.main' : 'text.primary'
                  }}>
                    No Preference
                      </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Atmosphere doesn't matter to me
                  </Typography>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: preferences.vibe === 'none' ? 'none' : '2px solid',
                    borderColor: preferences.vibe === 'none' ? 'primary.main' : 'grey.400',
                    backgroundColor: preferences.vibe === 'none' ? 'primary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {preferences.vibe === 'none' && (
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                    )}
                    </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ width: '100%' }}>
            <Typography variant="h5" component="h2" sx={{ 
              fontWeight: 'bold', 
              mb: 3, 
              textAlign: 'center',
              color: 'text.primary'
            }}>
              {prompts.distance}
            </Typography>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
              gap: 3,
              maxWidth: 1000,
              mx: 'auto'
            }}>
              {/* Short Distance Option */}
              <Card 
                elevation={preferences.distance === 'short' ? 8 : 2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  border: preferences.distance === 'short' ? '3px solid' : '1px solid',
                  borderColor: preferences.distance === 'short' ? 'primary.main' : 'divider',
                  backgroundColor: preferences.distance === 'short' ? 'primary.50' : 'white',
                  transform: preferences.distance === 'short' ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handlePreferenceChange('distance', preferences.distance === 'short' ? '' : 'short')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    fontSize: '1.1rem',
                    color: preferences.distance === 'short' ? 'primary.main' : 'text.primary'
                  }}>
                    Short (0-3 km)
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Close proximity, easy walking distance
                  </Typography>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: preferences.distance === 'short' ? 'none' : '2px solid',
                    borderColor: preferences.distance === 'short' ? 'primary.main' : 'grey.400',
                    backgroundColor: preferences.distance === 'short' ? 'primary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {preferences.distance === 'short' && (
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>

              {/* Medium Distance Option */}
              <Card 
                elevation={preferences.distance === 'medium' ? 8 : 2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  border: preferences.distance === 'medium' ? '3px solid' : '1px solid',
                  borderColor: preferences.distance === 'medium' ? 'primary.main' : 'divider',
                  backgroundColor: preferences.distance === 'medium' ? 'primary.50' : 'white',
                  transform: preferences.distance === 'medium' ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handlePreferenceChange('distance', preferences.distance === 'medium' ? '' : 'medium')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    fontSize: '1.1rem',
                    color: preferences.distance === 'medium' ? 'primary.main' : 'text.primary'
                  }}>
                    Medium (3-5 km)
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Moderate distance, may need transportation
                  </Typography>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: preferences.distance === 'medium' ? 'none' : '2px solid',
                    borderColor: preferences.distance === 'medium' ? 'primary.main' : 'grey.400',
                    backgroundColor: preferences.distance === 'medium' ? 'primary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {preferences.distance === 'medium' && (
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>

              {/* High Distance Option */}
              <Card 
                elevation={preferences.distance === 'high' ? 8 : 2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  border: preferences.distance === 'high' ? '3px solid' : '1px solid',
                  borderColor: preferences.distance === 'high' ? 'primary.main' : 'divider',
                  backgroundColor: preferences.distance === 'high' ? 'primary.50' : 'white',
                  transform: preferences.distance === 'high' ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handlePreferenceChange('distance', preferences.distance === 'high' ? '' : 'high')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    fontSize: '1.1rem',
                    color: preferences.distance === 'high' ? 'primary.main' : 'text.primary'
                  }}>
                    High (5+ km)
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Further away, definitely need transportation
                  </Typography>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: preferences.distance === 'high' ? 'none' : '2px solid',
                    borderColor: preferences.distance === 'high' ? 'primary.main' : 'grey.400',
                    backgroundColor: preferences.distance === 'high' ? 'primary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {preferences.distance === 'high' && (
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>

              {/* No Preference Option */}
              <Card 
                elevation={preferences.distance === 'none' ? 8 : 2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  border: preferences.distance === 'none' ? '3px solid' : '1px solid',
                  borderColor: preferences.distance === 'none' ? 'primary.main' : 'divider',
                  backgroundColor: preferences.distance === 'none' ? 'primary.50' : 'white',
                  transform: preferences.distance === 'none' ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handlePreferenceChange('distance', preferences.distance === 'none' ? '' : 'none')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    fontSize: '1.1rem',
                    color: preferences.distance === 'none' ? 'primary.main' : 'text.primary'
                  }}>
                    No Preference
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Distance doesn't matter to me
                  </Typography>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: preferences.distance === 'none' ? 'none' : '2px solid',
                    borderColor: preferences.distance === 'none' ? 'primary.main' : 'grey.400',
                    backgroundColor: preferences.distance === 'none' ? 'primary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {preferences.distance === 'none' && (
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        );

      case 4:
        return (
          <Box sx={{ width: '100%' }}>
            <Typography variant="h5" component="h2" sx={{ 
              fontWeight: 'bold', 
              mb: 3, 
              textAlign: 'center',
              color: 'text.primary'
            }}>
              {prompts.food}
            </Typography>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
              maxWidth: 800,
              mx: 'auto'
            }}>
              {/* Yes Food Option */}
              <Card 
                elevation={preferences.food === 'yes' ? 8 : 2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  border: preferences.food === 'yes' ? '3px solid' : '1px solid',
                  borderColor: preferences.food === 'yes' ? 'primary.main' : 'divider',
                  backgroundColor: preferences.food === 'yes' ? 'primary.50' : 'white',
                  transform: preferences.food === 'yes' ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handlePreferenceChange('food', preferences.food === 'yes' ? '' : 'yes')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    fontSize: '1.1rem',
                    color: preferences.food === 'yes' ? 'primary.main' : 'text.primary'
                  }}>
                    Yes, I want food available
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    I'd like dining options at or near the location
                  </Typography>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: preferences.food === 'yes' ? 'none' : '2px solid',
                    borderColor: preferences.food === 'yes' ? 'primary.main' : 'grey.400',
                    backgroundColor: preferences.food === 'yes' ? 'primary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {preferences.food === 'yes' && (
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>

              {/* No Food Option */}
              <Card 
                elevation={preferences.food === 'no' ? 8 : 2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  border: preferences.food === 'no' ? '3px solid' : '1px solid',
                  borderColor: preferences.food === 'no' ? 'primary.main' : 'divider',
                  backgroundColor: preferences.food === 'no' ? 'primary.50' : 'white',
                  transform: preferences.food === 'no' ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handlePreferenceChange('food', preferences.food === 'no' ? '' : 'no')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    fontSize: '1.1rem',
                    color: preferences.food === 'no' ? 'primary.main' : 'text.primary'
                  }}>
                    No, food not needed
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    I don't need dining options at the location
                  </Typography>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: preferences.food === 'no' ? 'none' : '2px solid',
                    borderColor: preferences.food === 'no' ? 'primary.main' : 'grey.400',
                    backgroundColor: preferences.food === 'no' ? 'primary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {preferences.food === 'no' && (
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>

              {/* No Preference Option */}
              <Card 
                elevation={preferences.food === 'none' ? 8 : 2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  border: preferences.food === 'none' ? '3px solid' : '1px solid',
                  borderColor: preferences.food === 'none' ? 'primary.main' : 'divider',
                  backgroundColor: preferences.food === 'none' ? 'primary.50' : 'white',
                  transform: preferences.food === 'none' ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handlePreferenceChange('food', preferences.food === 'none' ? '' : 'none')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    fontSize: '1.1rem',
                    color: preferences.food === 'none' ? 'primary.main' : 'text.primary'
                  }}>
                    No Preference
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Food availability doesn't matter to me
                  </Typography>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: preferences.food === 'none' ? 'none' : '2px solid',
                    borderColor: preferences.food === 'none' ? 'primary.main' : 'grey.400',
                    backgroundColor: preferences.food === 'none' ? 'primary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {preferences.food === 'none' && (
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        );

      case 5:
        return (
          <Box sx={{ width: '100%' }}>
            <Typography variant="h5" component="h2" sx={{ 
              fontWeight: 'bold', 
              mb: 3, 
              textAlign: 'center',
              color: 'text.primary'
            }}>
              {prompts.wifi}
            </Typography>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
              maxWidth: 800,
              mx: 'auto'
            }}>
              {/* Yes WiFi Option */}
              <Card 
                elevation={preferences.wifi === 'yes' ? 8 : 2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  border: preferences.wifi === 'yes' ? '3px solid' : '1px solid',
                  borderColor: preferences.wifi === 'yes' ? 'primary.main' : 'divider',
                  backgroundColor: preferences.wifi === 'yes' ? 'primary.50' : 'white',
                  transform: preferences.wifi === 'yes' ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handlePreferenceChange('wifi', preferences.wifi === 'yes' ? '' : 'yes')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    fontSize: '1.1rem',
                    color: preferences.wifi === 'yes' ? 'primary.main' : 'text.primary'
                  }}>
                    Yes, I need WiFi
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        I need internet access for work or entertainment
                      </Typography>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: preferences.wifi === 'yes' ? 'none' : '2px solid',
                    borderColor: preferences.wifi === 'yes' ? 'primary.main' : 'grey.400',
                    backgroundColor: preferences.wifi === 'yes' ? 'primary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {preferences.wifi === 'yes' && (
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                    )}
                    </Box>
                </CardContent>
              </Card>

              {/* No WiFi Option */}
              <Card 
                elevation={preferences.wifi === 'no' ? 8 : 2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  border: preferences.wifi === 'no' ? '3px solid' : '1px solid',
                  borderColor: preferences.wifi === 'no' ? 'primary.main' : 'divider',
                  backgroundColor: preferences.wifi === 'no' ? 'primary.50' : 'white',
                  transform: preferences.wifi === 'no' ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handlePreferenceChange('wifi', preferences.wifi === 'no' ? '' : 'no')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    fontSize: '1.1rem',
                    color: preferences.wifi === 'no' ? 'primary.main' : 'text.primary'
                  }}>
                    No, WiFi not needed
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        I want to disconnect and enjoy offline activities
                      </Typography>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: preferences.wifi === 'no' ? 'none' : '2px solid',
                    borderColor: preferences.wifi === 'no' ? 'primary.main' : 'grey.400',
                    backgroundColor: preferences.wifi === 'no' ? 'primary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {preferences.wifi === 'no' && (
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                    )}
                    </Box>
                </CardContent>
              </Card>

              {/* No Preference Option */}
              <Card 
                elevation={preferences.wifi === 'none' ? 8 : 2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  border: preferences.wifi === 'none' ? '3px solid' : '1px solid',
                  borderColor: preferences.wifi === 'none' ? 'primary.main' : 'divider',
                  backgroundColor: preferences.wifi === 'none' ? 'primary.50' : 'white',
                  transform: preferences.wifi === 'none' ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handlePreferenceChange('wifi', preferences.wifi === 'none' ? '' : 'none')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    fontSize: '1.1rem',
                    color: preferences.wifi === 'none' ? 'primary.main' : 'text.primary'
                  }}>
                    No Preference
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        WiFi availability doesn't matter to me
                      </Typography>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: preferences.wifi === 'none' ? 'none' : '2px solid',
                    borderColor: preferences.wifi === 'none' ? 'primary.main' : 'grey.400',
                    backgroundColor: preferences.wifi === 'none' ? 'primary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {preferences.wifi === 'none' && (
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                    )}
                    </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        );

      case 6:
        return (
          <Box sx={{ width: '100%' }}>
            <Typography variant="h5" component="h2" sx={{ 
              fontWeight: 'bold', 
              mb: 3, 
              textAlign: 'center',
              color: 'text.primary'
            }}>
              {prompts.plugs}
            </Typography>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
              maxWidth: 800,
              mx: 'auto'
            }}>
              {/* Yes Plugs Option */}
              <Card 
                elevation={preferences.plugs === 'yes' ? 8 : 2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  border: preferences.plugs === 'yes' ? '3px solid' : '1px solid',
                  borderColor: preferences.plugs === 'yes' ? 'primary.main' : 'divider',
                  backgroundColor: preferences.plugs === 'yes' ? 'primary.50' : 'white',
                  transform: preferences.plugs === 'yes' ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handlePreferenceChange('plugs', preferences.plugs === 'yes' ? '' : 'yes')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    fontSize: '1.1rem',
                    color: preferences.plugs === 'yes' ? 'primary.main' : 'text.primary'
                  }}>
                    Yes, I need plugs/outlets
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        I need to charge my devices while I'm there
                      </Typography>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: preferences.plugs === 'yes' ? 'none' : '2px solid',
                    borderColor: preferences.plugs === 'yes' ? 'primary.main' : 'grey.400',
                    backgroundColor: preferences.plugs === 'yes' ? 'primary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {preferences.plugs === 'yes' && (
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                    )}
                    </Box>
                </CardContent>
              </Card>

              {/* No Plugs Option */}
              <Card 
                elevation={preferences.plugs === 'no' ? 8 : 2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  border: preferences.plugs === 'no' ? '3px solid' : '1px solid',
                  borderColor: preferences.plugs === 'no' ? 'primary.main' : 'divider',
                  backgroundColor: preferences.plugs === 'no' ? 'primary.50' : 'white',
                  transform: preferences.plugs === 'no' ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handlePreferenceChange('plugs', preferences.plugs === 'no' ? '' : 'no')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    fontSize: '1.1rem',
                    color: preferences.plugs === 'no' ? 'primary.main' : 'text.primary'
                  }}>
                    No, plugs not needed
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        I don't need to charge my devices
                      </Typography>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: preferences.plugs === 'no' ? 'none' : '2px solid',
                    borderColor: preferences.plugs === 'no' ? 'primary.main' : 'grey.400',
                    backgroundColor: preferences.plugs === 'no' ? 'primary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {preferences.plugs === 'no' && (
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                    )}
                    </Box>
                </CardContent>
              </Card>

              {/* No Preference Option */}
              <Card 
                elevation={preferences.plugs === 'none' ? 8 : 2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  border: preferences.plugs === 'none' ? '3px solid' : '1px solid',
                  borderColor: preferences.plugs === 'none' ? 'primary.main' : 'divider',
                  backgroundColor: preferences.plugs === 'none' ? 'primary.50' : 'white',
                  transform: preferences.plugs === 'none' ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handlePreferenceChange('plugs', preferences.plugs === 'none' ? '' : 'none')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    fontSize: '1.1rem',
                    color: preferences.plugs === 'none' ? 'primary.main' : 'text.primary'
                  }}>
                    No Preference
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Power outlets don't matter to me
                      </Typography>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: preferences.plugs === 'none' ? 'none' : '2px solid',
                    borderColor: preferences.plugs === 'none' ? 'primary.main' : 'grey.400',
                    backgroundColor: preferences.plugs === 'none' ? 'primary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {preferences.plugs === 'none' && (
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                    )}
                    </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        );

      case 7:
        return (
          <Box sx={{ width: '100%' }}>
            <Typography variant="h5" component="h2" sx={{ 
              fontWeight: 'bold', 
              mb: 3, 
              textAlign: 'center',
              color: 'text.primary'
            }}>
              {prompts.ambience}
            </Typography>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
              maxWidth: 800,
              mx: 'auto'
            }}>
              {/* Quiet Option */}
              <Card 
                elevation={preferences.ambience === 'quiet' ? 8 : 2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  border: preferences.ambience === 'quiet' ? '3px solid' : '1px solid',
                  borderColor: preferences.ambience === 'quiet' ? 'primary.main' : 'divider',
                  backgroundColor: preferences.ambience === 'quiet' ? 'primary.50' : 'white',
                  transform: preferences.ambience === 'quiet' ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handlePreferenceChange('ambience', preferences.ambience === 'quiet' ? '' : 'quiet')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    fontSize: '1.1rem',
                    color: preferences.ambience === 'quiet' ? 'primary.main' : 'text.primary'
                  }}>
                    Quiet
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Peaceful, calm atmosphere for relaxation
                      </Typography>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: preferences.ambience === 'quiet' ? 'none' : '2px solid',
                    borderColor: preferences.ambience === 'quiet' ? 'primary.main' : 'grey.400',
                    backgroundColor: preferences.ambience === 'quiet' ? 'primary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {preferences.ambience === 'quiet' && (
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                    )}
                    </Box>
                </CardContent>
              </Card>

              {/* Crowded Option */}
              <Card 
                elevation={preferences.ambience === 'crowded' ? 8 : 2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  border: preferences.ambience === 'crowded' ? '3px solid' : '1px solid',
                  borderColor: preferences.ambience === 'crowded' ? 'primary.main' : 'divider',
                  backgroundColor: preferences.ambience === 'crowded' ? 'primary.50' : 'white',
                  transform: preferences.ambience === 'crowded' ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handlePreferenceChange('ambience', preferences.ambience === 'crowded' ? '' : 'crowded')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    fontSize: '1.1rem',
                    color: preferences.ambience === 'crowded' ? 'primary.main' : 'text.primary'
                  }}>
                    Crowded
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Lively, energetic atmosphere with lots of people
                      </Typography>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: preferences.ambience === 'crowded' ? 'none' : '2px solid',
                    borderColor: preferences.ambience === 'crowded' ? 'primary.main' : 'grey.400',
                    backgroundColor: preferences.ambience === 'crowded' ? 'primary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {preferences.ambience === 'crowded' && (
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                    )}
                    </Box>
                </CardContent>
              </Card>

              {/* No Preference Option */}
              <Card 
                elevation={preferences.ambience === 'none' ? 8 : 2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  border: preferences.ambience === 'none' ? '3px solid' : '1px solid',
                  borderColor: preferences.ambience === 'none' ? 'primary.main' : 'divider',
                  backgroundColor: preferences.ambience === 'none' ? 'primary.50' : 'white',
                  transform: preferences.ambience === 'none' ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handlePreferenceChange('ambience', preferences.ambience === 'none' ? '' : 'none')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    fontSize: '1.1rem',
                    color: preferences.ambience === 'none' ? 'primary.main' : 'text.primary'
                  }}>
                    No Preference
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Atmosphere doesn't matter to me
                      </Typography>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: preferences.ambience === 'none' ? 'none' : '2px solid',
                    borderColor: preferences.ambience === 'none' ? 'primary.main' : 'grey.400',
                    backgroundColor: preferences.ambience === 'none' ? 'primary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {preferences.ambience === 'none' && (
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                    )}
                    </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        );

      case 8:
        return (
          <Box sx={{ width: '100%' }}>
            <Typography variant="h5" component="h2" sx={{ 
              fontWeight: 'bold', 
              mb: 3, 
              textAlign: 'center',
              color: 'text.primary'
            }}>
              {prompts.wheelchair}
            </Typography>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
              maxWidth: 800,
              mx: 'auto'
            }}>
              {/* Yes Accessibility Option */}
              <Card 
                elevation={preferences.wheelchair === 'yes' ? 8 : 2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  border: preferences.wheelchair === 'yes' ? '3px solid' : '1px solid',
                  borderColor: preferences.wheelchair === 'yes' ? 'primary.main' : 'divider',
                  backgroundColor: preferences.wheelchair === 'yes' ? 'primary.50' : 'white',
                  transform: preferences.wheelchair === 'yes' ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handlePreferenceChange('wheelchair', preferences.wheelchair === 'yes' ? '' : 'yes')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    fontSize: '1.1rem',
                    color: preferences.wheelchair === 'yes' ? 'primary.main' : 'text.primary'
                  }}>
                    Yes, I need wheelchair accessibility
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        I require wheelchair-accessible facilities
                      </Typography>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: preferences.wheelchair === 'yes' ? 'none' : '2px solid',
                    borderColor: preferences.wheelchair === 'yes' ? 'primary.main' : 'grey.400',
                    backgroundColor: preferences.wheelchair === 'yes' ? 'primary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {preferences.wheelchair === 'yes' && (
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                    )}
                    </Box>
                </CardContent>
              </Card>

              {/* No Accessibility Option */}
              <Card 
                elevation={preferences.wheelchair === 'no' ? 8 : 2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  border: preferences.wheelchair === 'no' ? '3px solid' : '1px solid',
                  borderColor: preferences.wheelchair === 'no' ? 'primary.main' : 'divider',
                  backgroundColor: preferences.wheelchair === 'no' ? 'primary.50' : 'white',
                  transform: preferences.wheelchair === 'no' ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handlePreferenceChange('wheelchair', preferences.wheelchair === 'no' ? '' : 'no')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    fontSize: '1.1rem',
                    color: preferences.wheelchair === 'no' ? 'primary.main' : 'text.primary'
                  }}>
                    No, accessibility not needed
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        I don't require wheelchair accessibility
                      </Typography>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: preferences.wheelchair === 'no' ? 'none' : '2px solid',
                    borderColor: preferences.wheelchair === 'no' ? 'primary.main' : 'grey.400',
                    backgroundColor: preferences.wheelchair === 'no' ? 'primary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {preferences.wheelchair === 'no' && (
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                    )}
                    </Box>
                </CardContent>
              </Card>

              {/* No Preference Option */}
              <Card 
                elevation={preferences.wheelchair === 'none' ? 8 : 2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  border: preferences.wheelchair === 'none' ? '3px solid' : '1px solid',
                  borderColor: preferences.wheelchair === 'none' ? 'primary.main' : 'divider',
                  backgroundColor: preferences.wheelchair === 'none' ? 'primary.50' : 'white',
                  transform: preferences.wheelchair === 'none' ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handlePreferenceChange('wheelchair', preferences.wheelchair === 'none' ? '' : 'none')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    fontSize: '1.1rem',
                    color: preferences.wheelchair === 'none' ? 'primary.main' : 'text.primary'
                  }}>
                    No Preference
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Accessibility doesn't matter to me
                      </Typography>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    border: preferences.wheelchair === 'none' ? 'none' : '2px solid',
                    borderColor: preferences.wheelchair === 'none' ? 'primary.main' : 'grey.400',
                    backgroundColor: preferences.wheelchair === 'none' ? 'primary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {preferences.wheelchair === 'none' && (
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '12px' }}>✓</Typography>
                    )}
                    </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };


  return (
    <Box>
      {/* Header Section */}
      <Fade in timeout={600}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #f06292 0%, #e91e63 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
          Tell Us About Your Preferences
        </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ 
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
          Help us find the perfect places for your weekend adventure
        </Typography>
        
        {/* Stepper */}
          <Slide direction="up" in timeout={800}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                borderRadius: 3, 
                mb: 4,
                background: 'linear-gradient(135deg, rgba(240, 98, 146, 0.2) 0%, rgba(233, 30, 99, 0.2) 100%)',
                border: '1px solid rgba(240, 98, 146, 0.4)',
                backdropFilter: 'blur(10px)',
              }}
            >
          <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                  <Step key={label} completed={isStepCompleted(index)}>
                    <StepLabel 
                      sx={{ 
                        '& .MuiStepLabel-label': { 
                          fontSize: '0.875rem',
                          fontWeight: 600,
                        },
                        '& .MuiStepLabel-iconContainer': {
                          '& .MuiSvgIcon-root': {
                            fontSize: '1.5rem',
                          }
                        }
                      }}
                    >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
          </Slide>
      </Box>
      </Fade>

      {error && (
        <Fade in timeout={300}>
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4,
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
            }}
          >
          {error}
        </Alert>
        </Fade>
      )}

      {/* Main Form Card */}
      <Grow in timeout={1000}>
        <Card 
          elevation={0} 
          sx={{ 
            borderRadius: 4, 
            overflow: 'hidden',
            border: '1px solid rgba(240, 98, 146, 0.4)',
            boxShadow: '0 20px 40px rgba(240, 98, 146, 0.3)',
          }}
        >
        <Box sx={{ 
                  background: 'linear-gradient(135deg, #f06292 0%, #e91e63 100%)',
            p: 4,
          color: 'white',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
              pointerEvents: 'none',
            }
          }}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                position: 'relative',
                zIndex: 1,
              }}
            >
            {steps[activeStep]}
          </Typography>
        </Box>
        
          <CardContent sx={{ p: 6 }}>
            <Box sx={{ mb: 6 }}>
              <Fade in timeout={600} key={activeStep}>
                <Box>
            {renderStepContent(activeStep)}
                </Box>
              </Fade>
          </Box>

          {/* Selected Preferences Summary */}
          {Object.keys(preferences).length > 0 && (
              <Slide direction="up" in timeout={400}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    mb: 4, 
                    background: 'linear-gradient(135deg, rgba(240, 98, 146, 0.2) 0%, rgba(233, 30, 99, 0.2) 100%)',
                    border: '1px solid rgba(240, 98, 146, 0.4)',
                    borderRadius: 3,
                  }}
                >
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      color: 'text.primary',
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                Your selections so far:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {Object.entries(preferences)
                  .filter(([key, value]) => value && value !== '')
                  .map(([key, value]) => (
                  <Chip 
                    key={key} 
                    label={`${key.replace('_', ' ')}: ${value}`}
                        size="medium"
                        sx={{
                          background: 'linear-gradient(135deg, #f06292 0%, #e91e63 100%)',
                          color: 'white',
                          fontWeight: 500,
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                  />
                ))}
              </Stack>
            </Paper>
              </Slide>
          )}

            <Divider sx={{ mb: 4, borderColor: 'rgba(248, 187, 217, 0.3)' }} />

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              size="large"
                sx={{ 
                  minWidth: 140,
                  px: 4,
                  py: 2,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    backgroundColor: 'primary.main',
                    color: 'white',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease',
                }}
            >
              Back
            </Button>
            
              <Box sx={{ display: 'flex', gap: 3 }}>
              <Button
                variant="text"
                onClick={() => navigate('/')}
                  sx={{ 
                    color: 'text.secondary',
                    fontWeight: 500,
                    '&:hover': {
                      color: 'text.primary',
                      backgroundColor: 'rgba(240, 98, 146, 0.25)',
                    },
                    transition: 'all 0.2s ease',
                  }}
              >
                Cancel
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  size="large"
                  sx={{ 
                      minWidth: 220,
                      px: 6,
                      py: 2,
                      background: 'linear-gradient(135deg, #f06292 0%, #e91e63 100%)',
                      boxShadow: '0 8px 25px rgba(240, 98, 146, 0.5)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #ec407a 0%, #d81b60 100%)',
                        boxShadow: '0 12px 35px rgba(240, 98, 146, 0.6)',
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        background: 'rgba(240, 98, 146, 0.5)',
                        color: 'white',
                      },
                      transition: 'all 0.3s ease',
                  }}
                >
                  {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CircularProgress size={20} color="inherit" />
                      <span>Getting Recommendations...</span>
                    </Box>
                  ) : (
                    'Get My Recommendations'
                  )}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  size="large"
                  sx={{ 
                      minWidth: 140,
                      px: 4,
                      py: 2,
                      background: 'linear-gradient(135deg, #f06292 0%, #e91e63 100%)',
                      boxShadow: '0 6px 20px rgba(240, 98, 146, 0.45)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #ec407a 0%, #d81b60 100%)',
                        boxShadow: '0 8px 25px rgba(240, 98, 146, 0.55)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                  }}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
      </Grow>
    </Box>
  );
};

export default PreferenceForm;
