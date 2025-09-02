import React, { useState } from 'react'
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  Paper,
  Divider,
  Alert
} from '@mui/material'
import { toast } from 'react-toastify'
import MatrixInput from './common/MatrixInput'
import { booleanOperations } from '../services/api'
import CalculateIcon from '@mui/icons-material/Calculate'
import AddIcon from '@mui/icons-material/Add'
import MergeTypeIcon from '@mui/icons-material/MergeType'

const BooleanOperations = () => {
  const [matrixA, setMatrixA] = useState([
    [1, 0, 1],
    [0, 1, 0],
    [1, 1, 0]
  ])
  const [matrixB, setMatrixB] = useState([
    [0, 1, 1],
    [1, 0, 1],
    [0, 0, 1]
  ])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    // Check if matrices have same dimensions
    if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
      toast.error('ماتریس‌ها باید ابعاد یکسان داشته باشند!')
      return
    }

    try {
      setLoading(true)
      const response = await booleanOperations(matrixA, matrixB)
      setResult(response)
      toast.success('عملیات با موفقیت انجام شد!')
    } catch (error) {
      toast.error('خطا در انجام عملیات: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const syncMatrixSizes = () => {
    const size = matrixA.length
    const newMatrixB = Array(size).fill(null).map((_, i) => 
      Array(size).fill(null).map((_, j) => 
        matrixB[i] && matrixB[i][j] !== undefined ? matrixB[i][j] : 0
      )
    )
    setMatrixB(newMatrixB)
    toast.info('اندازه ماتریس B با A همگام‌سازی شد')
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalculateIcon sx={{ fontSize: 35 }} />
          ۳. عملیات بولی روی ماتریس‌ها
        </Typography>
        <Typography variant="body1" color="text.secondary">
          جمع بولی (OR) و ضرب عنصر به عنصر (AND) دو ماتریس را محاسبه کنید
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <MatrixInput 
                matrix={matrixA}
                setMatrix={setMatrixA}
                title="ماتریس A"
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
                <Typography variant="h6">ماتریس B</Typography>
                <Button
                  size="small"
                  onClick={syncMatrixSizes}
                  startIcon={<MergeTypeIcon />}
                >
                  همگام‌سازی اندازه با A
                </Button>
              </Box>
              <MatrixInput 
                matrix={matrixB}
                setMatrix={setMatrixB}
                title=""
                showLabels={true}
                maxSize={7}
                minSize={2}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleCalculate}
              disabled={loading}
              startIcon={<CalculateIcon />}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                px: 4,
                py: 1.5,
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                }
              }}
            >
              محاسبه عملیات بولی
            </Button>
          </Box>
        </Grid>

        {result && (
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AddIcon />
                      جمع بولی (A ∨ B)
                    </Typography>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      عملیات OR روی عناصر متناظر
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <MatrixInput 
                      matrix={result.addition}
                      setMatrix={() => {}}
                      title=""
                      editable={false}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      ضرب عنصر به عنصر (A ∧ B)
                    </Typography>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      عملیات AND روی عناصر متناظر
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <MatrixInput 
                      matrix={result.elementwise_and}
                      setMatrix={() => {}}
                      title=""
                      editable={false}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        )}

        {!result && !loading && (
          <Grid item xs={12}>
            <Alert severity="info">
              دو ماتریس با ابعاد یکسان وارد کنید و دکمه محاسبه را بزنید
            </Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default BooleanOperations
