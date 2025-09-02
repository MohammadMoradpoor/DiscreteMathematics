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
import { checkSubgraph } from '../services/api'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight'
import InfoIcon from '@mui/icons-material/Info'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'

const SubgraphChecker = () => {
  const [matrixG1, setMatrixG1] = useState([
    [0, 1, 0],
    [1, 0, 1],
    [0, 1, 0]
  ])
  const [matrixG2, setMatrixG2] = useState([
    [0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0]
  ])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCheck = async () => {
    try {
      setLoading(true)
      const response = await checkSubgraph(matrixG1, matrixG2)
      setResult(response)
      
      if (response.is_subgraph) {
        toast.success('G1 زیرگراف G2 است!')
      } else {
        toast.warning('G1 زیرگراف G2 نیست')
      }
      
      if (response.is_induced_subgraph) {
        toast.info('G1 زیرگراف القایی G2 نیز هست!')
      }
    } catch (error) {
      toast.error('خطا در بررسی: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const getVertexLabel = (graphNum, index) => {
    if (graphNum === 1) {
      return `v${index + 1}`
    } else {
      return String.fromCharCode(65 + index)
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountTreeIcon sx={{ fontSize: 35 }} />
          ۱۴. بررسی زیرگراف
        </Typography>
        <Typography variant="body1" color="text.secondary">
          بررسی اینکه آیا G1 زیرگراف G2 است یا خیر
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                گراف G1 (گراف کوچک‌تر)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                گرافی که می‌خواهیم بررسی کنیم زیرگراف است یا خیر
              </Typography>
              <MatrixInput 
                matrix={matrixG1}
                setMatrix={setMatrixG1}
                title=""
                showLabels={true}
               maxSize={7} minSize={2}/>
              
              <Paper sx={{ p: 2, mt: 2, bgcolor: 'rgba(255,255,255,0.02)' }}>
                <Typography variant="subtitle2">اطلاعات گراف G1:</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Chip label={`${matrixG1.length} رأس`} size="small" color="primary" />
                  <Chip 
                    label={`${matrixG1.reduce((sum, row) => sum + row.reduce((s, v) => s + v, 0), 0) / 2} یال`} 
                    size="small" 
                  />
                </Box>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'secondary.main' }}>
                گراف G2 (گراف بزرگ‌تر)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                گرافی که G1 ممکن است زیرگراف آن باشد
              </Typography>
              <MatrixInput 
                matrix={matrixG2}
                setMatrix={setMatrixG2}
                title=""
                showLabels={true}
               maxSize={7} minSize={2}/>
              
              <Paper sx={{ p: 2, mt: 2, bgcolor: 'rgba(255,255,255,0.02)' }}>
                <Typography variant="subtitle2">اطلاعات گراف G2:</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Chip label={`${matrixG2.length} رأس`} size="small" color="secondary" />
                  <Chip 
                    label={`${matrixG2.reduce((sum, row) => sum + row.reduce((s, v) => s + v, 0), 0) / 2} یال`} 
                    size="small" 
                  />
                </Box>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleCheck}
              disabled={loading || matrixG1.length > matrixG2.length}
              startIcon={<CompareArrowsIcon />}
              sx={{
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                }
              }}
            >
              بررسی زیرگراف بودن
            </Button>
          </Box>
          
          {matrixG1.length > matrixG2.length && (
            <Alert severity="error" sx={{ mt: 2 }}>
              G1 نمی‌تواند زیرگراف G2 باشد چون تعداد رئوس G1 بیشتر از G2 است!
            </Alert>
          )}
        </Grid>

        {result && (
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      زیرگراف معمولی
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      {result.is_subgraph ? (
                        <>
                          <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                          <Box>
                            <Typography variant="subtitle1" color="success.main">
                              G1 زیرگراف G2 است
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              همه یال‌های G1 در G2 وجود دارند
                            </Typography>
                          </Box>
                        </>
                      ) : (
                        <>
                          <CancelIcon color="error" sx={{ fontSize: 40 }} />
                          <Box>
                            <Typography variant="subtitle1" color="error.main">
                              G1 زیرگراف G2 نیست
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {result.message || 'برخی یال‌های G1 در G2 وجود ندارند'}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Box>

                    {result.is_subgraph && result.mapping && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" gutterBottom>
                          نگاشت رئوس:
                        </Typography>
                        <TableContainer component={Paper} sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>رأس در G1</TableCell>
                                <TableCell>→</TableCell>
                                <TableCell>رأس در G2</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {Object.entries(result.mapping).map(([v1, v2]) => (
                                <TableRow key={v1}>
                                  <TableCell>
                                    <Chip label={getVertexLabel(1, parseInt(v1))} size="small" color="primary" />
                                  </TableCell>
                                  <TableCell>→</TableCell>
                                  <TableCell>
                                    <Chip label={getVertexLabel(2, v2)} size="small" color="secondary" />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      زیرگراف القایی
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      {result.is_induced_subgraph ? (
                        <>
                          <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                          <Box>
                            <Typography variant="subtitle1" color="success.main">
                              G1 زیرگراف القایی G2 است
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              همه یال‌های بین رئوس انتخابی حفظ شده‌اند
                            </Typography>
                          </Box>
                        </>
                      ) : (
                        <>
                          <CancelIcon color="warning" sx={{ fontSize: 40 }} />
                          <Box>
                            <Typography variant="subtitle1" color="warning.main">
                              G1 زیرگراف القایی G2 نیست
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              برخی یال‌های G2 بین رئوس انتخابی در G1 نیستند
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Box>

                    {result.is_induced_subgraph && result.induced_mapping && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Alert severity="success">
                          در زیرگراف القایی، تمام یال‌هایی که در G2 بین رئوس نگاشت شده وجود دارند، در G1 نیز موجود هستند.
                        </Alert>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        )}

        {!result && !loading && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.02)' }}>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoIcon />
                تعاریف و مفاهیم
              </Typography>
              <Divider sx={{ my: 2 }} />
              <List>
                <ListItem>
                  <ListItemIcon>
                    <SubdirectoryArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="زیرگراف معمولی"
                    secondary="گراف G1 زیرگراف G2 است اگر مجموعه رئوس و یال‌های G1 زیرمجموعه‌ای از رئوس و یال‌های G2 باشند"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SubdirectoryArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="زیرگراف القایی"
                    secondary="زیرگراف G1 القایی است اگر تمام یال‌های G2 که بین رئوس G1 هستند، در G1 نیز موجود باشند"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default SubgraphChecker