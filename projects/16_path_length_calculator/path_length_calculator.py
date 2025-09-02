#!/usr/bin/env python3
"""Calculate path length using adjacency matrix and weight matrix"""

from typing import List, Optional, Tuple


class PathLengthCalculator:
    """Class to calculate path length from adjacency and weight matrices"""
    
    def __init__(self, adj_matrix: List[List[int]], weight_matrix: List[List[float]]):
        """Initialize with adjacency matrix and weight matrix"""
        self.adj_matrix = adj_matrix
        self.weight_matrix = weight_matrix
        self.n = len(adj_matrix)
        
        # Validate matrices have same dimensions
        if len(weight_matrix) != self.n:
            raise ValueError("Adjacency and weight matrices must have same dimensions")
        for row in adj_matrix + weight_matrix:
            if len(row) != self.n:
                raise ValueError("Matrices must be square")
    
    def is_valid_edge(self, from_vertex: int, to_vertex: int) -> bool:
        """Check if edge exists between two vertices"""
        return self.adj_matrix[from_vertex][to_vertex] > 0
    
    def get_edge_weight(self, from_vertex: int, to_vertex: int) -> Optional[float]:
        """Get weight of edge between two vertices"""
        if self.is_valid_edge(from_vertex, to_vertex):
            return self.weight_matrix[from_vertex][to_vertex]
        return None
    
    def calculate_path_length(self, path: List[int]) -> Tuple[bool, float, List[Tuple[int, int, float]]]:
        """Calculate total length of given path"""
        if len(path) < 2:
            return True, 0, []  # Empty or single vertex path has length 0
        
        total_length = 0
        edges = []
        
        # Check each edge in the path
        for i in range(len(path) - 1):
            from_v = path[i]
            to_v = path[i + 1]
            
            # Validate vertex indices
            if from_v < 0 or from_v >= self.n or to_v < 0 or to_v >= self.n:
                print(f"Error: Vertex {from_v if from_v >= self.n else to_v} is out of range (0-{self.n-1})")
                return False, 0, []
            
            # Check if edge exists
            if not self.is_valid_edge(from_v, to_v):
                print(f"Error: No edge from vertex {from_v} to vertex {to_v}")
                return False, 0, []
            
            # Get edge weight and add to total
            weight = self.get_edge_weight(from_v, to_v)
            total_length += weight
            edges.append((from_v, to_v, weight))
        
        return True, total_length, edges


def print_matrix(matrix: List[List], title: str, vertices: List[str]):
    """Print matrix in readable format"""
    print(f"\n{title}:")
    print("    ", end="")
    for v in vertices:
        print(f"{v:6}", end="")
    print()
    
    for i in range(len(matrix)):
        print(f"{vertices[i]:3} ", end="")
        for j in range(len(matrix[i])):
            print(f"{matrix[i][j]:6.1f}", end="")
        print()


def get_user_input():
    """Get matrices and path from user input"""
    print("Path Length Calculator")
    print("=" * 50)
    
    # Get matrix size
    n = int(input("\nEnter number of vertices: "))
    
    # Get adjacency matrix
    print("\nEnter adjacency matrix (0 or 1 for each edge):")
    print("Format: Enter each row separated by spaces")
    adj_matrix = []
    for i in range(n):
        row = list(map(int, input(f"Row {i}: ").split()))
        if len(row) != n:
            print(f"Error: Row must have {n} elements")
            return None, None, None
        adj_matrix.append(row)
    
    # Get weight matrix
    print("\nEnter weight matrix (weights for existing edges):")
    print("Format: Enter each row separated by spaces")
    weight_matrix = []
    for i in range(n):
        row = list(map(float, input(f"Row {i}: ").split()))
        if len(row) != n:
            print(f"Error: Row must have {n} elements")
            return None, None, None
        weight_matrix.append(row)
    
    # Get path
    print("\nEnter the path (vertex indices separated by spaces):")
    path = list(map(int, input("Path: ").split()))
    
    return adj_matrix, weight_matrix, path


