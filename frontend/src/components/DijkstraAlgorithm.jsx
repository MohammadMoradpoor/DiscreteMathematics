import React, { useState } from 'react'
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material'
import { toast } from 'react-toastify'
import { dijkstraShortestPath } from '../services/api'
import RouteIcon from '@mui/icons-material/Route'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import TimelineIcon from '@mui/icons-material/Timeline'

const DijkstraAlgorithm = () => {
  const [edges, setEdges] = useState([
    ['A', 'B', 4],
    ['A', 'C', 2],
    ['B', 'C', 1],
    ['B', 'D', 5],
    ['C', 'D', 8],
    ['C', 'E', 10],
    ['D', 'E', 2],
    ['D', 'F', 6],
    ['E', 'F', 3]
  ])
  const [newEdge, setNewEdge] = useState({ source: '', dest: '', weight: '' })
  const [startNode, setStartNode] = useState('A')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAddEdge = () => {
    if (!newEdge.source || !newEdge.dest || !newEdge.weight) {
      toast.error('لطفاً همه فیلدها را پر کنید')
      return
    }
    const weight = parseFloat(newEdge.weight)
    if (isNaN(weight) || weight < 0) {
      toast.error('وزن باید عدد مثبت باشد')
      return
    }
    setEdges([...edges, [newEdge.source.toUpperCase(), newEdge.dest.toUpperCase(), weight]])
    setNewEdge({ source: '', dest: '', weight: '' })
    toast.success('یال جدید اضافه شد')
  }

  const handleDeleteEdge = (index) => {
    const newEdges = edges.filter((_, i) => i !== index)
    setEdges(newEdges)
    toast.info('یال حذف شد')
  }

  const handleCalculate = async () => {
    if (!startNode) {
      toast.error('لطفاً رأس شروع را مشخص کنید')
      return
    }
    if (edges.length === 0) {
      toast.error('حداقل یک یال وارد کنید')
      return
    }

    try {
      setLoading(true)
      const response = await dijkstraShortestPath(edges, startNode.toUpperCase())
      setResult(response)
      toast.success('کوتاه‌ترین مسیرها محاسبه شد!')
    } catch (error) {
      toast.error('خطا در محاسبه: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const getUniqueNodes = () => {
    const nodes = new Set()
    edges.forEach(edge => {
      nodes.add(edge[0])
      nodes.add(edge[1])
    })
    return Array.from(nodes).sort()
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RouteIcon sx={{ fontSize: 35 }} />
          ۱۸. الگوریتم دایکسترا
        </Typography>
        <Typography variant="body1" color="text.secondary">
          کوتاه‌ترین مسیر از یک رأس به همه رئوس دیگر در گراف وزن‌دار
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                یال‌های گراف
              </Typography>
              
              <TableContainer component={Paper} sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.02)' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>مبدأ</TableCell>
                      <TableCell>مقصد</TableCell>
                      <TableCell>وزن</TableCell>
                      <TableCell width={50}>حذف</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {edges.map((edge, index) => (
                      <TableRow key={index}>
                        <TableCell>{edge[0]}</TableCell>
                        <TableCell>{edge[1]}</TableCell>
                        <TableCell>{edge[2]}</TableCell>
                        <TableCell>
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteEdge(index)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Paper sx={{ p: 2, mb: 3, bgcolor: 'rgba(255,255,255,0.02)' }}>
                <Typography variant="subtitle2" gutterBottom>
                  افزودن یال جدید
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="مبدأ"
                      value={newEdge.source}
                      onChange={(e) => setNewEdge({...newEdge, source: e.target.value})}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="مقصد"
                      value={newEdge.dest}
                      onChange={(e) => setNewEdge({...newEdge, dest: e.target.value})}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="وزن"
                      type="number"
                      value={newEdge.weight}
                      onChange={(e) => setNewEdge({...newEdge, weight: e.target.value})}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleAddEdge}
                      startIcon={<AddIcon />}
                    >
                      افزودن
                    </Button>
                  </Grid>
                </Grid>
              </Paper>

              <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="رأس شروع"
                      value={startNode}
                      onChange={(e) => setStartNode(e.target.value)}
                      helperText="رأس مبدأ برای محاسبه کوتاه‌ترین مسیرها"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleCalculate}
                      disabled={loading || edges.length === 0}
                      startIcon={<PlayArrowIcon />}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        py: 1.5,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                        }
                      }}
                    >
                      محاسبه کوتاه‌ترین مسیرها
                    </Button>
                  </Grid>
                </Grid>
              </Paper>

              {getUniqueNodes().length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    رئوس موجود در گراف:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                    {getUniqueNodes().map(node => (
                      <Chip 
                        key={node} 
                        label={node} 
                        size="small" 
                        color={node === startNode.toUpperCase() ? "primary" : "default"}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          {result ? (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimelineIcon />
                  نتایج الگوریتم دایکسترا
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  از رأس {startNode.toUpperCase()}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>
                  فاصله‌ها:
                </Typography>
                <TableContainer component={Paper} sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.02)' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>رأس مقصد</TableCell>
                        <TableCell>فاصله</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(result.distances).map(([node, distance]) => (
                        <TableRow key={node}>
                          <TableCell>
                            <Chip 
                              label={node} 
                              size="small" 
                              color={node === startNode.toUpperCase() ? "primary" : "default"}
                            />
                          </TableCell>
                          <TableCell>
                            {distance === Infinity ? (
                              <Chip label="غیرقابل دسترس" size="small" color="error" />
                            ) : (
                              <Typography variant="body2">{distance}</Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography variant="subtitle2" gutterBottom>
                  مسیرها:
                </Typography>
                <List dense>
                  {Object.entries(result.paths).map(([node, path]) => (
                    <ListItem key={node}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">به {node}:</Typography>
                            {path && path.length > 0 ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {path.map((p, i) => (
                                  <React.Fragment key={i}>
                                    <Chip label={p} size="small" />
                                    {i < path.length - 1 && <Typography>→</Typography>}
                                  </React.Fragment>
                                ))}
                              </Box>
                            ) : (
                              <Chip label="مسیری وجود ندارد" size="small" color="error" />
                            )}
                          </Box>
                        }
                        secondary={
                          result.distances[node] !== Infinity && 
                          `فاصله: ${result.distances[node]}`
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          ) : (
            <Alert severity="info">
              یال‌های گراف را وارد کرده، رأس شروع را مشخص کنید و دکمه محاسبه را بزنید
            </Alert>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default DijkstraAlgorithm