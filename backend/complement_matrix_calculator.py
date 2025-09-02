import numpy as np

class ComplementMatrixCalculator:
    def __init__(self, adj_matrix):
        self.adj_matrix = np.array(adj_matrix)
        self.n = len(adj_matrix)
    
    def calculate_complement(self):
        """Calculate the complement of the adjacency matrix"""
        complement = np.ones((self.n, self.n), dtype=int)
        
        # Set diagonal to 0 (no self-loops in complement)
        np.fill_diagonal(complement, 0)
        
        # Flip the edges (1 becomes 0, 0 becomes 1, except diagonal)
        for i in range(self.n):
            for j in range(self.n):
                if i != j:
                    complement[i][j] = 1 - self.adj_matrix[i][j]
        
        return complement.tolist()
    
    def get_graph_properties(self, matrix):
        """Calculate properties of a graph from its adjacency matrix"""
        matrix = np.array(matrix)
        n = len(matrix)
        
        # Count edges (for undirected graph, count each edge once)
        edge_count = 0
        for i in range(n):
            for j in range(i, n):  # Start from i to avoid double counting
                if matrix[i][j] == 1:
                    if i == j:  # Self-loop counts as one edge
                        edge_count += 1
                    else:  # Regular edge
                        edge_count += 1
        
        # Calculate degrees
        degrees = []
        for i in range(n):
            degree = 0
            for j in range(n):
                if matrix[i][j] == 1:
                    if i == j:  # Self-loop counts as 2 to the degree
                        degree += 2
                    else:
                        degree += 1
            degrees.append(degree)
        
        # Calculate average degree
        avg_degree = sum(degrees) / n if n > 0 else 0
        
        # Calculate density
        # For simple graphs: density = 2 * edges / (n * (n-1))
        # But if we allow self-loops: density = edges / (n * n)
        max_edges = n * (n - 1) / 2  # Maximum edges in simple graph
        density = edge_count / max_edges if max_edges > 0 else 0
        
        # Check if complete
        is_complete = all(matrix[i][j] == 1 for i in range(n) for j in range(n) if i != j)
        
        return {
            'edge_count': edge_count,
            'avg_degree': avg_degree,
            'density': density,
            'is_complete': is_complete,
            'degrees': degrees
        }