def main():
    """Main function with examples and user input option"""
    
    print("Path Length Calculator")
    print("=" * 50)
    
    # Example 1: Simple graph
    print("\nExample 1: Simple Directed Graph")
    print("-" * 40)
    
    # Graph structure with weights:
    #     1
    #   0---1
    #   |\ /|
    #  2| X |3
    #   |/ \|
    #   2---3
    #     4
    
    adj_matrix1 = [
        [0, 1, 1, 0],  # 0 -> 1, 2
        [0, 0, 1, 1],  # 1 -> 2, 3
        [0, 1, 0, 1],  # 2 -> 1, 3
        [0, 0, 0, 0],  # 3 -> none
    ]
    
    weight_matrix1 = [
        [0, 1, 2, 0],  # 0->1: weight 1, 0->2: weight 2
        [0, 0, 3, 3],  # 1->2: weight 3, 1->3: weight 3
        [0, 1, 0, 4],  # 2->1: weight 1, 2->3: weight 4
        [0, 0, 0, 0],  # no outgoing edges
    ]
    
    vertices = ['0', '1', '2', '3']
    print_matrix(adj_matrix1, "Adjacency Matrix", vertices)
    print_matrix(weight_matrix1, "Weight Matrix", vertices)
    
    calc = PathLengthCalculator(adj_matrix1, weight_matrix1)
    
    # Test different paths
    test_paths = [
        [0, 1, 3],      # 0 -> 1 -> 3
        [0, 2, 3],      # 0 -> 2 -> 3
        [0, 1, 2, 3],   # 0 -> 1 -> 2 -> 3
        [0, 2, 1, 3],   # 0 -> 2 -> 1 -> 3
    ]
    
    print("\nPath Length Calculations:")
    for path in test_paths:
        path_str = " -> ".join(str(v) for v in path)
        valid, length, edges = calc.calculate_path_length(path)
        
        if valid:
            print(f"\nPath: {path_str}")
            print(f"  Total length: {length}")
            print("  Edges:")
            for from_v, to_v, weight in edges:
                print(f"    {from_v} -> {to_v}: weight = {weight}")
        else:
            print(f"\nPath: {path_str}")
            print("  Invalid path!")
    
    # Example 2: Weighted complete graph
    print("\n" + "=" * 50)
    print("\nExample 2: Weighted Complete Graph")
    print("-" * 40)
    
    adj_matrix2 = [
        [0, 1, 1, 1],  # 0 connected to all others
        [1, 0, 1, 1],  # 1 connected to all others
        [1, 1, 0, 1],  # 2 connected to all others
        [1, 1, 1, 0],  # 3 connected to all others
    ]
    
    weight_matrix2 = [
        [0, 10, 15, 20],
        [10, 0, 35, 25],
        [15, 35, 0, 30],
        [20, 25, 30, 0],
    ]
    
    vertices2 = ['A', 'B', 'C', 'D']
    print_matrix(adj_matrix2, "Adjacency Matrix", vertices2)
    print_matrix(weight_matrix2, "Weight Matrix", vertices2)
    
    calc2 = PathLengthCalculator(adj_matrix2, weight_matrix2)
    
    # Test a circular path
    path = [0, 1, 2, 3, 0]  # A -> B -> C -> D -> A
    path_str = " -> ".join(vertices2[v] for v in path)
    valid, length, edges = calc2.calculate_path_length(path)
    
    print(f"\nCircular Path: {path_str}")
    if valid:
        print(f"  Total length: {length}")
        print("  Edges:")
        for from_v, to_v, weight in edges:
            print(f"    {vertices2[from_v]} -> {vertices2[to_v]}: weight = {weight}")
    
    # Interactive mode
    print("\n" + "=" * 50)
    print("\nInteractive Mode")
    print("-" * 40)
    
    choice = input("\nDo you want to enter your own graph? (y/n): ").lower()
    if choice == 'y':
        adj_matrix, weight_matrix, path = get_user_input()
        
        if adj_matrix and weight_matrix and path:
            calc_user = PathLengthCalculator(adj_matrix, weight_matrix)
            valid, length, edges = calc_user.calculate_path_length(path)
            
            path_str = " -> ".join(str(v) for v in path)
            print(f"\nPath: {path_str}")
            
            if valid:
                print(f"Total length: {length}")
                if edges:
                    print("\nDetailed edge weights:")
                    for from_v, to_v, weight in edges:
                        print(f"  {from_v} -> {to_v}: weight = {weight}")
            else:
                print("Invalid path! Check the error message above.")


if __name__ == "__main__":
    main()
