import numpy as np

class PathLengthCalculator:
    def __init__(self, adj_matrix, weight_matrix):
        self.adj_matrix = np.array(adj_matrix)
        self.weight_matrix = np.array(weight_matrix)
        self.n = len(adj_matrix)
    
    def calculate_path_length(self, path):
        """
        Calculate the total length of a path in the graph
        Returns: (valid, total_length, edges_list)
        """
        if len(path) < 2:
            return False, 0, []
        
        total_length = 0
        edges = []
        
        # Check each edge in the path
        for i in range(len(path) - 1):
            from_vertex = path[i]
            to_vertex = path[i + 1]
            
            # Check if vertices are valid
            if from_vertex < 0 or from_vertex >= self.n or to_vertex < 0 or to_vertex >= self.n:
                return False, 0, []
            
            # Check if edge exists
            if self.adj_matrix[from_vertex][to_vertex] == 0:
                return False, 0, []
            
            # Get edge weight
            weight = self.weight_matrix[from_vertex][to_vertex]
            if weight == 0:
                weight = 1  # Default weight if not specified
            
            total_length += weight
            edges.append({
                'from': int(from_vertex),
                'to': int(to_vertex),
                'weight': float(weight)
            })
        
        return True, float(total_length), edges
