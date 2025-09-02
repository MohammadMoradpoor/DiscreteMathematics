import React, { useState } from 'react'
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  Paper,
  Alert,
  Divider,
  Chip
} from '@mui/material'
import { toast } from 'react-toastify'
import MatrixInput from './common/MatrixInput'
import { relationComposition } from '../services/api'
import MergeTypeIcon from '@mui/icons-material/MergeType'
import InfoIcon from '@mui/icons-material/Info'

const RelationComposition = () => {
  const [matrixR, setMatrixR] = useState([
    [0, 1, 0],
    [0, 0, 1],
    [1, 0, 0]
  ])
  const [matrixS, setMatrixS] = useState([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    // Check dimensions
    if (matrixR[0].length !== matrixS.length) {
      toast.error('تعداد ستون‌های R باید برابر تعداد سطرهای S باشد!')
      return
    }

    try {
      setLoading(true)
      const response = await relationComposition(matrixR, matrixS)
      setResult(response)
      toast.success('ترکیب روابط محاسبه شد!')
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
          <MergeTypeIcon sx={{ fontSize: 35 }} />
          ۱۰. ترکیب روابط
        </Typography>
        <Typography variant="body1" color="text.secondary">
          محاسبه ترکیب دو رابطه R∘S (ابتدا S سپس R اعمال می‌شود)
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                رابطه R (دوم اعمال می‌شود)
              </Typography>
              <MatrixInput 
                matrix={matrixR}
                setMatrix={setMatrixR}
                title=""
                showLabels={true}
               maxSize={7} minSize={2}/>
              <Paper sx={{ p: 1, mt: 2, bgcolor: 'rgba(255,255,255,0.02)' }}>
                <Typography variant="caption" color="text.secondary">
                  ابعاد: {matrixR.length} × {matrixR[0]?.length}
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="secondary">
                رابطه S (اول اعمال می‌شود)
              </Typography>
              <MatrixInput 
                matrix={matrixS}
                setMatrix={setMatrixS}
                title=""
                showLabels={true}
               maxSize={7} minSize={2}/>
              <Paper sx={{ p: 1, mt: 2, bgcolor: 'rgba(255,255,255,0.02)' }}>
                <Typography variant="caption" color="text.secondary">
                  ابعاد: {matrixS.length} × {matrixS[0]?.length}
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleCalculate}
              disabled={loading}
              startIcon={<MergeTypeIcon />}
              sx={{
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                }
              }}
            >
              محاسبه R∘S
            </Button>
          </Box>
        </Grid>

        {result && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  نتیجه ترکیب R∘S
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <MatrixInput 
                      matrix={result.composition}
                      setMatrix={() => {}}
                      title=""
                      editable={false}
                      showLabels={true}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)' }}>
                      <Typography variant="subtitle2" gutterBottom>
                        اطلاعات ترکیب:
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Chip 
                          label={`ابعاد نتیجه: ${result.dimensions?.RoS || ''}`}
                          color="success"
                        />
                        <Divider />
                        <Typography variant="caption" color="text.secondary">
                          R: {result.dimensions?.R}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          S: {result.dimensions?.S}
                        </Typography>
                      </Box>
                    </Paper>

                    <Alert severity="info" sx={{ mt: 2 }} icon={<InfoIcon />}>
                      <Typography variant="caption">
                        (a,c) ∈ R∘S اگر و تنها اگر
                        <br />
                        ∃b: (a,b) ∈ S و (b,c) ∈ R
                      </Typography>
                    </Alert>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {!result && !loading && (
          <Grid item xs={12}>
            <Alert severity="info">
              دو ماتریس رابطه را وارد کنید. توجه: تعداد ستون‌های R باید با تعداد سطرهای S برابر باشد.
            </Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default RelationComposition
