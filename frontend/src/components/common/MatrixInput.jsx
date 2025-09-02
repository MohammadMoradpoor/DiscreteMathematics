import React from 'react'
import { Box, TextField, Typography, IconButton, Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import RestartAltIcon from '@mui/icons-material/RestartAlt'

const MatrixInput = ({ 
  matrix, 
  setMatrix, 
  title = "Matrix", 
  editable = true,
  showLabels = true,
  maxSize = 10,
  minSize = 2 
}) => {
  const size = matrix.length

  const handleCellChange = (i, j, value) => {
    if (!editable) return
    const newMatrix = matrix.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (rowIndex === i && colIndex === j) {
          // Only allow 0 or 1 for boolean matrices
          const numValue = parseInt(value) || 0
          return numValue > 0 ? 1 : 0
        }
        return cell
      })
    )
    setMatrix(newMatrix)
  }

  const increaseSize = () => {
    if (size >= maxSize) return
    const newMatrix = matrix.map(row => [...row, 0])
    newMatrix.push(new Array(size + 1).fill(0))
    setMatrix(newMatrix)
  }

  const decreaseSize = () => {
    if (size <= minSize) return
    const newMatrix = matrix.slice(0, -1).map(row => row.slice(0, -1))
    setMatrix(newMatrix)
  }

  const resetMatrix = () => {
    const newMatrix = Array(size).fill(null).map(() => Array(size).fill(0))
    setMatrix(newMatrix)
  }

  const getLabel = (index) => {
    if (index < 26) return String.fromCharCode(65 + index)
    return index.toString()
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {title} ({size}×{size})
        </Typography>
        {editable && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="کاهش اندازه">
              <IconButton 
                onClick={decreaseSize} 
                disabled={size <= minSize}
                size="small"
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.05)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                <RemoveIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="افزایش اندازه">
              <IconButton 
                onClick={increaseSize} 
                disabled={size >= maxSize}
                size="small"
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.05)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="پاک کردن">
              <IconButton 
                onClick={resetMatrix}
                size="small"
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.05)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                <RestartAltIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      <Box sx={{ 
        display: 'inline-block',
        p: 2,
        bgcolor: 'rgba(255,255,255,0.02)',
        borderRadius: 2,
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        {showLabels && (
          <Box sx={{ display: 'flex', mb: 1 }}>
            <Box sx={{ width: 40 }} />
            {matrix[0].map((_, j) => (
              <Box 
                key={j} 
                sx={{ 
                  width: 60, 
                  textAlign: 'center',
                  color: 'primary.light',
                  fontWeight: 'bold'
                }}
              >
                {getLabel(j)}
              </Box>
            ))}
          </Box>
        )}
        
        {matrix.map((row, i) => (
          <Box key={i} sx={{ display: 'flex', mb: 0.5 }}>
            {showLabels && (
              <Box sx={{ 
                width: 40, 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.light',
                fontWeight: 'bold'
              }}>
                {getLabel(i)}
              </Box>
            )}
            {row.map((cell, j) => (
              <TextField
                key={`${i}-${j}`}
                value={cell}
                onChange={(e) => handleCellChange(i, j, e.target.value)}
                disabled={!editable}
                inputProps={{
                  style: { 
                    textAlign: 'center',
                    padding: '8px',
                    fontSize: '16px'
                  }
                }}
                sx={{
                  width: 60,
                  mr: 0.5,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: cell === 1 ? 'rgba(0, 188, 212, 0.15)' : 'rgba(255,255,255,0.05)',
                    '& fieldset': {
                      borderColor: cell === 1 ? 'primary.main' : 'rgba(255,255,255,0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.light',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default MatrixInput
