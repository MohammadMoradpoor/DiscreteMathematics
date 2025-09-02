import React, { useState } from 'react'
import { Box, Typography, Card, CardContent, Grid, Button, Alert } from '@mui/material'
import MatrixInput from './common/MatrixInput'
import { booleanMultiplication } from '../services/api'
import { toast } from 'react-toastify'
import ClearIcon from '@mui/icons-material/Clear'

const BooleanMultiplication = () => {
  const [matrixA, setMatrixA] = useState([[1, 0, 1], [0, 1, 0], [1, 1, 0]])
  const [matrixB, setMatrixB] = useState([[0, 1, 1], [1, 0, 1], [0, 0, 1]])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    if (matrixA[0].length !== matrixB.length) {
      toast.error('تعداد ستون‌های A باید با تعداد سطرهای B برابر باشد!')
      return
    }
    try {
      setLoading(true)
      const response = await booleanMultiplication(matrixA, matrixB)
      setResult(response)
      toast.success('ضرب بولی با موفقیت انجام شد!')
    } catch (error) {
      toast.error('خطا: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ClearIcon sx={{ fontSize: 35 }} />
        ۴. ضرب بولی ماتریس‌ها
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <MatrixInput matrix={matrixA} setMatrix={setMatrixA} title="ماتریس A" maxSize={7} minSize={2} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <MatrixInput matrix={matrixB} setMatrix={setMatrixB} title="ماتریس B" maxSize={7} minSize={2} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleCalculate} disabled={loading}
            sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            محاسبه ضرب بولی
          </Button>
        </Grid>
        {result && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">نتیجه A ⊙ B</Typography>
                <MatrixInput matrix={result.result} setMatrix={() => {}} editable={false} />
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default BooleanMultiplication
