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
  Chip,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@mui/material'
import { toast } from 'react-toastify'
import MatrixInput from './common/MatrixInput'
import { calculatePathLength } from '../services/api'
import RouteIcon from '@mui/icons-material/Route'
import CalculateIcon from '@mui/icons-material/Calculate'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import InfoIcon from '@mui/icons-material/Info'

const PathLengthCalculator = () => {
  const [adjMatrix, setAdjMatrix] = useState([
    [0, 1, 1, 0],
    [1, 0, 1, 1],
    [1, 1, 0, 1],
    [0, 1, 1, 0]
  ])
  const [weightMatrix, setWeightMatrix] = useState([
    [0, 2, 5, 0],
    [2, 0, 3, 7],
    [5, 3, 0, 1],
    [0, 7, 1, 0]
  ])
  const [path, setPath] = useState([0, 1, 2, 3])
  const [pathInput, setPathInput] = useState('A, B, C, D')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [matrixSize, setMatrixSize] = useState(4)

  const handleMatrixSizeChange = (newSize) => {
    if (newSize < 2 || newSize > 7) {
      toast.error('اندازه ماتریس باید بین ۲ و ۷ باشد')
      return
    }
    
    setMatrixSize(newSize)
    
    // Resize adjacency matrix
    const newAdjMatrix = Array(newSize).fill(null).map((_, i) => 
      Array(newSize).fill(null).map((_, j) => 
        adjMatrix[i] && adjMatrix[i][j] !== undefined ? adjMatrix[i][j] : 0
      )
    )
    setAdjMatrix(newAdjMatrix)
    
    // Resize weight matrix
    const newWeightMatrix = Array(newSize).fill(null).map((_, i) => 
      Array(newSize).fill(null).map((_, j) => 
        weightMatrix[i] && weightMatrix[i][j] !== undefined ? weightMatrix[i][j] : 0
      )
    )
    setWeightMatrix(newWeightMatrix)
  }

  const parsePathInput = (input) => {
    // Convert letters to indices (A->0, B->1, etc.)
    const vertices = input.split(',').map(v => v.trim())
    const indices = vertices.map(v => {
      if (/^[A-Z]$/i.test(v)) {
        return v.toUpperCase().charCodeAt(0) - 65
      } else if (/^\d+$/.test(v)) {
        return parseInt(v)
      }
      return -1
    }).filter(i => i >= 0 && i < matrixSize)
    
    return indices
  }

  const handlePathInputChange = (value) => {
    setPathInput(value)
    const parsedPath = parsePathInput(value)
    setPath(parsedPath)
  }

  const handleCalculate = async () => {
    if (path.length < 2) {
      toast.error('مسیر باید حداقل دو رأس داشته باشد')
      return
    }

    try {
      setLoading(true)
      const response = await calculatePathLength(adjMatrix, weightMatrix, path)
      setResult(response)
      if (response.valid) {
        toast.success('طول مسیر محاسبه شد!')
      } else {
        toast.error('مسیر نامعتبر است!')
      }
    } catch (error) {
      toast.error('خطا در محاسبه: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const getVertexLabel = (index) => {
    return String.fromCharCode(65 + index)
  }

  const syncWeightWithAdjacency = () => {
    const newWeightMatrix = weightMatrix.map((row, i) => 
      row.map((weight, j) => adjMatrix[i][j] === 0 ? 0 : (weight || 1))
    )
    setWeightMatrix(newWeightMatrix)
    toast.info('ماتریس وزن با ماتریس مجاورت همگام‌سازی شد')
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RouteIcon sx={{ fontSize: 35 }} />
          ۱۶. محاسبه طول مسیر
        </Typography>
        <Typography variant="body1" color="text.secondary">
          محاسبه طول یک مسیر مشخص در گراف وزن‌دار
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2, bgcolor: 'rgba(255,255,255,0.02)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="subtitle2">اندازه ماتریس:</Typography>
                <IconButton 
                  onClick={() => handleMatrixSizeChange(matrixSize - 1)}
                  disabled={matrixSize <= 2}
                  size="small"
                >
                  <RemoveIcon />
                </IconButton>
                <Chip label={`${matrixSize}×${matrixSize}`} color="primary" />
                <IconButton 
                  onClick={() => handleMatrixSizeChange(matrixSize + 1)}
                  disabled={matrixSize >= 7}
                  size="small"
                >
                  <AddIcon />
                </IconButton>
              </Box>
              <Typography variant="caption" color="text.secondary">
                حداکثر: ۷×۷
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ماتریس مجاورت
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ۱ = یال موجود، ۰ = یال موجود نیست
              </Typography>
              <MatrixInput 
                matrix={adjMatrix}
                setMatrix={setAdjMatrix}
                title=""
                showLabels={true}
                maxSize={7}
                minSize={2}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6">ماتریس وزن</Typography>
                  <Typography variant="caption" color="text.secondary">
                    وزن یال‌های موجود در گراف
                  </Typography>
                </Box>
                <Button
                  size="small"
                  onClick={syncWeightWithAdjacency}
                  startIcon={<CalculateIcon />}
                >
                  همگام‌سازی با مجاورت
                </Button>
              </Box>
              <MatrixInput 
                matrix={weightMatrix}
                setMatrix={setWeightMatrix}
                title=""
                showLabels={true}
                maxSize={7}
                minSize={2}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                مسیر مورد نظر
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="مسیر (رئوس را با کاما جدا کنید)"
                    value={pathInput}
                    onChange={(e) => handlePathInputChange(e.target.value)}
                    helperText="مثال: A, B, C, D یا 0, 1, 2, 3"
                    placeholder="A, B, C, D"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleCalculate}
                    disabled={loading || path.length < 2}
                    startIcon={<CalculateIcon />}
                    sx={{
                      height: '56px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                      }
                    }}
                  >
                    محاسبه طول مسیر
                  </Button>
                </Grid>
              </Grid>

              {path.length > 0 && (
                <Paper sx={{ p: 2, mt: 2, bgcolor: 'rgba(255,255,255,0.02)' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    مسیر تبدیل شده:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    {path.map((vertex, index) => (
                      <React.Fragment key={index}>
                        <Chip 
                          label={`${getVertexLabel(vertex)} (${vertex})`}
                          color="primary"
                          variant="outlined"
                        />
                        {index < path.length - 1 && (
                          <ArrowForwardIcon fontSize="small" color="action" />
                        )}
                      </React.Fragment>
                    ))}
                  </Box>
                </Paper>
              )}
            </CardContent>
          </Card>
        </Grid>

        {result && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  نتیجه محاسبه
                </Typography>

                {result.valid ? (
                  <>
                    <Alert severity="success" sx={{ mb: 2 }}>
                      مسیر معتبر است و طول آن محاسبه شد
                    </Alert>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, bgcolor: 'rgba(103, 126, 234, 0.1)' }}>
                          <Typography variant="h4" align="center" color="primary">
                            {result.total_length}
                          </Typography>
                          <Typography variant="subtitle2" align="center" color="text.secondary">
                            طول کل مسیر
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)' }}>
                          <Typography variant="h4" align="center">
                            {result.edges ? result.edges.length : 0}
                          </Typography>
                          <Typography variant="subtitle2" align="center" color="text.secondary">
                            تعداد یال‌ها
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>

                    {result.edges && result.edges.length > 0 && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                          جزئیات یال‌ها:
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {result.edges.map((edge, index) => (
                            <Paper key={index} sx={{ 
                              p: 2, 
                              bgcolor: 'rgba(255,255,255,0.02)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Chip 
                                  label={`یال ${index + 1}`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Chip 
                                    label={getVertexLabel(edge.from)}
                                    size="small"
                                    sx={{ bgcolor: 'primary.main', color: 'white' }}
                                  />
                                  <Typography variant="body2">→</Typography>
                                  <Chip 
                                    label={getVertexLabel(edge.to)}
                                    size="small"
                                    sx={{ bgcolor: 'primary.main', color: 'white' }}
                                  />
                                </Box>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="caption" color="text.secondary">وزن:</Typography>
                                <Typography variant="h6" color="secondary.main">
                                  {edge.weight}
                                </Typography>
                              </Box>
                            </Paper>
                          ))}
                          
                          <Divider sx={{ my: 1 }} />
                          
                          <Paper sx={{ 
                            p: 2, 
                            bgcolor: 'success.main',
                            color: 'white',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              طول کل مسیر:
                            </Typography>
                            <Typography variant="h5" fontWeight="bold">
                              {result.total_length}
                            </Typography>
                          </Paper>
                        </Box>
                      </Box>
                    )}
                  </>
                ) : (
                  <Alert severity="error">
                    مسیر نامعتبر است! برخی از یال‌های مسیر در گراف وجود ندارند.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {!result && !loading && (
          <Grid item xs={12}>
            <Alert severity="info" icon={<InfoIcon />}>
              <Typography variant="subtitle2" gutterBottom>
                راهنما:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="۱. ماتریس مجاورت را برای تعیین یال‌های موجود وارد کنید"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="۲. ماتریس وزن را برای تعیین وزن هر یال وارد کنید"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="۳. مسیر مورد نظر را با حروف (A, B, C, ...) یا اعداد (0, 1, 2, ...) وارد کنید"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="۴. دکمه محاسبه را بزنید"
                  />
                </ListItem>
              </List>
            </Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default PathLengthCalculator