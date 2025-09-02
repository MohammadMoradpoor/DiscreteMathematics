import React, { useState, useRef, useEffect, useMemo } from 'react'
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  Paper,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { toast } from 'react-toastify'
import ForceGraph2D from 'react-force-graph-2d'
import MatrixInput from './common/MatrixInput'
import GraphicEqIcon from '@mui/icons-material/GraphicEq'
import InfoIcon from '@mui/icons-material/Info'
import HubIcon from '@mui/icons-material/Hub'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong'
import RefreshIcon from '@mui/icons-material/Refresh'
import AutoGraphIcon from '@mui/icons-material/AutoGraph'
import SettingsIcon from '@mui/icons-material/Settings'

const GraphVisualizer = () => {
  const [matrix, setMatrix] = useState([
    [0, 1, 1, 0, 0],
    [1, 0, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [0, 1, 1, 0, 1],
    [0, 0, 1, 1, 0]
  ])
  const [graphData, setGraphData] = useState(null)
  const [showLabels, setShowLabels] = useState(true)
  const [nodeSize, setNodeSize] = useState(5)
  const [linkWidth, setLinkWidth] = useState(1)
  const [graphKey, setGraphKey] = useState(0)
  const [dimensions, setDimensions] = useState({ width: 800, height: 450 })
  const graphRef = useRef()
  const containerRef = useRef()

  // Professional color palette
  const colorSchemes = {
    default: {
      nodes: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'],
      link: '#94a3b8',
      background: '#ffffff'
    },
    dark: {
      nodes: ['#60a5fa', '#a78bfa', '#f9a8d4', '#fbbf24', '#34d399', '#f87171'],
      link: '#475569',
      background: '#1e293b'
    }
  }
  
  const [colorScheme, setColorScheme] = useState('default')
  const colors = colorSchemes[colorScheme]

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensions({
          width: rect.width,
          height: 450
        })
      }
    }
    
    // Initial size calculation
    handleResize()
    
    // Add resize listener
    window.addEventListener('resize', handleResize)
    
    // Use ResizeObserver for more accurate size tracking
    const resizeObserver = new ResizeObserver(handleResize)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }
    
    return () => {
      window.removeEventListener('resize', handleResize)
      resizeObserver.disconnect()
    }
  }, [graphData])

  const generateGraphData = () => {
    const nodes = []
    const links = []
    const n = matrix.length

    // Calculate degrees for node sizing
    const degrees = new Array(n).fill(0)
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (matrix[i][j] === 1) {
          degrees[i]++
        }
      }
    }

    // Create nodes with proportional sizing
    const maxDegree = Math.max(...degrees, 1)
    for (let i = 0; i < n; i++) {
      const sizeFactor = 0.5 + (degrees[i] / maxDegree) * 0.5
      nodes.push({
        id: i.toString(),
        name: String.fromCharCode(65 + i),
        val: sizeFactor,
        color: colors.nodes[i % colors.nodes.length],
        degree: degrees[i]
      })
    }

    // Create links avoiding duplicates
    const linkMap = new Map()
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (matrix[i][j] === 1) {
          const linkKey = `${i}-${j}`
          if (!linkMap.has(linkKey)) {
            links.push({
              source: i.toString(),
              target: j.toString(),
              curvature: i === j ? 0.8 : 0.1
            })
            linkMap.set(linkKey, true)
          }
        }
      }
    }

    setGraphData({ nodes, links })
    setGraphKey(prev => prev + 1)
    toast.success('گراف با موفقیت رسم شد!')
    
    // Auto-center after generation with proper delay
    setTimeout(() => {
      if (graphRef.current) {
        graphRef.current.zoomToFit(400, 40)
      }
    }, 1000)
  }

  // Advanced graph analysis
  const graphAnalysis = useMemo(() => {
    if (!graphData) return null

    const n = graphData.nodes.length
    const m = graphData.links.length
    
    // Check if directed
    const isDirected = !matrix.every((row, i) => 
      row.every((val, j) => val === matrix[j]?.[i])
    )
    
    // Check connectivity using DFS
    const visited = new Array(n).fill(false)
    const stack = [0]
    visited[0] = true
    let visitedCount = 1
    
    while (stack.length > 0) {
      const current = stack.pop()
      for (let i = 0; i < n; i++) {
        if ((matrix[current][i] === 1 || (!isDirected && matrix[i][current] === 1)) && !visited[i]) {
          visited[i] = true
          visitedCount++
          stack.push(i)
        }
      }
    }
    
    const isConnected = visitedCount === n
    
    // Calculate density
    const maxEdges = isDirected ? n * n : (n * (n + 1)) / 2
    const density = maxEdges > 0 ? m / maxEdges : 0
    
    // Check for self-loops
    const hasSelfLoops = matrix.some((row, i) => row[i] === 1)
    
    // Degree statistics
    const degrees = graphData.nodes.map(node => node.degree)
    const avgDegree = degrees.reduce((a, b) => a + b, 0) / n
    
    return {
      numVertices: n,
      numEdges: m,
      isDirected,
      isConnected,
      density,
      hasSelfLoops,
      avgDegree: avgDegree.toFixed(2),
      maxDegree: Math.max(...degrees),
      minDegree: Math.min(...degrees)
    }
  }, [graphData, matrix])

  const handleZoomIn = () => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom()
      graphRef.current.zoom(currentZoom * 1.2, 300)
    }
  }
  
  const handleZoomOut = () => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom()
      graphRef.current.zoom(currentZoom * 0.8, 300)
    }
  }
  const handleCenter = () => graphRef.current?.zoomToFit(400, 40)
  const handleReset = () => {
    setGraphKey(prev => prev + 1)
    setTimeout(() => handleCenter(), 300)
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoGraphIcon sx={{ fontSize: 35 }} />
          ۱۱. رسم و تجزیه‌تحلیل گراف
        </Typography>
        <Typography variant="body1" color="text.secondary">
          نمایش حرفه‌ای گراف با تحلیل‌های پیشرفته
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ماتریس مجاورت
              </Typography>
              <MatrixInput 
                matrix={matrix}
                setMatrix={setMatrix}
                title=""
                showLabels={true}
               maxSize={7} minSize={2}/>
              
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={generateGraphData}
                  startIcon={<HubIcon />}
                  sx={{
                    background: 'linear-gradient(45deg, #3b82f6 30%, #8b5cf6 90%)',
                    py: 1.5
                  }}
                >
                  رسم و تحلیل گراف
                </Button>
              </Box>

              <Paper sx={{ p: 2, mt: 3, bgcolor: 'background.default' }}>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SettingsIcon fontSize="small" />
                  تنظیمات پیشرفته
                </Typography>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={showLabels}
                      onChange={(e) => setShowLabels(e.target.checked)}
                      size="small"
                    />
                  }
                  label="نمایش برچسب"
                  sx={{ mt: 1, mb: 2 }}
                />

                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>رنگ‌بندی</InputLabel>
                  <Select
                    value={colorScheme}
                    label="رنگ‌بندی"
                    onChange={(e) => setColorScheme(e.target.value)}
                  >
                    <MenuItem value="default">روشن</MenuItem>
                    <MenuItem value="dark">تیره</MenuItem>
                  </Select>
                </FormControl>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    اندازه گره: {nodeSize}px
                  </Typography>
                  <Slider
                    value={nodeSize}
                    onChange={(e, v) => setNodeSize(v)}
                    min={3}
                    max={10}
                    step={1}
                    marks
                    size="small"
                  />
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    ضخامت یال: {linkWidth}px
                  </Typography>
                  <Slider
                    value={linkWidth}
                    onChange={(e, v) => setLinkWidth(v)}
                    min={0.5}
                    max={2.5}
                    step={0.5}
                    marks
                    size="small"
                  />
                </Box>
              </Paper>

              <Paper sx={{ p: 2, mt: 2, bgcolor: 'info.50' }}>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon fontSize="small" />
                  راهنما
                </Typography>
                <List dense sx={{ p: 0 }}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText 
                      primary="جابجایی گره‌ها"
                      secondary="با ماوس می‌توانید گره‌ها را جابجا کنید"
                      primaryTypographyProps={{ variant: 'caption', fontWeight: 'bold' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText 
                      primary="زوم"
                      secondary="با اسکرول ماوس زوم کنید"
                      primaryTypographyProps={{ variant: 'caption', fontWeight: 'bold' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                </List>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={7}>
          {graphData ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">
                        نمایش گرافیکی
                      </Typography>
                      <Box>
                        <Tooltip title="بزرگنمایی">
                          <IconButton size="small" onClick={handleZoomIn}>
                            <ZoomInIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="کوچک‌نمایی">
                          <IconButton size="small" onClick={handleZoomOut}>
                            <ZoomOutIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="تنظیم مرکز">
                          <IconButton size="small" onClick={handleCenter}>
                            <CenterFocusStrongIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="بازنشانی">
                          <IconButton size="small" onClick={handleReset}>
                            <RefreshIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    
                    <Box 
                      ref={containerRef}
                      sx={{ 
                        width: '100%',
                        height: 450,
                        bgcolor: colors.background,
                        borderRadius: 1,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider',
                        position: 'relative'
                      }}
                    >
                      {dimensions.width > 0 && (
                        <ForceGraph2D
                          key={graphKey}
                          ref={graphRef}
                          graphData={graphData}
                          width={dimensions.width}
                          height={450}
                          backgroundColor={colors.background}
                          nodeRelSize={nodeSize}
                          nodeVal={node => node.val}
                          nodeLabel={node => `${node.name} (Degree: ${node.degree})`}
                          nodeColor={node => node.color}
                          linkWidth={linkWidth}
                          linkColor={() => colors.link}
                          linkDirectionalArrowLength={graphAnalysis?.isDirected ? 3 : 0}
                          linkDirectionalArrowRelPos={1}
                          linkCurvature="curvature"
                          nodeCanvasObject={(node, ctx, globalScale) => {
                            const size = nodeSize * node.val
                            
                            // Draw node
                            ctx.beginPath()
                            ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false)
                            ctx.fillStyle = node.color
                            ctx.fill()
                            
                            // Draw border
                            ctx.strokeStyle = colorScheme === 'dark' ? '#1e293b' : '#e2e8f0'
                            ctx.lineWidth = 1
                            ctx.stroke()

                            // Draw label
                            if (showLabels) {
                              ctx.font = `${9}px Arial`
                              ctx.textAlign = 'center'
                              ctx.textBaseline = 'middle'
                              ctx.fillStyle = colorScheme === 'dark' ? '#ffffff' : '#1e293b'
                              ctx.fillText(node.name, node.x, node.y)
                            }
                          }}
                          onNodeClick={(node) => {
                            toast.info(`گره ${node.name} - درجه: ${node.degree}`)
                          }}
                          onNodeHover={node => {
                            document.body.style.cursor = node ? 'pointer' : 'default'
                          }}
                          enableNodeDrag={true}
                          enableZoomInteraction={true}
                          enablePanInteraction={true}
                          minZoom={0.5}
                          maxZoom={5}
                          cooldownTicks={50}
                          warmupTicks={0}
                          d3AlphaDecay={0.02}
                          d3VelocityDecay={0.4}
                          d3Force={'charge'}
                          d3ForceConfig={{
                            charge: {
                              strength: -400,
                              distanceMax: 1000
                            },
                            link: {
                              distance: 120
                            },
                            center: {
                              x: dimensions.width / 2,
                              y: 225
                            }
                          }}
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {graphAnalysis && (
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        تحلیل گراف
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={4} md={3}>
                          <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: 'primary.50' }}>
                            <Typography variant="h6" color="primary">
                              {graphAnalysis.numVertices}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              رئوس
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} sm={4} md={3}>
                          <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: 'secondary.50' }}>
                            <Typography variant="h6" color="secondary">
                              {graphAnalysis.numEdges}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              یال‌ها
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} sm={4} md={3}>
                          <Paper sx={{ p: 1.5, textAlign: 'center' }}>
                            <Typography variant="h6">
                              {(graphAnalysis.density * 100).toFixed(0)}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              چگالی
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} sm={4} md={3}>
                          <Paper sx={{ p: 1.5, textAlign: 'center' }}>
                            <Typography variant="h6">
                              {graphAnalysis.avgDegree}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              میانگین درجه
                            </Typography>
                          </Paper>
                        </Grid>

                        <Grid item xs={12}>
                          <Divider sx={{ my: 1 }} />
                        </Grid>

                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip 
                              label={graphAnalysis.isDirected ? 'جهت‌دار' : 'بدون جهت'}
                              color={graphAnalysis.isDirected ? 'warning' : 'info'}
                              size="small"
                            />
                            <Chip 
                              label={graphAnalysis.isConnected ? 'همبند' : 'ناهمبند'}
                              color={graphAnalysis.isConnected ? 'success' : 'error'}
                              size="small"
                            />
                            {graphAnalysis.hasSelfLoops && (
                              <Chip label="دارای حلقه" color="secondary" size="small" />
                            )}
                            <Chip 
                              label={`درجه: ${graphAnalysis.minDegree}-${graphAnalysis.maxDegree}`}
                              variant="outlined"
                              size="small"
                            />
                          </Box>
                        </Grid>

                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">
                            درجه گره‌ها:
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
                            {graphData.nodes.map((node) => (
                              <Chip
                                key={node.id}
                                label={`${node.name}: ${node.degree}`}
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  borderColor: node.color,
                                  color: node.color
                                }}
                              />
                            ))}
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          ) : (
            <Alert severity="info" icon={<InfoIcon />}>
              <Typography variant="subtitle2" gutterBottom>
                ویژگی‌های نمایش:
              </Typography>
              <Box component="ul" sx={{ mt: 1, pl: 2, mb: 0 }}>
                <li>نمایش گراف با اندازه‌های استاندارد و حرفه‌ای</li>
                <li>اندازه گره‌ها متناسب با درجه آنها</li>
                <li>رنگ‌بندی هوشمند و قابل تنظیم</li>
                <li>تحلیل کامل ساختار گراف</li>
                <li>قابلیت تعامل با ماوس و صفحه‌کلید</li>
              </Box>
            </Alert>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default GraphVisualizer