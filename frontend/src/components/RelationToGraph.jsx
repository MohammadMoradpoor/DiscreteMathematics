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
  Divider,
  Switch,
  FormControlLabel,
  Slider,
  IconButton,
  Tooltip
} from '@mui/material'
import { toast } from 'react-toastify'
import ForceGraph2D from 'react-force-graph-2d'
import MatrixInput from './common/MatrixInput'
import GraphicEqIcon from '@mui/icons-material/GraphicEq'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import RefreshIcon from '@mui/icons-material/Refresh'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong'
import InfoIcon from '@mui/icons-material/Info'
import SettingsIcon from '@mui/icons-material/Settings'

const RelationToGraph = () => {
  const [matrix, setMatrixState] = useState([
    [0, 1, 1, 0],
    [1, 0, 1, 1],
    [0, 0, 0, 1],
    [0, 0, 1, 0]
  ])
  const [graphData, setGraphData] = useState(null)
  const [showLabels, setShowLabels] = useState(true)
  const [nodeSize, setNodeSize] = useState(6)
  const [linkWidth, setLinkWidth] = useState(1)
  const [graphKey, setGraphKey] = useState(0)
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 })
  const graphRef = useRef()
  const containerRef = useRef()

  // Validation wrapper for setMatrix to enforce 7×7 limit
  const setMatrix = (newMatrix) => {
    if (newMatrix.length > 7) {
      toast.error('اندازه ماتریس نمی‌تواند بیشتر از ۷×۷ باشد')
      return
    }
    setMatrixState(newMatrix)
  }

  // Professional color scheme
  const colors = {
    node: '#4f46e5',
    nodeStroke: '#312e81',
    nodeHover: '#6366f1',
    nodeText: '#ffffff',
    link: '#94a3b8',
    linkArrow: '#475569',
    background: '#f1f5f9'
  }

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensions({
          width: rect.width,
          height: 400
        })
      }
    }
    
    // Initial size
    handleResize()
    
    // Add resize listener
    window.addEventListener('resize', handleResize)
    
    // Observe container size changes
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
    // Double-check matrix size limit
    if (matrix.length > 7 || matrix[0]?.length > 7) {
      toast.error('اندازه ماتریس نباید بیشتر از ۷×۷ باشد')
      return
    }
    
    const nodes = []
    const links = []
    const n = matrix.length

    // Create nodes
    for (let i = 0; i < n; i++) {
      nodes.push({
        id: i.toString(),
        name: String.fromCharCode(65 + i),
        val: 1, // Use relative sizing
        color: colors.node
      })
    }

    // Create links
    const linkSet = new Set()
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (matrix[i][j] === 1) {
          const linkId = `${i}-${j}`
          if (!linkSet.has(linkId)) {
            links.push({
              source: i.toString(),
              target: j.toString(),
              curvature: i === j ? 0.8 : 0
            })
            linkSet.add(linkId)
          }
        }
      }
    }

    setGraphData({ nodes, links })
    setGraphKey(prev => prev + 1)
    toast.success('گراف با موفقیت ایجاد شد!')
    
    // Auto-fit after generation with delay for force simulation
    setTimeout(() => {
      if (graphRef.current) {
        graphRef.current.zoomToFit(400, 50)
      }
    }, 1000)
  }

  // Calculate graph statistics
  const graphStats = useMemo(() => {
    if (!graphData) return null

    const numNodes = graphData.nodes.length
    const numEdges = graphData.links.length
    const isDirected = !matrix.every((row, i) => 
      row.every((val, j) => val === matrix[j]?.[i])
    )
    
    const degrees = new Array(numNodes).fill(0)
    graphData.links.forEach(link => {
      const source = parseInt(link.source.id || link.source)
      const target = parseInt(link.target.id || link.target)
      degrees[source]++
      if (!isDirected && source !== target) {
        degrees[target]++
      }
    })

    const hasSelfLoops = graphData.links.some(link => 
      (link.source.id || link.source) === (link.target.id || link.target)
    )

    const maxPossibleEdges = isDirected ? numNodes * numNodes : (numNodes * (numNodes + 1)) / 2
    const density = maxPossibleEdges > 0 ? numEdges / maxPossibleEdges : 0

    return {
      numNodes,
      numEdges,
      isDirected,
      degrees,
      hasSelfLoops,
      density
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
  const handleCenter = () => graphRef.current?.zoomToFit(400, 50)

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GraphicEqIcon sx={{ fontSize: 35 }} />
          ۲. تبدیل رابطه به گراف
        </Typography>
        <Typography variant="body1" color="text.secondary">
          نمایش تعاملی و حرفه‌ای گراف از ماتریس مجاورت
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ماتریس مجاورت
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  حداکثر اندازه ماتریس: <strong>۷×۷</strong>
                </Typography>
              </Alert>
              <MatrixInput 
                matrix={matrix}
                setMatrix={setMatrix}
                title=""
                showLabels={true}
                maxSize={7}
                minSize={2}
              />
              
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={generateGraphData}
                  startIcon={<PlayArrowIcon />}
                  sx={{
                    background: 'linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)',
                    py: 1.5
                  }}
                >
                  ایجاد گراف
                </Button>
              </Box>

              <Paper sx={{ p: 2, mt: 3, bgcolor: 'background.default' }}>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SettingsIcon fontSize="small" />
                  تنظیمات نمایش
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
                  sx={{ mt: 1 }}
                />

                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    اندازه گره: {nodeSize}px
                  </Typography>
                  <Slider
                    value={nodeSize}
                    onChange={(e, v) => setNodeSize(v)}
                    min={4}
                    max={12}
                    step={1}
                    marks
                    size="small"
                  />
                </Box>

                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    ضخامت یال: {linkWidth}px
                  </Typography>
                  <Slider
                    value={linkWidth}
                    onChange={(e, v) => setLinkWidth(v)}
                    min={0.5}
                    max={3}
                    step={0.5}
                    marks
                    size="small"
                    />
                  </Box>
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
                        نمودار گراف
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
                          <IconButton size="small" onClick={() => setGraphKey(prev => prev + 1)}>
                            <RefreshIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    
                    <Box 
                      ref={containerRef}
                      sx={{ 
                        width: '100%',
                        height: 400,
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
                          height={dimensions.height}
                          backgroundColor={colors.background}
                          nodeRelSize={nodeSize}
                          nodeVal={node => node.val}
                          nodeLabel={node => `Node ${node.name}`}
                          nodeColor={node => node.color}
                          linkWidth={linkWidth}
                          linkColor={() => colors.link}
                          linkDirectionalArrowLength={graphStats?.isDirected ? 3.5 : 0}
                          linkDirectionalArrowRelPos={1}
                          linkCurvature="curvature"
                          linkDirectionalParticles={0}
                          nodeCanvasObject={(node, ctx, globalScale) => {
                            // Draw node circle
                            ctx.beginPath()
                            ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false)
                            ctx.fillStyle = node.color
                            ctx.fill()
                            ctx.strokeStyle = colors.nodeStroke
                            ctx.lineWidth = 1
                            ctx.stroke()

                            // Draw label
                            if (showLabels) {
                              const label = node.name
                              const fontSize = 10
                              ctx.font = `${fontSize}px Arial`
                              ctx.textAlign = 'center'
                              ctx.textBaseline = 'middle'
                              ctx.fillStyle = colors.nodeText
                              ctx.fillText(label, node.x, node.y)
                            }
                          }}
                          onNodeClick={(node) => {
                            toast.info(`رأس ${node.name} انتخاب شد`)
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
                              strength: -300,
                              distanceMax: 1000
                            },
                            link: {
                              distance: 100
                            },
                            center: {
                              x: dimensions.width / 2,
                              y: dimensions.height / 2
                            }
                          }}
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {graphStats && (
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        مشخصات گراف
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.50' }}>
                            <Typography variant="h5" color="primary">
                              {graphStats.numNodes}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              رئوس
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'secondary.50' }}>
                            <Typography variant="h5" color="secondary">
                              {graphStats.numEdges}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              یال‌ها
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h5">
                              {(graphStats.density * 100).toFixed(0)}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              چگالی
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Chip 
                              label={graphStats.isDirected ? 'جهت‌دار' : 'بدون جهت'}
                              color={graphStats.isDirected ? 'warning' : 'info'}
                              size="small"
                            />
                            {graphStats.hasSelfLoops && (
                              <Chip 
                                label="حلقه"
                                color="error"
                                size="small"
                                sx={{ ml: 0.5 }}
                              />
                            )}
                          </Paper>
                        </Grid>

                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">
                            درجه رئوس:
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                            {graphData.nodes.map((node, i) => (
                              <Chip
                                key={i}
                                label={`${node.name}: ${graphStats.degrees[i]}`}
                                size="small"
                                variant="outlined"
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
            <Alert severity="info">
              ماتریس مجاورت را وارد کرده و دکمه "ایجاد گراف" را بزنید
            </Alert>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default RelationToGraph