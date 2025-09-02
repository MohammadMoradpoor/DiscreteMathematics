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
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import { toast } from 'react-toastify'
import MatrixInput from './common/MatrixInput'
import { findEulerianPath } from '../services/api'
import TimelineIcon from '@mui/icons-material/Timeline'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import InfoIcon from '@mui/icons-material/Info'

const EulerianPath = () => {
  const [matrix, setMatrix] = useState([
    [0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0]
  ])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFindPath = async () => {
    try {
      setLoading(true)
      const response = await findEulerianPath(matrix)
      setResult(response)
      if (response.has_eulerian_path) {
        toast.success('مسیر اویلری پیدا شد!')
      } else {
        toast.warning('گراف مسیر اویلری ندارد')
      }
    } catch (error) {
      toast.error('خطا در جستجوی مسیر: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const getVertexLabel = (index) => {
    return String.fromCharCode(65 + index) // A, B, C, ...
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TimelineIcon sx={{ fontSize: 35 }} />
          ۱۷. مسیر اویلری
        </Typography>
        <Typography variant="body1" color="text.secondary">
          یافتن مسیری که از همه یال‌های گراف دقیقاً یک بار عبور کند
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <MatrixInput 
                matrix={matrix}
                setMatrix={setMatrix}
                title="ماتریس مجاورت گراف جهت‌دار"
               maxSize={7} minSize={2}/>
              
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleFindPath}
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
                  جستجوی مسیر اویلری
                </Button>
              </Box>

              <Paper sx={{ p: 2, mt: 3, bgcolor: 'rgba(255,255,255,0.02)' }}>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon fontSize="small" />
                  شرایط وجود مسیر اویلری در گراف جهت‌دار:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="حالت ۱: همه رئوس درجه ورودی و خروجی برابر دارند (دور اویلری)"
                      secondary="مسیر از هر رأسی می‌تواند شروع شود"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="حالت ۲: دقیقاً یک رأس درجه خروجی = درجه ورودی + ۱"
                      secondary="و دقیقاً یک رأس درجه ورودی = درجه خروجی + ۱"
                    />
                  </ListItem>
                </List>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          {result ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      نتیجه بررسی
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      {result.has_eulerian_path ? (
                        <>
                          <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                          <Box>
                            <Typography variant="subtitle1" color="success.main">
                              گراف دارای مسیر اویلری است
                            </Typography>
                            {result.start_vertex !== undefined && (
                              <Typography variant="body2" color="text.secondary">
                                رأس شروع: {getVertexLabel(result.start_vertex)}
                              </Typography>
                            )}
                          </Box>
                        </>
                      ) : (
                        <>
                          <CancelIcon color="error" sx={{ fontSize: 40 }} />
                          <Box>
                            <Typography variant="subtitle1" color="error.main">
                              گراف مسیر اویلری ندارد
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {result.reason || 'شرایط لازم برقرار نیست'}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" gutterBottom>
                      درجات رئوس:
                    </Typography>
                    <TableContainer component={Paper} sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>رأس</TableCell>
                            <TableCell align="center">درجه ورودی</TableCell>
                            <TableCell align="center">درجه خروجی</TableCell>
                            <TableCell align="center">تفاضل</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {result.in_degrees && result.in_degrees.map((inDeg, i) => {
                            const diff = result.out_degrees[i] - inDeg
                            return (
                              <TableRow key={i}>
                                <TableCell>
                                  <Chip 
                                    label={getVertexLabel(i)} 
                                    size="small"
                                    color={i === result.start_vertex ? "primary" : "default"}
                                  />
                                </TableCell>
                                <TableCell align="center">{inDeg}</TableCell>
                                <TableCell align="center">{result.out_degrees[i]}</TableCell>
                                <TableCell align="center">
                                  <Chip 
                                    label={diff === 0 ? '0' : diff > 0 ? `+${diff}` : diff}
                                    size="small"
                                    color={diff === 0 ? "default" : diff > 0 ? "success" : "error"}
                                  />
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>

              {result.has_eulerian_path && result.path && (
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        مسیر اویلری
                      </Typography>
                      
                      <Paper sx={{ p: 2, bgcolor: 'rgba(103, 126, 234, 0.1)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                          {result.path.map((vertex, index) => (
                            <React.Fragment key={index}>
                              <Chip 
                                label={getVertexLabel(vertex)}
                                color="primary"
                                variant={index === 0 || index === result.path.length - 1 ? "filled" : "outlined"}
                              />
                              {index < result.path.length - 1 && (
                                <ArrowForwardIcon fontSize="small" color="action" />
                              )}
                            </React.Fragment>
                          ))}
                        </Box>
                      </Paper>

                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          طول مسیر: {result.path.length - 1} یال
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          ) : (
            <Alert severity="info">
              ماتریس مجاورت گراف را وارد کرده و دکمه جستجو را بزنید
            </Alert>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default EulerianPath