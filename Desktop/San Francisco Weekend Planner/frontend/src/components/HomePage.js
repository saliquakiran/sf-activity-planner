import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Container,
  Paper,
  Fade,
  Slide,
  Grow,
} from '@mui/material';
const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Fade in timeout={800}>
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
              mb: 3,
            }}
          >
            Welcome to SF Weekend Planner
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
            Discover the perfect places to visit in San Francisco based on your preferences
          </Typography>
          
          <Slide direction="up" in timeout={1000}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/preferences')}
              sx={{ 
                px: 6, 
                py: 3, 
                fontSize: '1.25rem',
                fontWeight: 700,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #f06292 0%, #e91e63 100%)',
                boxShadow: '0 10px 25px rgba(240, 98, 146, 0.5)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #ec407a 0%, #d81b60 100%)',
                  boxShadow: '0 15px 35px rgba(240, 98, 146, 0.6)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Start Planning Your Weekend
            </Button>
          </Slide>
        </Box>
      </Fade>

      <Grow in timeout={1200}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 8, 
            mb: 6, 
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(240, 98, 146, 0.2) 0%, rgba(233, 30, 99, 0.2) 100%)',
            border: '1px solid rgba(240, 98, 146, 0.4)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom 
            align="center" 
            sx={{ 
              mb: 6,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #f06292 0%, #e91e63 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            How It Works
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {[
              {
                step: 1,
                title: 'Answer Questions',
                description: 'Tell us about your preferences - location type, budget, vibe, and more',
                delay: 0,
              },
              {
                step: 2,
                title: 'Get Recommendations',
                description: 'Our expert system analyzes your preferences to find perfect matches',
                delay: 200,
              },
              {
                step: 3,
                title: 'Plan Your Weekend',
                description: 'Get detailed information including timings, addresses, and websites',
                delay: 400,
              },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={item.step}>
                <Grow in timeout={1400 + item.delay}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    textAlign: 'center',
                    maxWidth: 250,
                    mx: 'auto',
                    p: 2,
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(240, 98, 146, 0.4)',
                    }
                  }}>
                    <Box
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #f06292 0%, #e91e63 100%)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        margin: '0 auto 16px auto',
                        boxShadow: '0 6px 20px rgba(240, 98, 146, 0.5)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 8px 25px rgba(240, 98, 146, 0.6)',
                        }
                      }}
                    >
                      {item.step}
                    </Box>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 700,
                        mb: 1.5,
                        color: 'text.primary',
                        fontSize: '1.1rem',
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        lineHeight: 1.5,
                        fontSize: '0.875rem',
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grow>

      <Fade in timeout={1600}>
        <Box sx={{ textAlign: 'center', mt: 6, mb: 6 }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 600,
              mb: 4,
              color: 'text.primary',
            }}
          >
            Ready to discover your perfect weekend spots?
          </Typography>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/preferences')}
            sx={{ 
              mt: 2, 
              px: 6, 
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderColor: 'primary.main',
              color: 'primary.main',
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                backgroundColor: 'primary.main',
                color: 'white',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(240, 98, 146, 0.5)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Get Started Now
          </Button>
        </Box>
      </Fade>
    </Container>
  );
};

export default HomePage;
