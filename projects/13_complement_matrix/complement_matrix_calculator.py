#!/usr/bin/env python3
"""Calculate complement of adjacency matrix"""

from typing import List


class ComplementMatrixCalculator:
    """Class to calculate complement of adjacency matrix"""
    
    def __init__(self, adj_matrix: List[List[int]]):
        """Initialize with adjacency matrix"""
        self.adj_matrix = adj_matrix
        self.n = len(adj_matrix)
    
    def calculate_complement(self) -> List[List[int]]:
        """Calculate complement matrix of the graph"""
        complement = [[0] * self.n for _ in range(self.n)]
        
        for i in range(self.n):
            for j in range(self.n):
                if i != j:  # No self-loops in complement
                    # If edge exists in original, it doesn't exist in complement
                    # If edge doesn't exist in original, it exists in complement
                    complement[i][j] = 1 - self.adj_matrix[i][j]
                else:
                    # Diagonal remains 0 (no self-loops)
                    complement[i][j] = 0
        
        return complement
    
    def count_edges(self, matrix: List[List[int]]) -> int:
        """Count number of edges in the graph"""
        edges = 0
        for i in range(self.n):
            for j in range(self.n):
                if matrix[i][j] > 0:
                    edges += 1
        return edges
    
    def get_graph_properties(self, matrix: List[List[int]]) -> dict:
        """Get properties of the graph"""
        edges = self.count_edges(matrix)
        max_edges = self.n * (self.n - 1)  # For directed graph without self-loops
        
        # Check if undirected (symmetric)
        is_undirected = all(matrix[i][j] == matrix[j][i] 
                           for i in range(self.n) 
                           for j in range(self.n))
        
        if is_undirected:
            edges = edges // 2  # Count each edge once for undirected
            max_edges = self.n * (self.n - 1) // 2
        
        return {
            'vertices': self.n,
            'edges': edges,
            'max_edges': max_edges,
            'is_undirected': is_undirected,
            'density': edges / max_edges if max_edges > 0 else 0
        }


def print_matrix(matrix: List[List[int]], title: str, vertices: List[str] = None):
    """Print adjacency matrix in readable format"""
    n = len(matrix)
    if vertices is None:
        vertices = [str(i) for i in range(n)]
    
    print(f"\n{title}:")
    print("    ", end="")
    for v in vertices:
        print(f"{v:3}", end="")
    print()
    
    for i in range(n):
        print(f"{vertices[i]:3} ", end="")
        for j in range(n):
            print(f"{matrix[i][j]:3}", end="")
        print()


def visualize_edges(matrix: List[List[int]], vertices: List[str] = None) -> str:
    """Create a text representation of edges"""
    n = len(matrix)
    if vertices is None:
        vertices = [str(i) for i in range(n)]
    
    edges = []
    for i in range(n):
        for j in range(n):
            if matrix[i][j] > 0:
                edges.append(f"{vertices[i]}→{vertices[j]}")
    
    return "Edges: " + ", ".join(edges) if edges else "Edges: None"


