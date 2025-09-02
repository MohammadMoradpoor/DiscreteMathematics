#!/usr/bin/env python3
"""Check if G1 is a subgraph of G2 using adjacency matrices"""

from typing import List, Tuple, Optional
from itertools import permutations


class SubgraphChecker:
    """Class to check if one graph is a subgraph of another"""
    
    def __init__(self, adj_matrix_g1: List[List[int]], adj_matrix_g2: List[List[int]]):
        """Initialize with adjacency matrices of G1 and G2"""
        self.g1 = adj_matrix_g1
        self.g2 = adj_matrix_g2
        self.n1 = len(adj_matrix_g1)
        self.n2 = len(adj_matrix_g2)
    
    def is_subgraph_with_mapping(self, mapping: List[int]) -> bool:
        """Check if G1 is subgraph of G2 with given vertex mapping"""
        # Check if all edges in G1 exist in G2 under this mapping
        for i in range(self.n1):
            for j in range(self.n1):
                if self.g1[i][j] > 0:
                    # Edge exists in G1, check if it exists in G2
                    v1_in_g2 = mapping[i]
                    v2_in_g2 = mapping[j]
                    if self.g2[v1_in_g2][v2_in_g2] == 0:
                        return False
        return True
    
    def is_induced_subgraph_with_mapping(self, mapping: List[int]) -> bool:
        """Check if G1 is induced subgraph of G2 with given vertex mapping"""
        # Check if edges match exactly for mapped vertices
        for i in range(self.n1):
            for j in range(self.n1):
                v1_in_g2 = mapping[i]
                v2_in_g2 = mapping[j]
                # Edges must match exactly
                if (self.g1[i][j] > 0) != (self.g2[v1_in_g2][v2_in_g2] > 0):
                    return False
        return True
    
    def find_subgraph(self) -> Tuple[bool, Optional[List[int]], str]:
        """Find if G1 is a subgraph of G2"""
        # Basic check: G1 cannot be subgraph if it has more vertices
        if self.n1 > self.n2:
            return False, None, "G1 has more vertices than G2"
        
        # Check edge count
        edges_g1 = sum(self.g1[i][j] for i in range(self.n1) for j in range(self.n1))
        edges_g2 = sum(self.g2[i][j] for i in range(self.n2) for j in range(self.n2))
        
        if edges_g1 > edges_g2:
            return False, None, "G1 has more edges than G2"
        
        # Try all possible vertex mappings
        vertices_g2 = list(range(self.n2))
        
        # Generate all possible ways to select n1 vertices from n2 vertices
        from itertools import combinations
        
        for selected_vertices in combinations(vertices_g2, self.n1):
            # Try all permutations of selected vertices
            for perm in permutations(selected_vertices):
                mapping = list(perm)
                if self.is_subgraph_with_mapping(mapping):
                    return True, mapping, "G1 is a subgraph of G2"
        
        return False, None, "G1 is not a subgraph of G2"
    
    def find_induced_subgraph(self) -> Tuple[bool, Optional[List[int]]]:
        """Find if G1 is an induced subgraph of G2"""
        if self.n1 > self.n2:
            return False, None
        
        # Try all possible vertex mappings
        vertices_g2 = list(range(self.n2))
        
        from itertools import combinations
        
        for selected_vertices in combinations(vertices_g2, self.n1):
            for perm in permutations(selected_vertices):
                mapping = list(perm)
                if self.is_induced_subgraph_with_mapping(mapping):
                    return True, mapping
        
        return False, None
    
    def count_edges(self, adj_matrix: List[List[int]]) -> int:
        """Count number of edges in the graph"""
        edges = 0
        n = len(adj_matrix)
        for i in range(n):
            for j in range(n):
                if adj_matrix[i][j] > 0:
                    edges += 1
        return edges


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


def visualize_mapping(mapping: List[int], n1: int) -> str:
    """Create a visual representation of vertex mapping"""
    result = "Vertex mapping (G1 → G2):\n"
    for i in range(n1):
        result += f"  {i} → {mapping[i]}\n"
    return result


