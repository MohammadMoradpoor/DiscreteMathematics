#!/usr/bin/env python3
"""Calculate vertex degrees from adjacency matrix"""

from typing import List, Tuple


class VertexDegreeCalculator:
    """Class to calculate vertex degrees from adjacency matrix"""
    
    def __init__(self, adj_matrix: List[List[int]]):
        """Initialize with adjacency matrix"""
        self.adj_matrix = adj_matrix
        self.n = len(adj_matrix)
    
    def is_undirected(self) -> bool:
        """Check if graph is undirected (symmetric matrix)"""
        for i in range(self.n):
            for j in range(self.n):
                if self.adj_matrix[i][j] != self.adj_matrix[j][i]:
                    return False
        return True
    
    def calculate_degree_undirected(self) -> List[int]:
        """Calculate degree for undirected graph"""
        degrees = []
        for i in range(self.n):
            degree = 0
            for j in range(self.n):
                if i != j and self.adj_matrix[i][j] > 0:
                    degree += 1
                elif i == j and self.adj_matrix[i][j] > 0:
                    # Self-loop counts as 2
                    degree += 2
            degrees.append(degree)
        return degrees
    
    def calculate_degrees_directed(self) -> Tuple[List[int], List[int], List[int]]:
        """Calculate in-degree, out-degree, and total degree for directed graph"""
        in_degrees = [0] * self.n
        out_degrees = [0] * self.n
        
        for i in range(self.n):
            for j in range(self.n):
                if self.adj_matrix[i][j] > 0:
                    out_degrees[i] += 1  # Edge from i to j
                    in_degrees[j] += 1   # Edge into j from i
        
        # Total degree = in-degree + out-degree
        total_degrees = [in_degrees[i] + out_degrees[i] for i in range(self.n)]
        
        return in_degrees, out_degrees, total_degrees
    
    def find_special_vertices(self, degrees: List[int]) -> dict:
        """Find special vertices based on degrees"""
        if not degrees:
            return {}
        
        max_degree = max(degrees)
        min_degree = min(degrees)
        avg_degree = sum(degrees) / len(degrees)
        
        isolated = [i for i, d in enumerate(degrees) if d == 0]
        pendant = [i for i, d in enumerate(degrees) if d == 1]
        max_degree_vertices = [i for i, d in enumerate(degrees) if d == max_degree]
        min_degree_vertices = [i for i, d in enumerate(degrees) if d == min_degree]
        
        return {
            'isolated': isolated,
            'pendant': pendant,
            'max_degree_vertices': max_degree_vertices,
            'min_degree_vertices': min_degree_vertices,
            'max_degree': max_degree,
            'min_degree': min_degree,
            'avg_degree': avg_degree
        }


def print_matrix(matrix: List[List[int]], vertices: List[str] = None):
    """Print adjacency matrix"""
    n = len(matrix)
    if vertices is None:
        vertices = [str(i) for i in range(n)]
    
    print("\nAdjacency Matrix:")
    print("    ", end="")
    for v in vertices:
        print(f"{v:4}", end="")
    print()
    
    for i in range(n):
        print(f"{vertices[i]:3} ", end="")
        for j in range(n):
            print(f"{matrix[i][j]:4}", end="")
        print()


def print_degree_table(vertices: List[str], degrees: List[int], title: str):
    """Print degree table for undirected graph"""
    print(f"\n{title}:")
    print("-" * 30)
    print(f"{'Vertex':<10} {'Degree':<10}")
    print("-" * 30)
    for i, v in enumerate(vertices):
        print(f"{v:<10} {degrees[i]:<10}")
    print("-" * 30)
    print(f"{'Total':<10} {sum(degrees):<10}")


def print_directed_degree_table(vertices: List[str], in_deg: List[int], out_deg: List[int], total_deg: List[int]):
    """Print degree table for directed graph"""
    print("\nVertex Degrees (Directed Graph):")
    print("-" * 50)
    print(f"{'Vertex':<10} {'In-Degree':<12} {'Out-Degree':<12} {'Total':<10}")
    print("-" * 50)
    for i, v in enumerate(vertices):
        print(f"{v:<10} {in_deg[i]:<12} {out_deg[i]:<12} {total_deg[i]:<10}")
    print("-" * 50)
    print(f"{'Sum':<10} {sum(in_deg):<12} {sum(out_deg):<12} {sum(total_deg):<10}")


