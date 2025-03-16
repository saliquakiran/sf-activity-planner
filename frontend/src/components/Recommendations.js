import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Slide,
  Grow,
  Container,
} from '@mui/material';
import {
  LocationOn,
  Restaurant,
  Wifi,
  Power,
  WheelchairPickup,
  Schedule,
  Language,
  Share,
  ArrowBack,
  Map,
} from '@mui/icons-material';

const Recommendations = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const storedRecommendations = localStorage.getItem('recommendations');
    if (storedRecommendations) {
      try {
        const data = JSON.parse(storedRecommendations);
        setRecommendations(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load recommendations data.');
        setLoading(false);
      }
    } else {
      setError('No recommendations found. Please start over.');
      setLoading(false);
    }
  }, []);

  const handlePlaceClick = (place) => {
    setSelectedPlace(place);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPlace(null);
  };

  const formatTimings = (timings) => {
    const days = ['friday', 'saturday', 'sunday'];
    return days.map(day => ({
      day: day.charAt(0).toUpperCase() + day.slice(1),
      time: timings[day] || 'N/A'
    }));
  };


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Box textAlign="center">
          <Button
            variant="contained"
            onClick={() => navigate('/preferences')}
            startIcon={<ArrowBack />}
          >
            Start Over
          </Button>
        </Box>
      </Box>
    );
  }

  if (!recommendations || recommendations.count === 0) {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 3 }}>
          No places match your criteria. Try adjusting your preferences!
        </Alert>
        <Box textAlign="center">
          <Button
            variant="contained"
            onClick={() => navigate('/preferences')}
            startIcon={<ArrowBack />}
          >
            Adjust Preferences
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Fade in timeout={600}>
        <Box sx={{ mb: 6 }}>
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between" 
            mb={4}
            sx={{
              background: 'linear-gradient(135deg, rgba(240, 98, 146, 0.2) 0%, rgba(233, 30, 99, 0.2) 100%)',
              p: 4,
              borderRadius: 3,
              border: '1px solid rgba(240, 98, 146, 0.4)',
            }}
          >
            <Typography 
              variant="h3" 
              component="h1"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #f06292 0%, #e91e63 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Your Personalized Recommendations
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/preferences')}
              startIcon={<ArrowBack />}
              sx={{
                px: 4,
                py: 2,
                borderColor: 'primary.main',
                color: 'primary.main',
                borderWidth: 2,
                fontWeight: 600,
                '&:hover': {
                  borderWidth: 2,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Try Again
            </Button>
          </Box>

          <Slide direction="up" in timeout={800}>
            <Alert 
              severity="info" 
              sx={{ 
                mb: 4,
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(240, 98, 146, 0.3) 0%, rgba(233, 30, 99, 0.3) 100%)',
                border: '1px solid rgba(240, 98, 146, 0.5)',
                '& .MuiAlert-message': {
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }
              }}
            >
              🎉 Found {recommendations.count} perfect place{recommendations.count !== 1 ? 's' : ''} for your weekend!
            </Alert>
          </Slide>
        </Box>
      </Fade>

      <Grid container spacing={4}>
        {recommendations.recommendations.map((place, index) => (
          <Grid item xs={12} md={6} lg={4} key={place.id}>
            <Grow in timeout={1000 + index * 200}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  border: '1px solid rgba(240, 98, 146, 0.4)',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(240, 98, 146, 0.2) 0%, rgba(233, 30, 99, 0.2) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  },
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(240, 98, 146, 0.35)',
                    borderColor: 'primary.main',
                    '&::before': {
                      opacity: 1,
                    }
                  }
                }}
                onClick={() => handlePlaceClick(place)}
              >
                <CardContent sx={{ flexGrow: 1, p: 4, position: 'relative', zIndex: 1 }}>
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      color: 'text.primary',
                      mb: 2,
                    }}
                  >
                    {place.name}
                  </Typography>
                  
                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 3,
                      lineHeight: 1.6,
                    }}
                  >
                    {place.description}
                  </Typography>

                  <Box 
                    display="flex" 
                    alignItems="center" 
                    mb={3}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: 'rgba(240, 98, 146, 0.25)',
                      border: '1px solid rgba(240, 98, 146, 0.4)',
                    }}
                  >
                    <LocationOn 
                      sx={{ 
                        mr: 1.5, 
                        fontSize: '1.25rem',
                        color: '#f48fb1',
                      }} 
                    />
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      {place.address}
                    </Typography>
                  </Box>

                  <Box display="flex" flexWrap="wrap" gap={1} mt={3}>
                    {place.amenities && place.amenities.food === 'yes' && (
                      <Chip 
                        icon={<Restaurant />} 
                        size="small" 
                        sx={{
                          background: 'linear-gradient(135deg, rgba(240, 98, 146, 0.35) 0%, rgba(244, 143, 177, 0.25) 100%)',
                          color: '#e91e63',
                          fontWeight: 500,
                          border: '1px solid rgba(240, 98, 146, 0.5)',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            background: 'linear-gradient(135deg, rgba(248, 187, 217, 0.35) 0%, rgba(244, 143, 177, 0.35) 100%)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      />
                    )}
                    {place.amenities && place.amenities.wifi === 'yes' && (
                      <Chip 
                        icon={<Wifi />} 
                        size="small" 
                        sx={{
                          background: 'linear-gradient(135deg, rgba(240, 98, 146, 0.35) 0%, rgba(244, 143, 177, 0.25) 100%)',
                          color: '#e91e63',
                          fontWeight: 500,
                          border: '1px solid rgba(240, 98, 146, 0.5)',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            background: 'linear-gradient(135deg, rgba(248, 187, 217, 0.35) 0%, rgba(244, 143, 177, 0.35) 100%)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      />
                    )}
                    {place.amenities && place.amenities.plugs === 'yes' && (
                      <Chip 
                        icon={<Power />} 
                        size="small" 
                        sx={{
                          background: 'linear-gradient(135deg, rgba(240, 98, 146, 0.35) 0%, rgba(244, 143, 177, 0.25) 100%)',
                          color: '#e91e63',
                          fontWeight: 500,
                          border: '1px solid rgba(240, 98, 146, 0.5)',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            background: 'linear-gradient(135deg, rgba(248, 187, 217, 0.35) 0%, rgba(244, 143, 177, 0.35) 100%)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      />
                    )}
                    {place.amenities && place.amenities.wheelchair === 'yes' && (
                      <Chip 
                        icon={<WheelchairPickup />} 
                        size="small" 
                        sx={{
                          background: 'linear-gradient(135deg, rgba(240, 98, 146, 0.35) 0%, rgba(244, 143, 177, 0.25) 100%)',
                          color: '#e91e63',
                          fontWeight: 500,
                          border: '1px solid rgba(240, 98, 146, 0.5)',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            background: 'linear-gradient(135deg, rgba(248, 187, 217, 0.35) 0%, rgba(244, 143, 177, 0.35) 100%)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>

      {/* Place Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 25px 50px rgba(240, 98, 146, 0.35)',
                  border: '1px solid rgba(240, 98, 146, 0.4)',
            overflow: 'hidden',
            maxHeight: '90vh',
          }
        }}
      >
        {selectedPlace && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">{selectedPlace.name}</Typography>
                <IconButton onClick={handleCloseDialog}>
                  <ArrowBack sx={{ color: '#f48fb1' }} />
                </IconButton>
              </Box>
            </DialogTitle>
            
            <DialogContent sx={{ 
              overflow: 'auto',
              maxHeight: 'calc(90vh - 120px)',
              px: 3,
              py: 2
            }}>
              <Typography variant="body1" paragraph>
                {selectedPlace.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Location Details
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <LocationOn sx={{ color: '#f48fb1' }} />
                      </ListItemIcon>
                      <ListItemText 
                        secondary={selectedPlace.address}
                      />
                    </ListItem>
                    {selectedPlace.website !== 'N/A' && (
                      <ListItem>
                        <ListItemIcon>
                          <Language sx={{ color: '#f48fb1' }} />
                        </ListItemIcon>
                        <ListItemText 
                          secondary={
                            <Button
                              variant="text"
                              size="small"
                              href={selectedPlace.website}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Visit Website
                            </Button>
                          }
                        />
                      </ListItem>
                    )}
                  </List>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Weekend Hours
                  </Typography>
                  <List dense>
                    {formatTimings(selectedPlace.timings).map(({ day, time }) => (
                      <ListItem key={day}>
                        <ListItemIcon>
                          <Schedule sx={{ color: '#f48fb1' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={day}
                          secondary={time}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>

              <Box mt={3}>
                <Button
                  variant="contained"
                  startIcon={<Map />}
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPlace.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  fullWidth
                >
                  View on Google Maps
                </Button>
              </Box>
            </DialogContent>

            <DialogActions sx={{ 
              px: 3, 
              py: 2, 
              gap: 2,
              justifyContent: 'flex-end',
              '& .MuiButton-root': {
                minWidth: 'auto',
                px: 2,
              }
            }}>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button
                variant="contained"
                startIcon={<Share />}
                onClick={async () => {
                  if (navigator.share) {
                    try {
                      await navigator.share({
                        title: selectedPlace.name,
                        text: selectedPlace.description,
                        url: selectedPlace.website !== 'N/A' ? selectedPlace.website : undefined
                      });
                    } catch (error) {
                      // User canceled the share dialog or an error occurred
                      // Silently handle the error - no need to show anything to the user
                      console.log('Share canceled or failed:', error.message);
                    }
                  }
                }}
              >
                Share
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Box mt={4} textAlign="center">
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/preferences')}
          sx={{ mr: 2 }}
        >
          Get New Recommendations
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default Recommendations;
