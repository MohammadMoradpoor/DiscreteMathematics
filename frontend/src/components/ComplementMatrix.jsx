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
  List,
  ListItem,
  ListItemText
} from '@mui/material'
import { toast } from 'react-toastify'
import MatrixInput from './common/MatrixInput'
import { calculateComplement } from '../services/api'
import InvertColorsIcon from '@mui/icons-material/InvertColors'
import CompareIcon from '@mui/icons-material/Compare'
import InfoIcon from '@mui/icons-material/Info'

const ComplementMatrix = () => {
  const [matrix, setMatrix] = useState([
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0]
  ])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    try {
      setLoading(true)
      const response = await calculateComplement(matrix)
      setResult(response)
      toast.success('ماتریس مکمل محاسبه شد!')
    } catch (error) {
      toast.error('خطا در محاسبه: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const PropertyCard = ({ title, properties, color = 'primary' }) => (
    <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid', borderColor: `${color}.main` }}>
      <Typography variant="subtitle2" gutterBottom color={`${color}.main`}>
        {title}
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary">تعداد یال‌ها:</Typography>
          <Typography variant="h6">{properties?.edge_count ?? 0}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary">درجه میانگین:</Typography>
          <Typography variant="h6">{properties?.avg_degree?.toFixed(2) ?? '0.00'}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary">چگالی:</Typography>
          <Typography variant="h6">{properties?.density ? (properties.density * 100).toFixed(1) : '0.0'}%</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary">خودحلقه:</Typography>
          <Typography variant="h6">{properties?.has_self_loops ? 'دارد' : 'ندارد'}</Typography>
        </Grid>
      </Grid>
    </Paper>
  )

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InvertColorsIcon sx={{ fontSize: 35 }} />
          ۱۳. ماتریس مکمل گراف
        </Typography>
        <Typography variant="body1" color="text.secondary">
          محاسبه گراف مکمل با معکوس کردن وجود یال‌ها (به جز حلقه‌ها)
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ماتریس مجاورت گراف اصلی
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
                  onClick={handleCalculate}
                  disabled={loading}
                  startIcon={<InvertColorsIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    py: 1.5,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    }
                  }}
                >
                  محاسبه ماتریس مکمل
                </Button>
              </Box>

              <Paper sx={{ p: 2, mt: 3, bgcolor: 'rgba(255,255,255,0.02)' }}>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon fontSize="small" />
                  قانون گراف مکمل:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="اگر در گراف اصلی بین دو رأس یال وجود داشته باشد، در گراف مکمل وجود ندارد"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="اگر در گراف اصلی بین دو رأس یال وجود نداشته باشد، در گراف مکمل وجود دارد"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="حلقه‌ها (یال‌های از رأس به خودش) تغییر نمی‌کنند"
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
                    <Typography variant="h6" gutterBottom sx={{ color: 'secondary.main' }}>
                      ماتریس مکمل
                    </Typography>
                    <MatrixInput 
                      matrix={result.complement}
                      setMatrix={() => {}}
                      title=""
                      editable={false}
                      showLabels={true}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CompareIcon />
                      مقایسه خواص
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <PropertyCard 
                          title="گراف اصلی" 
                          properties={result.original_properties}
                          color="primary"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <PropertyCard 
                          title="گراف مکمل" 
                          properties={result.complement_properties}
                          color="secondary"
                        />
                      </Grid>
                    </Grid>

                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="caption">
                        مجموع یال‌های گراف اصلی و مکمل برابر است با تعداد کل یال‌های ممکن در گراف کامل
                        {' '}
                        ({result.original_properties?.edge_count ?? 0} + {result.complement_properties?.edge_count ?? 0} = 
                        {' '}{(result.original_properties?.edge_count ?? 0) + (result.complement_properties?.edge_count ?? 0)})
                      </Typography>
                    </Alert>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : (
            <Alert severity="info">
              ماتریس مجاورت را وارد کرده و دکمه محاسبه را بزنید
            </Alert>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default ComplementMatrix
