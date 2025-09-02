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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Divider
} from '@mui/material'
import { toast } from 'react-toastify'
import MatrixInput from './common/MatrixInput'
import { relationProperties } from '../services/api'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import CategoryIcon from '@mui/icons-material/Category'
import InfoIcon from '@mui/icons-material/Info'

const RelationProperties = () => {
  const [matrix, setMatrix] = useState([
    [1, 1, 0, 0],
    [1, 1, 1, 0],
    [0, 1, 1, 1],
    [0, 0, 1, 1]
  ])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCheck = async () => {
    try {
      setLoading(true)
      const response = await relationProperties(matrix)
      setResult(response)
      toast.success('خواص رابطه بررسی شد!')
    } catch (error) {
      toast.error('خطا در بررسی: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const PropertyItem = ({ property, value, label, description }) => (
    <ListItem>
      <ListItemIcon>
        {value ? 
          <CheckCircleIcon color="success" /> : 
          <CancelIcon color="error" />
        }
      </ListItemIcon>
      <ListItemText 
        primary={label}
        secondary={description}
      />
    </ListItem>
  )

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CategoryIcon sx={{ fontSize: 35 }} />
          ۶. خواص رابطه
        </Typography>
        <Typography variant="body1" color="text.secondary">
          بررسی خواص بازتابی، تقارنی، پادتقارنی، تعدی و کلی بودن رابطه
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ماتریس رابطه
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
                  onClick={handleCheck}
                  disabled={loading}
                  startIcon={<CategoryIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    py: 1.5,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    }
                  }}
                >
                  بررسی خواص
                </Button>
              </Box>

              <Paper sx={{ p: 2, mt: 3, bgcolor: 'rgba(255,255,255,0.02)' }}>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon fontSize="small" />
                  تعاریف مهم:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="رابطه هم‌ارزی"
                      secondary="بازتابی + تقارنی + تعدی"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="ترتیب جزئی"
                      secondary="بازتابی + پادتقارنی + تعدی"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="ترتیب جزئی اکید"
                      secondary="غیربازتابی + پادتقارنی + تعدی"
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
                      خواص رابطه
                    </Typography>
                    
                    <List>
                      <PropertyItem 
                        value={result.properties?.reflexive}
                        label="بازتابی (Reflexive)"
                        description="∀a: (a,a) ∈ R"
                      />
                      <PropertyItem 
                        value={result.properties?.irreflexive}
                        label="غیربازتابی (Irreflexive)"
                        description="∀a: (a,a) ∉ R"
                      />
                      <PropertyItem 
                        value={result.properties?.symmetric}
                        label="تقارنی (Symmetric)"
                        description="(a,b) ∈ R ⟹ (b,a) ∈ R"
                      />
                      <PropertyItem 
                        value={result.properties?.antisymmetric}
                        label="پادتقارنی (Antisymmetric)"
                        description="(a,b) ∈ R ∧ (b,a) ∈ R ⟹ a = b"
                      />
                      <PropertyItem 
                        value={result.properties?.transitive}
                        label="تعدی (Transitive)"
                        description="(a,b) ∈ R ∧ (b,c) ∈ R ⟹ (a,c) ∈ R"
                      />
                      <PropertyItem 
                        value={result.properties?.total}
                        label="کلی (Total)"
                        description="∀a,b: (a,b) ∈ R ∨ (b,a) ∈ R"
                      />
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {result.relation_types && result.relation_types.length > 0 && (
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        نوع رابطه
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {result.relation_types.map((type, index) => (
                          <Chip 
                            key={index}
                            label={type}
                            color="primary"
                            size="large"
                            icon={<CheckCircleIcon />}
                          />
                        ))}
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      {result.relation_types.includes('Equivalence Relation') && (
                        <Alert severity="success">
                          این رابطه یک رابطه هم‌ارزی است و می‌تواند مجموعه را به کلاس‌های هم‌ارزی افراز کند.
                        </Alert>
                      )}
                      
                      {result.relation_types.includes('Partial Order') && (
                        <Alert severity="info">
                          این رابطه یک ترتیب جزئی است و می‌تواند برای مرتب‌سازی عناصر استفاده شود.
                        </Alert>
                      )}
                      
                      {result.relation_types.includes('Strict Partial Order') && (
                        <Alert severity="warning">
                          این رابطه یک ترتیب جزئی اکید است (بدون عناصر برابر).
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          ) : (
            <Alert severity="info">
              ماتریس رابطه را وارد کرده و دکمه "بررسی خواص" را بزنید
            </Alert>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default RelationProperties
