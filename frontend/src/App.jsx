import React, { useState, useEffect } from 'react'
import { 
  Box, 
  Container, 
  Tab, 
  Tabs, 
  Typography, 
  Paper, 
  IconButton, 
  Tooltip,
  Chip,
  Fade,
  Zoom,
  useTheme,
  alpha,
  Divider
} from '@mui/material'
import { styled, keyframes } from '@mui/material/styles'
import GitHubIcon from '@mui/icons-material/GitHub'
import InfoIcon from '@mui/icons-material/Info'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import SchoolIcon from '@mui/icons-material/School'
import FunctionsIcon from '@mui/icons-material/Functions'

// Import components for each project
import RelationToGraph from './components/RelationToGraph'
import BooleanOperations from './components/BooleanOperations'
import BooleanMultiplication from './components/BooleanMultiplication'
import RelationPower from './components/RelationPower'
import RelationProperties from './components/RelationProperties'
import RelationClosures from './components/RelationClosures'
import RelationComposition from './components/RelationComposition'
import GraphVisualizer from './components/GraphVisualizer'
import VertexDegree from './components/VertexDegree'
import ComplementMatrix from './components/ComplementMatrix'
import SubgraphChecker from './components/SubgraphChecker'
import ConnectivityChecker from './components/ConnectivityChecker'
import PathLengthCalculator from './components/PathLengthCalculator'
import EulerianPath from './components/EulerianPath'
import DijkstraAlgorithm from './components/DijkstraAlgorithm'

// Gradient animation
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

// Glow animation
const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
  50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.8), 0 0 30px rgba(99, 102, 241, 0.4); }
  100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
