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
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import { toast } from 'react-toastify'
import MatrixInput from './common/MatrixInput'
import { checkConnectivity } from '../services/api'
import HubIcon from '@mui/icons-material/Hub'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import GroupWorkIcon from '@mui/icons-material/GroupWork'
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot'
import InfoIcon from '@mui/icons-material/Info'

const ConnectivityChecker = () => {
  const [matrix, setMatrix] = useState([
    [0, 1, 0, 0, 1],
    [1, 0, 1, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 1],
    [1, 0, 0, 1, 0]
  ])
  const [isDirected, setIsDirected] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCheck = async () => {
    try {
      setLoading(true)
      const response = await checkConnectivity(matrix, isDirected)
      setResult(response)
      if (response.is_connected) {
        toast.success('گراف همبند است!')
      } else {
        toast.warning(`گراف همبند نیست - ${response.num_components} مؤلفه`)
      }
    } catch (error) {
      toast.error('خطا در بررسی همبندی: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const getVertexLabel = (index) => {
    return String.fromCharCode(65 + index)
  }

  const getComponentColor = (index) => {
    const colors = ['primary', 'secondary', 'success', 'warning', 'error', 'info']
    return colors[index % colors.length]
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HubIcon sx={{ fontSize: 35 }} />
          ۱۵. بررسی همبندی گراف
        </Typography>
        <Typography variant="body1" color="text.secondary">
          تشخیص همبندی گراف و شناسایی مؤلفه‌های همبند
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
                  onClick={handleCheck}
                  disabled={loading}
                  startIcon={<HubIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    py: 1.5,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    }
                  }}
                >
                  بررسی همبندی
                </Button>
              </Box>

              <Paper sx={{ p: 2, mt: 3, bgcolor: 'rgba(255,255,255,0.02)' }}>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon fontSize="small" />
                  تعاریف:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="گراف غیرجهت‌دار همبند"
                      secondary="بین هر دو رأس مسیری وجود دارد"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="گراف جهت‌دار قویاً همبند"
                      secondary="از هر رأس به هر رأس دیگر مسیر جهت‌دار وجود دارد"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="گراف جهت‌دار ضعیفاً همبند"
                      secondary="گراف زیربنای آن (بدون در نظر گرفتن جهت) همبند است"
                    />
                  </ListItem>
                </List>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          {result ? (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  نتیجه بررسی
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  {result.is_connected ? (
                    <>
                      <CheckCircleIcon color="success" sx={{ fontSize: 50 }} />
                      <Box>
                        <Typography variant="h6" color="success.main">
                          گراف {result.status || 'همبند'} است
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          همه رئوس در یک مؤلفه قرار دارند
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <>
                      <CancelIcon color="error" sx={{ fontSize: 50 }} />
                      <Box>
                        <Typography variant="h6" color="error.main">
                          گراف {result.status || 'همبند نیست'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          تعداد مؤلفه‌های همبند: {result.num_components}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GroupWorkIcon />
                  مؤلفه‌های همبند
                </Typography>

                <Grid container spacing={2}>
                  {result.components && result.components.map((component, index) => (
                    <Grid item xs={12} key={index}>
                      <Paper sx={{ 
                        p: 2, 
                        bgcolor: 'rgba(255,255,255,0.02)',
                        border: '1px solid',
                        borderColor: `${getComponentColor(index)}.main`,
                        borderLeft: '4px solid',
                        borderLeftColor: `${getComponentColor(index)}.main`
                      }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2" color={`${getComponentColor(index)}.main`}>
                            مؤلفه {index + 1}
                          </Typography>
                          <Chip 
                            label={`${component.length} رأس`}
                            size="small"
                            color={getComponentColor(index)}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {component.map((vertex) => (
                            <Chip
                              key={vertex}
                              label={getVertexLabel(vertex)}
                              variant="outlined"
                              color={getComponentColor(index)}
                            />
                          ))}
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                {!result.is_connected && (
                  <Alert severity="warning" sx={{ mt: 3 }} icon={<ScatterPlotIcon />}>
                    <Typography variant="subtitle2" gutterBottom>
                      توصیه‌ها برای همبند کردن گراف:
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary={`حداقل ${result.num_components - 1} یال برای اتصال مؤلفه‌ها نیاز است`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="یال‌هایی بین رئوس مؤلفه‌های مختلف اضافه کنید"
                        />
                      </ListItem>
                    </List>
                  </Alert>
                )}

                {isDirected && result.is_connected && (
                  <Alert severity="success" sx={{ mt: 3 }}>
                    گراف جهت‌دار شما {result.status} است که نشان‌دهنده ارتباط قوی بین همه رئوس است.
                  </Alert>
                )}
              </CardContent>
            </Card>
          ) : (
            <Alert severity="info">
              ماتریس مجاورت را وارد کرده، نوع گراف را انتخاب کنید و دکمه بررسی را بزنید
            </Alert>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default ConnectivityChecker