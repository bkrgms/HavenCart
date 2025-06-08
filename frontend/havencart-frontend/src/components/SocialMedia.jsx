import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Pinterest as PinterestIcon,
} from '@mui/icons-material';

const SocialMedia = () => {
  const socialLinks = [
    {
      name: 'Facebook',
      icon: <FacebookIcon />,
      url: 'https://facebook.com/havencart',
      color: '#1877F2',
    },
    {
      name: 'Twitter',
      icon: <TwitterIcon />,
      url: 'https://twitter.com/havencart',
      color: '#1DA1F2',
    },
    {
      name: 'Instagram',
      icon: <InstagramIcon />,
      url: 'https://instagram.com/havencart',
      color: '#E4405F',
    },
    {
      name: 'YouTube',
      icon: <YouTubeIcon />,
      url: 'https://youtube.com/havencart',
      color: '#FF0000',
    },
    {
      name: 'Pinterest',
      icon: <PinterestIcon />,
      url: 'https://pinterest.com/havencart',
      color: '#BD081C',
    },
  ];

  const handleShare = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h6" gutterBottom align="center">
        Bizi Takip Edin
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        {socialLinks.map((social) => (
          <Tooltip key={social.name} title={social.name}>
            <IconButton
              onClick={() => handleShare(social.url)}
              sx={{
                color: social.color,
                '&:hover': {
                  backgroundColor: `${social.color}15`,
                },
              }}
            >
              {social.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Stack>
    </Box>
  );
};

export default SocialMedia; 