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
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert
} from '@mui/material'
import { toast } from 'react-toastify'
import MatrixInput from './common/MatrixInput'
import { relationClosures } from '../services/api'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import AllInclusiveIcon from '@mui/icons-material/AllInclusive'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import LoopIcon from '@mui/icons-material/Loop'

const RelationClosures = () => {
  const [matrix, setMatrix] = useState([
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
    [0, 0, 0, 0]
  ])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    try {
      setLoading(true)
      const response = await relationClosures(matrix)
      setResult(response)
      toast.success('بستارها با موفقیت محاسبه شدند!')
    } catch (error) {
      toast.error('خطا در محاسبه بستارها: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const PropertyItem = ({ property, value, icon, label }) => (
    <ListItem>
      <ListItemIcon>
        {value ? 
          <CheckCircleIcon color="success" /> : 
          <CancelIcon color="error" />
        }
      </ListItemIcon>
      <ListItemText 
        primary={label}
        secondary={value ? 'دارد' : 'ندارد'}
      />
    </ListItem>
  )

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountTreeIcon sx={{ fontSize: 35 }} />
          ۷-۸-۹. بستارهای رابطه
        </Typography>
        <Typography variant="body1" color="text.secondary">
          بستار بازتابی، تقارنی و تعدی یک رابطه را محاسبه کنید
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <MatrixInput 
                matrix={matrix}
                setMatrix={setMatrix}
                title="ماتریس رابطه اصلی"
               maxSize={7} minSize={2}/>
              
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleCalculate}
                  disabled={loading}
                  startIcon={<AccountTreeIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    py: 1.5,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    }
                  }}
                >
                  محاسبه بستارها
                </Button>
              </Box>

              {result && (
                <Paper sx={{ p: 2, mt: 3, bgcolor: 'rgba(255,255,255,0.02)' }}>
                  <Typography variant="h6" gutterBottom>
                    خواص رابطه اصلی
                  </Typography>
                  <List dense>
                    <PropertyItem 
                      value={result.original_properties.reflexive}
                      label="بازتابی (Reflexive)"
                    />
                    <PropertyItem 
                      value={result.original_properties.symmetric}
                      label="تقارنی (Symmetric)"
                    />
                    <PropertyItem 
                      value={result.original_properties.transitive}
                      label="تعدی (Transitive)"
                    />
                    <PropertyItem 
                      value={result.original_properties.antisymmetric}
                      label="پادتقارنی (Antisymmetric)"
                    />
                  </List>
                  
                  {result.original_properties.equivalence && (
                    <Chip 
                      label="رابطه هم‌ارزی"
                      color="success"
                      sx={{ mt: 1 }}
                    />
                  )}
                  {result.original_properties.partial_order && (
                    <Chip 
                      label="ترتیب جزئی"
                      color="info"
                      sx={{ mt: 1, ml: 1 }}
                    />
                  )}
                </Paper>
              )}
            </CardContent>
          </Card>
        </Grid>

        {result && (
          <Grid item xs={12} md={7}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LoopIcon />
                      بستار بازتابی
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      افزودن حلقه‌ها به تمام رئوس (عناصر قطر اصلی)
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <MatrixInput 
                      matrix={result.reflexive_closure}
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
                      <CompareArrowsIcon />
                      بستار تقارنی
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      اگر (a,b) موجود باشد، (b,a) را اضافه می‌کند
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <MatrixInput 
                      matrix={result.symmetric_closure}
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
                      <AllInclusiveIcon />
                      بستار تعدی
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      اگر (a,b) و (b,c) موجود باشند، (a,c) را اضافه می‌کند (الگوریتم وارشال)
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <MatrixInput 
                      matrix={result.transitive_closure}
                      setMatrix={() => {}}
                      title=""
                      editable={false}
                      showLabels={true}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        )}

        {!result && !loading && (
          <Grid item xs={12} md={7}>
            <Alert severity="info">
              ماتریس رابطه را وارد کرده و دکمه "محاسبه بستارها" را بزنید
            </Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default RelationClosures
