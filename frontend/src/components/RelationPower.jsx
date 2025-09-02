import React, { useState } from 'react'
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  Paper,
  TextField,
  Tabs,
  Tab,
  Alert,
  Chip,
  Divider
} from '@mui/material'
import { toast } from 'react-toastify'
import MatrixInput from './common/MatrixInput'
import { relationPower } from '../services/api'
import PowerIcon from '@mui/icons-material/Power'
import AllInclusiveIcon from '@mui/icons-material/AllInclusive'
import InfoIcon from '@mui/icons-material/Info'

const RelationPower = () => {
  const [matrix, setMatrix] = useState([
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
    [1, 0, 0, 0]
  ])
  const [maxPower, setMaxPower] = useState(4)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedTab, setSelectedTab] = useState(0)

  const handleCalculate = async () => {
    if (maxPower < 1 || maxPower > 10) {
      toast.error('حداکثر توان باید بین 1 و 10 باشد!')
      return
    }

    try {
      setLoading(true)
      const response = await relationPower(matrix, maxPower)
      setResult(response)
      toast.success('توان‌های رابطه محاسبه شد!')
    } catch (error) {
      toast.error('خطا در محاسبه: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PowerIcon sx={{ fontSize: 35 }} />
          ۵. توان رابطه
        </Typography>
        <Typography variant="body1" color="text.secondary">
          محاسبه توان‌های مختلف رابطه و بستار تعدی آن
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ماتریس رابطه اصلی
              </Typography>
              <MatrixInput 
                matrix={matrix}
                setMatrix={setMatrix}
                title=""
                showLabels={true}
               maxSize={7} minSize={2}/>
              
              <Box sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="حداکثر توان"
                  type="number"
                  value={maxPower}
                  onChange={(e) => setMaxPower(parseInt(e.target.value) || 1)}
                  helperText="توان‌های 1 تا n محاسبه می‌شوند"
                  inputProps={{ min: 1, max: 10 }}
                />
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleCalculate}
                  disabled={loading}
                  startIcon={<PowerIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    py: 1.5,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    }
                  }}
                >
                  محاسبه توان‌ها
                </Button>
              </Box>

              <Paper sx={{ p: 2, mt: 3, bgcolor: 'rgba(255,255,255,0.02)' }}>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon fontSize="small" />
                  نکات:
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  • R² = R ∘ R (ترکیب R با خودش)
                </Typography>
                <Typography variant="body2">
                  • بستار تعدی = R ∪ R² ∪ R³ ∪ ...
                </Typography>
                <Typography variant="body2">
                  • برای ماتریس n×n حداکثر n توان کافی است
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          {result ? (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  نتایج محاسبه
                </Typography>
                
                <Tabs 
                  value={selectedTab} 
                  onChange={(e, v) => setSelectedTab(v)}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {result.powers && result.powers.map((_, index) => (
                    <Tab 
                      key={index} 
                      label={`R^${index + 1}`}
                      icon={<Chip label={index + 1} size="small" color="primary" />}
                    />
                  ))}
                  <Tab 
                    label="بستار تعدی" 
                    icon={<AllInclusiveIcon />}
                  />
                </Tabs>

                <Divider sx={{ my: 2 }} />

                {selectedTab < result.powers?.length ? (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      R^{selectedTab + 1} - توان {selectedTab + 1}
                    </Typography>
                    <MatrixInput 
                      matrix={result.powers[selectedTab]}
                      setMatrix={() => {}}
                      title=""
                      editable={false}
                      showLabels={true}
                    />
                    
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="caption">
                        (a,b) ∈ R^{selectedTab + 1} یعنی از a به b مسیری با طول {selectedTab + 1} وجود دارد
                      </Typography>
                    </Alert>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AllInclusiveIcon />
                      بستار تعدی (R*)
                    </Typography>
                    <MatrixInput 
                      matrix={result.transitive_closure}
                      setMatrix={() => {}}
                      title=""
                      editable={false}
                      showLabels={true}
                    />
                    
                    <Alert severity="success" sx={{ mt: 2 }}>
                      <Typography variant="caption">
                        (a,b) ∈ R* یعنی از a به b مسیری (با هر طولی) وجود دارد
                      </Typography>
                    </Alert>

                    <Paper sx={{ p: 2, mt: 2, bgcolor: 'rgba(255,255,255,0.02)' }}>
                      <Typography variant="subtitle2" gutterBottom>
                        خلاصه:
                      </Typography>
                      <Typography variant="body2">
                        بستار تعدی = اجتماع همه توان‌های R از 1 تا ∞
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        برای ماتریس {matrix.length}×{matrix.length} حداکثر {matrix.length} توان کافی است
                      </Typography>
                    </Paper>
                  </Box>
                )}
              </CardContent>
            </Card>
          ) : (
            <Alert severity="info">
              ماتریس رابطه را وارد کرده، حداکثر توان را مشخص کنید و دکمه محاسبه را بزنید
            </Alert>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default RelationPower