`

// Enhanced Header with gradient
const StyledHeader = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundSize: '200% 200%',
  animation: `${gradientAnimation} 15s ease infinite`,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
    transform: 'translateX(-100%)',
    animation: 'shimmer 3s infinite',
  },
  '@keyframes shimmer': {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' },
  },
}))

// Enhanced Tabs Container
const TabsContainer = styled(Box)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(20px)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1),
  marginBottom: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #667eea, #764ba2, transparent)',
    backgroundSize: '200% 100%',
    animation: `${gradientAnimation} 3s linear infinite`,
  },
}))

// Enhanced Styled Tabs
const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 60,
  '& .MuiTabs-indicator': {
    height: 3,
    borderRadius: '3px 3px 0 0',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)',
  },
  '& .MuiTabs-scrollButtons': {
    color: theme.palette.primary.main,
    '&.Mui-disabled': {
      opacity: 0.3,
    },
  },
  '& .MuiTabs-flexContainer': {
    gap: theme.spacing(0.5),
  },
}))

// Enhanced Styled Tab
const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 140,
  minHeight: 50,
  fontWeight: 500,
  fontSize: '0.9rem',
  marginRight: theme.spacing(0.5),
  color: alpha(theme.palette.text.primary, 0.7),
  borderRadius: theme.spacing(1.5, 1.5, 0, 0),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  background: alpha(theme.palette.background.paper, 0.5),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  borderBottom: 'none',
  
  '&:hover': {
    color: theme.palette.primary.main,
    background: alpha(theme.palette.primary.main, 0.08),
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
    
    '& .tab-number': {
      transform: 'scale(1.1)',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
    },
  },
  
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    fontWeight: 600,
    background: alpha(theme.palette.primary.main, 0.1),
    borderColor: alpha(theme.palette.primary.main, 0.3),
    animation: `${glowAnimation} 2s ease-in-out infinite`,
    
    '& .tab-number': {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      transform: 'scale(1.05)',
    },
    
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%',
      height: '3px',
      background: 'linear-gradient(90deg, transparent, #667eea, #764ba2, transparent)',
      borderRadius: '3px',
    },
  },
  
  '& .MuiTab-wrapper': {
    flexDirection: 'row',
    gap: theme.spacing(1),
  },
}))

// Tab number badge
const TabNumber = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 28,
  height: 28,
  padding: '0 8px',
  borderRadius: '14px',
  fontSize: '0.75rem',
  fontWeight: 700,
  background: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  transition: 'all 0.3s ease',
  marginRight: theme.spacing(0.5),
}))

// Content Container with animation
const ContentContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  background: alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  minHeight: '500px',
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    background: 'linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c)',
    borderRadius: theme.spacing(2),
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: -1,
  },
  
  '&:hover::before': {
    opacity: 0.1,
  },
}))

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in={true} timeout={500}>
          <Box>{children}</Box>
        </Fade>
      )}
    </div>
  )
}

function App() {
  const [value, setValue] = useState(0)
  const theme = useTheme()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const tabs = [
    { label: 'رابطه به گراف', number: '۲', component: <RelationToGraph /> },
    { label: 'عملیات بولی', number: '۳', component: <BooleanOperations /> },
    { label: 'ضرب بولی', number: '۴', component: <BooleanMultiplication /> },
    { label: 'توان رابطه', number: '۵', component: <RelationPower /> },
    { label: 'خواص رابطه', number: '۶', component: <RelationProperties /> },
    { label: 'بستارهای رابطه', number: '۷-۸-۹', component: <RelationClosures /> },
    { label: 'ترکیب روابط', number: '۱۰', component: <RelationComposition /> },
    { label: 'رسم گراف', number: '۱۱', component: <GraphVisualizer /> },
    { label: 'درجه رئوس', number: '۱۲', component: <VertexDegree /> },
    { label: 'ماتریس مکمل', number: '۱۳', component: <ComplementMatrix /> },
    { label: 'زیرگراف', number: '۱۴', component: <SubgraphChecker /> },
    { label: 'همبندی', number: '۱۵', component: <ConnectivityChecker /> },
    { label: 'طول مسیر', number: '۱۶', component: <PathLengthCalculator /> },
    { label: 'مسیر اویلری', number: '۱۷', component: <EulerianPath /> },
    { label: 'دایکسترا', number: '۱۸', component: <DijkstraAlgorithm /> },
  ]

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      backgroundAttachment: 'fixed',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      }
    }}>
      <Container maxWidth="xl" sx={{ pt: 4, pb: 4 }}>
        <Zoom in={true} timeout={800}>
          <StyledHeader elevation={0}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              position: 'relative',
              zIndex: 1,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                  animation: `${glowAnimation} 3s ease-in-out infinite`,
                }}>
                  <FunctionsIcon sx={{ fontSize: 40, color: '#fff' }} />
                </Box>
                <Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 800,
                      color: '#fff',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                      letterSpacing: '-0.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    Discrete Mathematics
                    <AutoAwesomeIcon sx={{ fontSize: 30, color: '#ffd700' }} />
                  </Typography>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mt: 0.5,
                    }}
                  >
                    <SchoolIcon sx={{ fontSize: 18 }} />
                    Interactive Learning Tools & Calculators
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="About Project" arrow>
                  <IconButton 
                    sx={{ 
                      color: '#fff',
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.2)',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="View on GitHub" arrow>
                  <IconButton 
                    sx={{ 
                      color: '#fff',
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.2)',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <GitHubIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </StyledHeader>
        </Zoom>

        <Fade in={true} timeout={1000}>
          <TabsContainer>
            <StyledTabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              aria-label="discrete mathematics projects"
            >
              {tabs.map((tab, index) => (
                <StyledTab
                  key={index}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TabNumber className="tab-number">{tab.number}</TabNumber>
                      <span>{tab.label}</span>
                    </Box>
                  }
                  id={`project-tab-${index}`}
                  aria-controls={`project-tabpanel-${index}`}
                />
              ))}
            </StyledTabs>
          </TabsContainer>
        </Fade>

        <ContentContainer elevation={0}>
          {tabs.map((tab, index) => (
            <TabPanel key={index} value={value} index={index}>
              {tab.component}
            </TabPanel>
          ))}
        </ContentContainer>

        <Fade in={true} timeout={1200}>
          <Box sx={{ 
            mt: 4, 
            textAlign: 'center',
            p: 2,
            background: alpha(theme.palette.background.paper, 0.5),
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
          }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              © 2024 Discrete Mathematics Project • Built with React & Material-UI
            </Typography>
          </Box>
        </Fade>
      </Container>
    </Box>
  )
}

export default App