def main():
    """Main function with examples"""
    
    print("Subgraph Checker")
    print("=" * 50)
    
    # Example 1: G1 is a subgraph of G2
    print("\nExample 1: G1 is a subgraph of G2")
    print("-" * 40)
    
    # G1: Triangle (3 vertices)
    #     0---1
    #      \ /
    #       2
    
    g1_matrix1 = [
        [0, 1, 1],  # 0 connected to 1, 2
        [1, 0, 1],  # 1 connected to 0, 2
        [1, 1, 0],  # 2 connected to 0, 1
    ]
    
    # G2: Square with diagonal (4 vertices)
    #     0---1
    #     |\ /|
    #     | X |
    #     |/ \|
    #     3---2
    
    g2_matrix1 = [
        [0, 1, 1, 1],  # 0 connected to 1, 2, 3
        [1, 0, 1, 1],  # 1 connected to 0, 2, 3
        [1, 1, 0, 1],  # 2 connected to 0, 1, 3
        [1, 1, 1, 0],  # 3 connected to 0, 1, 2
    ]
    
    print_matrix(g1_matrix1, "G1 (Triangle)")
    print_matrix(g2_matrix1, "G2 (Complete graph K4)")
    
    checker1 = SubgraphChecker(g1_matrix1, g2_matrix1)
    is_subgraph, mapping, message = checker1.find_subgraph()
    
    print(f"\nResult: {message}")
    if is_subgraph and mapping:
        print(visualize_mapping(mapping, checker1.n1))
    
    print(f"G1 edges: {checker1.count_edges(g1_matrix1)}")
    print(f"G2 edges: {checker1.count_edges(g2_matrix1)}")
    
    # Example 2: G1 is NOT a subgraph of G2
    print("\n" + "=" * 50)
    print("\nExample 2: G1 is NOT a subgraph of G2")
    print("-" * 40)
    
    # G1: Square (4 vertices)
    #     0---1
    #     |   |
    #     3---2
    
    g1_matrix2 = [
        [0, 1, 0, 1],  # 0 connected to 1, 3
        [1, 0, 1, 0],  # 1 connected to 0, 2
        [0, 1, 0, 1],  # 2 connected to 1, 3
        [1, 0, 1, 0],  # 3 connected to 0, 2
    ]
    
    # G2: Triangle (3 vertices)
    #     0---1
    #      \ /
    #       2
    
    g2_matrix2 = [
        [0, 1, 1],  # 0 connected to 1, 2
        [1, 0, 1],  # 1 connected to 0, 2
        [1, 1, 0],  # 2 connected to 0, 1
    ]
    
    print_matrix(g1_matrix2, "G1 (Square)")
    print_matrix(g2_matrix2, "G2 (Triangle)")
    
    checker2 = SubgraphChecker(g1_matrix2, g2_matrix2)
    is_subgraph, mapping, message = checker2.find_subgraph()
    
    print(f"\nResult: {message}")
    if is_subgraph and mapping:
        print(visualize_mapping(mapping, checker2.n1))
    
    print(f"G1 vertices: {checker2.n1}, G2 vertices: {checker2.n2}")
    
    # Example 3: G1 is a subgraph but not induced subgraph
    print("\n" + "=" * 50)
    print("\nExample 3: Subgraph vs Induced Subgraph")
    print("-" * 40)
    
    # G1: Path with 3 vertices
    #     0---1---2
    
    g1_matrix3 = [
        [0, 1, 0],  # 0 connected to 1
        [1, 0, 1],  # 1 connected to 0, 2
        [0, 1, 0],  # 2 connected to 1
    ]
    
    # G2: Triangle
    #     0---1
    #      \ /
    #       2
    
    g2_matrix3 = [
        [0, 1, 1],  # 0 connected to 1, 2
        [1, 0, 1],  # 1 connected to 0, 2
        [1, 1, 0],  # 2 connected to 0, 1
    ]
    
    print_matrix(g1_matrix3, "G1 (Path)")
    print_matrix(g2_matrix3, "G2 (Triangle)")
    
    checker3 = SubgraphChecker(g1_matrix3, g2_matrix3)
    is_subgraph, mapping, message = checker3.find_subgraph()
    is_induced, induced_mapping = checker3.find_induced_subgraph()
    
    print(f"\nIs G1 a subgraph of G2? {message}")
    if is_subgraph and mapping:
        print(visualize_mapping(mapping, checker3.n1))
    
    print(f"Is G1 an induced subgraph of G2? {'Yes' if is_induced else 'No'}")
    
    # Interactive mode
    print("\n" + "=" * 50)
    print("\nInteractive Mode")
    print("-" * 40)
    
    choice = input("\nDo you want to enter your own graphs? (y/n): ").lower()
    if choice == 'y':
        # Get G1
        n1 = int(input("\nEnter number of vertices in G1: "))
        print("Enter adjacency matrix for G1:")
        g1_matrix = []
        for i in range(n1):
            row = list(map(int, input(f"Row {i}: ").split()))
            if len(row) != n1:
                print(f"Error: Row must have {n1} elements")
                return
            g1_matrix.append(row)
        
        # Get G2
        n2 = int(input("\nEnter number of vertices in G2: "))
        print("Enter adjacency matrix for G2:")
        g2_matrix = []
        for i in range(n2):
            row = list(map(int, input(f"Row {i}: ").split()))
            if len(row) != n2:
                print(f"Error: Row must have {n2} elements")
                return
            g2_matrix.append(row)
        
        print_matrix(g1_matrix, "G1")
        print_matrix(g2_matrix, "G2")
        
        checker = SubgraphChecker(g1_matrix, g2_matrix)
        is_subgraph, mapping, message = checker.find_subgraph()
        
        print(f"\nResult: {message}")
        if is_subgraph and mapping:
            print(visualize_mapping(mapping, checker.n1))
        
        # Check induced subgraph
        is_induced, induced_mapping = checker.find_induced_subgraph()
        print(f"\nIs G1 an induced subgraph of G2? {'Yes' if is_induced else 'No'}")
        if is_induced and induced_mapping:
            print("Induced subgraph mapping:")
            print(visualize_mapping(induced_mapping, checker.n1))


if __name__ == "__main__":
    main()