def main():
    """Main function with examples"""
    
    print("Complement Matrix Calculator")
    print("=" * 50)
    
    # Example 1: Simple undirected graph
    print("\nExample 1: Simple Undirected Graph")
    print("-" * 40)
    
    # Original graph: Triangle
    #     0---1
    #      \ /
    #       2
    
    adj_matrix1 = [
        [0, 1, 1],  # 0 connected to 1, 2
        [1, 0, 1],  # 1 connected to 0, 2
        [1, 1, 0],  # 2 connected to 0, 1
    ]
    
    vertices1 = ['A', 'B', 'C']
    print_matrix(adj_matrix1, "Original Graph (Triangle)", vertices1)
    
    calc1 = ComplementMatrixCalculator(adj_matrix1)
    complement1 = calc1.calculate_complement()
    
    print_matrix(complement1, "Complement Graph", vertices1)
    
    # Properties
    orig_props = calc1.get_graph_properties(adj_matrix1)
    comp_props = calc1.get_graph_properties(complement1)
    
    print("\nOriginal Graph Properties:")
    print(f"  Vertices: {orig_props['vertices']}")
    print(f"  Edges: {orig_props['edges']}")
    print(f"  Type: {'Undirected' if orig_props['is_undirected'] else 'Directed'}")
    print(f"  {visualize_edges(adj_matrix1, vertices1)}")
    
    print("\nComplement Graph Properties:")
    print(f"  Vertices: {comp_props['vertices']}")
    print(f"  Edges: {comp_props['edges']}")
    print(f"  Type: {'Undirected' if comp_props['is_undirected'] else 'Directed'}")
    print(f"  {visualize_edges(complement1, vertices1)}")
    
    # Example 2: Directed graph
    print("\n" + "=" * 50)
    print("\nExample 2: Directed Graph")
    print("-" * 40)
    
    # Original graph: Directed path
    #     0 → 1 → 2 → 3
    
    adj_matrix2 = [
        [0, 1, 0, 0],  # 0 → 1
        [0, 0, 1, 0],  # 1 → 2
        [0, 0, 0, 1],  # 2 → 3
        [0, 0, 0, 0],  # 3 (no outgoing)
    ]
    
    vertices2 = ['0', '1', '2', '3']
    print_matrix(adj_matrix2, "Original Graph (Directed Path)", vertices2)
    
    calc2 = ComplementMatrixCalculator(adj_matrix2)
    complement2 = calc2.calculate_complement()
    
    print_matrix(complement2, "Complement Graph", vertices2)
    
    # Properties
    orig_props2 = calc2.get_graph_properties(adj_matrix2)
    comp_props2 = calc2.get_graph_properties(complement2)
    
    print("\nOriginal Graph Properties:")
    print(f"  Vertices: {orig_props2['vertices']}")
    print(f"  Edges: {orig_props2['edges']}")
    print(f"  Max possible edges: {orig_props2['max_edges']}")
    print(f"  Density: {orig_props2['density']:.2f}")
    
    print("\nComplement Graph Properties:")
    print(f"  Vertices: {comp_props2['vertices']}")
    print(f"  Edges: {comp_props2['edges']}")
    print(f"  Max possible edges: {comp_props2['max_edges']}")
    print(f"  Density: {comp_props2['density']:.2f}")
    
    print(f"\nNote: Original edges + Complement edges = {orig_props2['edges'] + comp_props2['edges']}")
    print(f"      Maximum possible edges = {orig_props2['max_edges']}")
    
    # Example 3: Complete graph
    print("\n" + "=" * 50)
    print("\nExample 3: Complete Graph K4")
    print("-" * 40)
    
    # Complete graph with 4 vertices
    adj_matrix3 = [
        [0, 1, 1, 1],
        [1, 0, 1, 1],
        [1, 1, 0, 1],
        [1, 1, 1, 0],
    ]
    
    vertices3 = ['A', 'B', 'C', 'D']
    print_matrix(adj_matrix3, "Original Graph (Complete K4)", vertices3)
    
    calc3 = ComplementMatrixCalculator(adj_matrix3)
    complement3 = calc3.calculate_complement()
    
    print_matrix(complement3, "Complement Graph (Empty)", vertices3)
    
    print("\nNote: Complement of complete graph is empty graph (no edges)")
    
    # Example 4: Empty graph
    print("\n" + "=" * 50)
    print("\nExample 4: Empty Graph")
    print("-" * 40)
    
    # Empty graph with 4 vertices
    adj_matrix4 = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ]
    
    print_matrix(adj_matrix4, "Original Graph (Empty)", vertices3)
    
    calc4 = ComplementMatrixCalculator(adj_matrix4)
    complement4 = calc4.calculate_complement()
    
    print_matrix(complement4, "Complement Graph (Complete K4)", vertices3)
    
    print("\nNote: Complement of empty graph is complete graph")
    
    # Interactive mode
    print("\n" + "=" * 50)
    print("\nInteractive Mode")
    print("-" * 40)
    
    choice = input("\nDo you want to enter your own graph? (y/n): ").lower()
    if choice == 'y':
        n = int(input("Enter number of vertices: "))
        
        print("\nEnter adjacency matrix (0 or 1 for each edge):")
        print("Format: Enter each row separated by spaces")
        adj_matrix = []
        for i in range(n):
            row = list(map(int, input(f"Row {i}: ").split()))
            if len(row) != n:
                print(f"Error: Row must have {n} elements")
                return
            adj_matrix.append(row)
        
        # Create vertex labels
        if n <= 26:
            vertices = [chr(65 + i) for i in range(n)]  # A, B, C, ...
        else:
            vertices = [str(i) for i in range(n)]  # 0, 1, 2, ...
        
        print_matrix(adj_matrix, "Original Graph", vertices)
        
        calc = ComplementMatrixCalculator(adj_matrix)
        complement = calc.calculate_complement()
        
        print_matrix(complement, "Complement Graph", vertices)
        
        # Properties
        orig_props = calc.get_graph_properties(adj_matrix)
        comp_props = calc.get_graph_properties(complement)
        
        print("\nOriginal Graph:")
        print(f"  Edges: {orig_props['edges']}")
        print(f"  Type: {'Undirected' if orig_props['is_undirected'] else 'Directed'}")
        
        print("\nComplement Graph:")
        print(f"  Edges: {comp_props['edges']}")
        
        print(f"\nTotal edges (Original + Complement): {orig_props['edges'] + comp_props['edges']}")
        print(f"Maximum possible edges: {orig_props['max_edges']}")


if __name__ == "__main__":
    main()