def main():
    """Main function with examples"""
    
    print("Vertex Degree Calculator")
    print("=" * 60)
    
    # Example 1: Undirected graph
    print("\nExample 1: Undirected Graph")
    print("-" * 40)
    
    # Graph structure:
    #     A---B
    #     |\ /|
    #     | X |
    #     |/ \|
    #     D---C
    
    adj_matrix1 = [
        [0, 1, 1, 1],  # A connected to B, C, D
        [1, 0, 1, 1],  # B connected to A, C, D
        [1, 1, 0, 1],  # C connected to A, B, D
        [1, 1, 1, 0],  # D connected to A, B, C
    ]
    
    vertices1 = ['A', 'B', 'C', 'D']
    print_matrix(adj_matrix1, vertices1)
    
    calc1 = VertexDegreeCalculator(adj_matrix1)
    
    if calc1.is_undirected():
        print("\nGraph type: Undirected")
        degrees = calc1.calculate_degree_undirected()
        print_degree_table(vertices1, degrees, "Vertex Degrees")
        
        # Special vertices
        special = calc1.find_special_vertices(degrees)
        print(f"\nAverage degree: {special['avg_degree']:.2f}")
        print(f"Maximum degree: {special['max_degree']}")
        print(f"Minimum degree: {special['min_degree']}")
        
        # Handshaking theorem
        print(f"\nHandshaking Theorem Verification:")
        print(f"Sum of degrees = {sum(degrees)}")
        print(f"2 × Number of edges = {sum(degrees)}")
        print(f"Number of edges = {sum(degrees) // 2}")
    
    # Example 2: Directed graph
    print("\n" + "=" * 60)
    print("\nExample 2: Directed Graph")
    print("-" * 40)
    
    # Graph structure:
    #     0 → 1
    #     ↓ ↗ ↓
    #     2 ← 3
    
    adj_matrix2 = [
        [0, 1, 1, 0],  # 0 → 1, 2
        [0, 0, 0, 1],  # 1 → 3
        [0, 1, 0, 0],  # 2 → 1
        [0, 0, 1, 0],  # 3 → 2
    ]
    
    vertices2 = ['0', '1', '2', '3']
    print_matrix(adj_matrix2, vertices2)
    
    calc2 = VertexDegreeCalculator(adj_matrix2)
    
    if not calc2.is_undirected():
        print("\nGraph type: Directed")
        in_deg, out_deg, total_deg = calc2.calculate_degrees_directed()
        print_directed_degree_table(vertices2, in_deg, out_deg, total_deg)
        
        print("\nDegree Analysis:")
        print(f"Sum of in-degrees = {sum(in_deg)}")
        print(f"Sum of out-degrees = {sum(out_deg)}")
        print(f"Total number of edges = {sum(out_deg)}")
        
        # Find sources and sinks
        sources = [vertices2[i] for i in range(len(in_deg)) if in_deg[i] == 0]
        sinks = [vertices2[i] for i in range(len(out_deg)) if out_deg[i] == 0]
        
        if sources:
            print(f"\nSource vertices (in-degree = 0): {', '.join(sources)}")
        if sinks:
            print(f"Sink vertices (out-degree = 0): {', '.join(sinks)}")
    
    # Example 3: Graph with isolated and pendant vertices
    print("\n" + "=" * 60)
    print("\nExample 3: Graph with Special Vertices")
    print("-" * 40)
    
    # Graph structure:
    #     A---B---C
    #         |
    #         D
    #     
    #     E (isolated)
    
    adj_matrix3 = [
        [0, 1, 0, 0, 0],  # A - B
        [1, 0, 1, 1, 0],  # B - A, C, D
        [0, 1, 0, 0, 0],  # C - B
        [0, 1, 0, 0, 0],  # D - B
        [0, 0, 0, 0, 0],  # E (isolated)
    ]
    
    vertices3 = ['A', 'B', 'C', 'D', 'E']
    print_matrix(adj_matrix3, vertices3)
    
    calc3 = VertexDegreeCalculator(adj_matrix3)
    
    if calc3.is_undirected():
        print("\nGraph type: Undirected")
        degrees = calc3.calculate_degree_undirected()
        print_degree_table(vertices3, degrees, "Vertex Degrees")
        
        # Special vertices
        special = calc3.find_special_vertices(degrees)
        
        if special['isolated']:
            isolated_names = [vertices3[i] for i in special['isolated']]
            print(f"\nIsolated vertices (degree = 0): {', '.join(isolated_names)}")
        
        if special['pendant']:
            pendant_names = [vertices3[i] for i in special['pendant']]
            print(f"Pendant vertices (degree = 1): {', '.join(pendant_names)}")
    
    # Example 4: Regular graph
    print("\n" + "=" * 60)
    print("\nExample 4: Regular Graph (Cycle)")
    print("-" * 40)
    
    # Graph structure: 5-cycle
    #       A
    #      / \
    #     E   B
    #     |   |
    #     D---C
    
    adj_matrix4 = [
        [0, 1, 0, 0, 1],  # A - B, E
        [1, 0, 1, 0, 0],  # B - A, C
        [0, 1, 0, 1, 0],  # C - B, D
        [0, 0, 1, 0, 1],  # D - C, E
        [1, 0, 0, 1, 0],  # E - A, D
    ]
    
    vertices4 = ['A', 'B', 'C', 'D', 'E']
    print_matrix(adj_matrix4, vertices4)
    
    calc4 = VertexDegreeCalculator(adj_matrix4)
    
    if calc4.is_undirected():
        print("\nGraph type: Undirected")
        degrees = calc4.calculate_degree_undirected()
        print_degree_table(vertices4, degrees, "Vertex Degrees")
        
        # Check if regular
        if len(set(degrees)) == 1:
            print(f"\nThis is a {degrees[0]}-regular graph")
            print("(All vertices have the same degree)")
    
    # Interactive mode
    print("\n" + "=" * 60)
    print("\nInteractive Mode")
    print("-" * 40)
    
    choice = input("\nDo you want to enter your own graph? (y/n): ").lower()
    if choice == 'y':
        n = int(input("Enter number of vertices: "))
        
        print("\nEnter adjacency matrix:")
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
        
        print_matrix(adj_matrix, vertices)
        
        calc = VertexDegreeCalculator(adj_matrix)
        
        if calc.is_undirected():
            print("\nGraph type: Undirected")
            degrees = calc.calculate_degree_undirected()
            print_degree_table(vertices, degrees, "Vertex Degrees")
            
            # Special vertices
            special = calc.find_special_vertices(degrees)
            print(f"\nStatistics:")
            print(f"  Average degree: {special['avg_degree']:.2f}")
            print(f"  Maximum degree: {special['max_degree']}")
            print(f"  Minimum degree: {special['min_degree']}")
            print(f"  Number of edges: {sum(degrees) // 2}")
            
            if special['isolated']:
                isolated_names = [vertices[i] for i in special['isolated']]
                print(f"  Isolated vertices: {', '.join(isolated_names)}")
            
            if special['pendant']:
                pendant_names = [vertices[i] for i in special['pendant']]
                print(f"  Pendant vertices: {', '.join(pendant_names)}")
        else:
            print("\nGraph type: Directed")
            in_deg, out_deg, total_deg = calc.calculate_degrees_directed()
            print_directed_degree_table(vertices, in_deg, out_deg, total_deg)
            
            print(f"\nTotal number of edges: {sum(out_deg)}")
            
            # Find sources and sinks
            sources = [vertices[i] for i in range(len(in_deg)) if in_deg[i] == 0]
            sinks = [vertices[i] for i in range(len(out_deg)) if out_deg[i] == 0]
            
            if sources:
                print(f"Source vertices: {', '.join(sources)}")
            if sinks:
                print(f"Sink vertices: {', '.join(sinks)}")


if __name__ == "__main__":
    main()
