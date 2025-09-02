import React, { useState } from 'react'
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
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { toast } from 'react-toastify'
import MatrixInput from './common/MatrixInput'
import { calculateVertexDegree } from '../services/api'
import TimelineIcon from '@mui/icons-material/Timeline'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import StarIcon from '@mui/icons-material/Star'
import InfoIcon from '@mui/icons-material/Info'

const VertexDegree = () => {
  const [matrix, setMatrix] = useState([
    [0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0]
  ])
  const [isDirected, setIsDirected] = useState(true)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    try {
      setLoading(true)
      const response = await calculateVertexDegree(matrix, isDirected)
      setResult(response)
      toast.success('درجات رئوس محاسبه شد!')
    } catch (error) {
      toast.error('خطا در محاسبه: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const getVertexLabel = (index) => {
    return String.fromCharCode(65 + index)
  }

  const getDegreeColor = (degree, maxDegree) => {
    const ratio = degree / maxDegree
    if (ratio >= 0.75) return 'error'
    if (ratio >= 0.5) return 'warning'
    if (ratio >= 0.25) return 'info'
    return 'default'
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TimelineIcon sx={{ fontSize: 35 }} />
          ۱۲. درجه رئوس گراف
        </Typography>
        <Typography variant="body1" color="text.secondary">
          محاسبه درجه ورودی، خروجی و کل برای هر رأس در گراف
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">ماتریس مجاورت</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isDirected}
                      onChange={(e) => setIsDirected(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="گراف جهت‌دار"
                />
              </Box>
              
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
                  onClick={handleCalculate}
                  disabled={loading}
                  startIcon={<TimelineIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    py: 1.5,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    }
                  }}
                >
                  محاسبه درجات
                </Button>
              </Box>

              <Paper sx={{ p: 2, mt: 3, bgcolor: 'rgba(255,255,255,0.02)' }}>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon fontSize="small" />
                  تعاریف:
                </Typography>
                {isDirected ? (
                  <Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <ArrowDownwardIcon fontSize="small" sx={{ verticalAlign: 'middle' }} />
                      {' '}<strong>درجه ورودی:</strong> تعداد یال‌های ورودی به رأس
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <ArrowUpwardIcon fontSize="small" sx={{ verticalAlign: 'middle' }} />
                      {' '}<strong>درجه خروجی:</strong> تعداد یال‌های خروجی از رأس
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <SwapVertIcon fontSize="small" sx={{ verticalAlign: 'middle' }} />
                    {' '}<strong>درجه:</strong> تعداد یال‌های متصل به رأس
                  </Typography>
                )}
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          {result ? (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  نتایج محاسبه درجات
                </Typography>
                
                {result.is_directed ? (
                  // Directed Graph Results
                  <>
                    <TableContainer component={Paper} sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>رأس</TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <ArrowDownwardIcon fontSize="small" />
                                ورودی
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <ArrowUpwardIcon fontSize="small" />
                                خروجی
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <SwapVertIcon fontSize="small" />
                                کل
                              </Box>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {result.in_degrees && result.in_degrees.map((inDeg, i) => {
                            const maxTotal = Math.max(...result.total_degrees)
                            return (
                              <TableRow key={i}>
                                <TableCell>
                                  <Chip 
                                    label={getVertexLabel(i)} 
                                    size="small"
                                    color="primary"
                                  />
                                </TableCell>
                                <TableCell align="center">{inDeg}</TableCell>
                                <TableCell align="center">{result.out_degrees[i]}</TableCell>
                                <TableCell align="center">
                                  <Chip 
                                    label={result.total_degrees[i]}
                                    size="small"
                                    color={getDegreeColor(result.total_degrees[i], maxTotal)}
                                  />
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Paper sx={{ p: 2, mt: 2, bgcolor: 'rgba(255,255,255,0.02)' }}>
                      <Typography variant="subtitle2" gutterBottom>آمار کلی:</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">بیشترین درجه ورودی:</Typography>
                          <Typography variant="h6">
                            {Math.max(...result.in_degrees)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">بیشترین درجه خروجی:</Typography>
                          <Typography variant="h6">
                            {Math.max(...result.out_degrees)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </>
                ) : (
                  // Undirected Graph Results
                  <>
                    <TableContainer component={Paper} sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>رأس</TableCell>
                            <TableCell align="center">درجه</TableCell>
                            <TableCell align="center">نوع</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {result.degrees && result.degrees.map((degree, i) => {
                            const maxDegree = Math.max(...result.degrees)
                            const isSpecial = result.special_vertices?.isolated?.includes(i) ||
                                            result.special_vertices?.pendant?.includes(i)
                            return (
                              <TableRow key={i}>
                                <TableCell>
                                  <Chip 
                                    label={getVertexLabel(i)} 
                                    size="small"
                                    color="primary"
                                    icon={isSpecial ? <StarIcon /> : undefined}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <Chip 
                                    label={degree}
                                    size="small"
                                    color={getDegreeColor(degree, maxDegree)}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  {result.special_vertices?.isolated?.includes(i) && (
                                    <Chip label="منزوی" size="small" color="error" />
                                  )}
                                  {result.special_vertices?.pendant?.includes(i) && (
                                    <Chip label="آویزان" size="small" color="warning" />
                                  )}
                                  {!result.special_vertices?.isolated?.includes(i) && 
                                   !result.special_vertices?.pendant?.includes(i) && (
                                    <Chip label="عادی" size="small" variant="outlined" />
                                  )}
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {result.special_vertices && (
                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        {result.special_vertices.isolated?.length > 0 && (
                          <Grid item xs={6}>
                            <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid', borderColor: 'error.main' }}>
                              <Typography variant="subtitle2" color="error.main" gutterBottom>
                                رئوس منزوی
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                درجه = 0
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                {result.special_vertices.isolated.map(v => (
                                  <Chip key={v} label={getVertexLabel(v)} size="small" color="error" />
                                ))}
                              </Box>
                            </Paper>
                          </Grid>
                        )}
                        {result.special_vertices.pendant?.length > 0 && (
                          <Grid item xs={6}>
                            <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid', borderColor: 'warning.main' }}>
                              <Typography variant="subtitle2" color="warning.main" gutterBottom>
                                رئوس آویزان
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                درجه = 1
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                {result.special_vertices.pendant.map(v => (
                                  <Chip key={v} label={getVertexLabel(v)} size="small" color="warning" />
                                ))}
                              </Box>
                            </Paper>
                          </Grid>
                        )}
                      </Grid>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <Alert severity="info">
              ماتریس مجاورت را وارد کرده، نوع گراف را انتخاب کنید و دکمه محاسبه را بزنید
            </Alert>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default VertexDegree
