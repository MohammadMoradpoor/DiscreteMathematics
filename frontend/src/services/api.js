import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Relation to Graph
export const relationToGraph = async (matrix) => {
  const response = await api.post('/relation-to-graph', { matrix })
  return response.data
}

// Boolean Operations
export const booleanOperations = async (matrixA, matrixB) => {
  const response = await api.post('/boolean-operations', { matrixA, matrixB })
  return response.data
}

// Boolean Multiplication
export const booleanMultiplication = async (matrixA, matrixB) => {
  const response = await api.post('/boolean-multiplication', { matrixA, matrixB })
  return response.data
}

// Relation Power
export const relationPower = async (matrix, maxPower) => {
  const response = await api.post('/relation-power', { matrix, maxPower })
  return response.data
}

// Relation Properties
export const relationProperties = async (matrix) => {
  const response = await api.post('/relation-properties', { matrix })
  return response.data
}

// Relation Closures
export const relationClosures = async (matrix) => {
  const response = await api.post('/relation-closures', { matrix })
  return response.data
}

// Relation Composition
export const relationComposition = async (matrixR, matrixS) => {
  const response = await api.post('/relation-composition', { matrixR, matrixS })
  return response.data
}

// Graph Visualizer
export const visualizeGraph = async (adjMatrix) => {
  const response = await api.post('/visualize-graph', { adjMatrix })
  return response.data
}

// Vertex Degree
export const calculateVertexDegree = async (adjMatrix, isDirected = false) => {
  const response = await api.post('/vertex-degree', { adjMatrix, isDirected })
  return response.data
}

// Complement Matrix
export const calculateComplement = async (adjMatrix) => {
  const response = await api.post('/complement-matrix', { adjMatrix })
  return response.data
}

// Subgraph Checker
export const checkSubgraph = async (matrixG1, matrixG2) => {
  const response = await api.post('/check-subgraph', { matrixG1, matrixG2 })
  return response.data
}

// Connectivity Checker
export const checkConnectivity = async (adjMatrix, isDirected = false) => {
  const response = await api.post('/check-connectivity', { adjMatrix, isDirected })
  return response.data
}

// Path Length Calculator
export const calculatePathLength = async (adjMatrix, weightMatrix, path) => {
  const response = await api.post('/calculate-path-length', { adjMatrix, weightMatrix, path })
  return response.data
}

// Eulerian Path
export const findEulerianPath = async (adjMatrix) => {
  const response = await api.post('/find-eulerian-path', { adjMatrix })
  return response.data
}

// Dijkstra Algorithm
export const dijkstraShortestPath = async (edges, startNode) => {
  const response = await api.post('/dijkstra-shortest-path', { edges, startNode })
  return response.data
}

export default api
