#!/usr/bin/env python3
"""Find Eulerian path in a graph from adjacency matrix"""

from typing import List, Optional, Tuple
import copy


class EulerianPathFinder:
    """Class to find Eulerian path from adjacency matrix"""
    
    def __init__(self, adj_matrix: List[List[int]]):
        """Initialize with adjacency matrix"""
        self.adj_matrix = adj_matrix
        self.n = len(adj_matrix)
        self.path = []
    
    def calculate_degrees(self) -> Tuple[List[int], List[int]]:
        """Calculate in-degree and out-degree for each vertex"""
        in_degree = [0] * self.n
        out_degree = [0] * self.n
        
        for i in range(self.n):
            for j in range(self.n):
                if self.adj_matrix[i][j] > 0:
                    out_degree[i] += self.adj_matrix[i][j]
                    in_degree[j] += self.adj_matrix[i][j]
        
        return in_degree, out_degree
    
    def has_eulerian_path(self) -> Tuple[bool, Optional[int]]:
        """Check if graph has Eulerian path and return starting vertex"""
        in_degree, out_degree = self.calculate_degrees()
        
        # Count vertices with unequal in/out degrees
        start_vertices = []  # out_degree > in_degree
        end_vertices = []    # in_degree > out_degree
        
        for i in range(self.n):
            if out_degree[i] - in_degree[i] == 1:
                start_vertices.append(i)
            elif in_degree[i] - out_degree[i] == 1:
                end_vertices.append(i)
            elif in_degree[i] != out_degree[i]:
                # Difference is not 0, 1, or -1
                return False, None
        
        # Check Eulerian path conditions
        if len(start_vertices) == 0 and len(end_vertices) == 0:
            # Eulerian circuit exists (all degrees equal)
            # Start from any vertex with edges
            for i in range(self.n):
                if out_degree[i] > 0:
                    return True, i
            return False, None
        elif len(start_vertices) == 1 and len(end_vertices) == 1:
            # Eulerian path exists
            return True, start_vertices[0]
        else:
            return False, None
    
    def find_eulerian_path(self) -> Optional[List[int]]:
        """Find Eulerian path using Hierholzer's algorithm"""
        has_path, start = self.has_eulerian_path()
        
        if not has_path:
            return None
        
        # Create a copy of adjacency matrix to modify
        adj_copy = copy.deepcopy(self.adj_matrix)
        
        # Stack for DFS
        stack = [start]
        path = []
        
        while stack:
            v = stack[-1]
            # Find an edge from v
            found_edge = False
            for u in range(self.n):
                if adj_copy[v][u] > 0:
                    stack.append(u)
                    adj_copy[v][u] -= 1  # Remove edge
                    found_edge = True
                    break
            
            if not found_edge:
                # No more edges from v, add to path
                path.append(stack.pop())
        
        # Reverse to get correct order
        path.reverse()
        return path
    
    def is_connected(self) -> bool:
        """Check if graph is connected (considering edge directions)"""
        # For directed graphs, check weak connectivity
        visited = [False] * self.n
        
        # Find first vertex with edges
        start = -1
        for i in range(self.n):
            for j in range(self.n):
                if self.adj_matrix[i][j] > 0:
                    start = i
                    break
            if start != -1:
                break
        
        if start == -1:
            return True  # Empty graph
        
        # DFS on undirected version
        stack = [start]
        visited[start] = True
        
        while stack:
            v = stack.pop()
            for u in range(self.n):
                # Check both directions for weak connectivity
                if (self.adj_matrix[v][u] > 0 or self.adj_matrix[u][v] > 0) and not visited[u]:
                    visited[u] = True
                    stack.append(u)
        
        # Check if all vertices with edges are visited
        for i in range(self.n):
            for j in range(self.n):
                if self.adj_matrix[i][j] > 0 and not (visited[i] and visited[j]):
                    return False
        
        return True


def print_matrix(matrix: List[List[int]], vertices: List[str]):
    """Print adjacency matrix in readable format"""
    n = len(matrix)
    
    # Print header
    print("Adjacency Matrix:")
    print("    ", end="")
    for v in vertices:
        print(f"{v:3}", end="")
    print()
    
    # Print rows
    for i in range(n):
        print(f"{vertices[i]:3} ", end="")
        for j in range(n):
            print(f"{matrix[i][j]:3}", end="")
        print()


def main():
    """Main function with examples"""
    
    # Example 1: Graph with Eulerian path
    print("Example 1: Graph with Eulerian Path")
    print("=" * 40)
    
    # Graph structure:
    #   0 → 1 → 2
    #   ↓   ↓   ↓
    #   3 → 4 → 5
    
    adj_matrix1 = [
        [0, 1, 0, 1, 0, 0],  # 0: edges to 1, 3
        [0, 0, 1, 0, 1, 0],  # 1: edges to 2, 4
        [0, 0, 0, 0, 0, 1],  # 2: edge to 5
        [0, 0, 0, 0, 1, 0],  # 3: edge to 4
        [0, 0, 0, 0, 0, 1],  # 4: edge to 5
        [0, 0, 0, 0, 0, 0],  # 5: no outgoing edges
    ]
    
    vertices = ['0', '1', '2', '3', '4', '5']
    print_matrix(adj_matrix1, vertices)
    
    finder1 = EulerianPathFinder(adj_matrix1)
    
    # Check connectivity
    if not finder1.is_connected():
        print("\nGraph is not connected!")
    
    # Check and find Eulerian path
    has_path, start = finder1.has_eulerian_path()
    if has_path:
        print(f"\n✓ Eulerian path exists! Starting from vertex {start}")
        path = finder1.find_eulerian_path()
        if path:
            print(f"Eulerian path: {' → '.join(str(v) for v in path)}")
    else:
        print("\n✗ No Eulerian path exists")
    
    # Calculate degrees
    in_deg, out_deg = finder1.calculate_degrees()
    print(f"\nVertex degrees:")
    for i in range(len(vertices)):
        print(f"  Vertex {i}: in-degree = {in_deg[i]}, out-degree = {out_deg[i]}")
    
    print("\n" + "=" * 40)
    
    # Example 2: Graph with Eulerian circuit
    print("\nExample 2: Graph with Eulerian Circuit")
    print("=" * 40)
    
    # Square graph with all vertices having equal in/out degrees
    adj_matrix2 = [
        [0, 1, 0, 1],  # 0 → 1, 3
        [0, 0, 1, 0],  # 1 → 2
        [0, 0, 0, 1],  # 2 → 3
        [1, 0, 0, 0],  # 3 → 0
    ]
    
    vertices2 = ['A', 'B', 'C', 'D']
    print_matrix(adj_matrix2, vertices2)
    
    finder2 = EulerianPathFinder(adj_matrix2)
    
    has_path, start = finder2.has_eulerian_path()
    if has_path:
        print(f"\n✓ Eulerian circuit exists! Starting from vertex {vertices2[start]}")
        path = finder2.find_eulerian_path()
        if path:
            print(f"Eulerian circuit: {' → '.join(vertices2[v] for v in path)}")
    else:
        print("\n✗ No Eulerian path exists")
    
    # Calculate degrees
    in_deg, out_deg = finder2.calculate_degrees()
    print(f"\nVertex degrees:")
    for i in range(len(vertices2)):
        print(f"  Vertex {vertices2[i]}: in-degree = {in_deg[i]}, out-degree = {out_deg[i]}")
    
    print("\n" + "=" * 40)
    
    # Example 3: Graph without Eulerian path
    print("\nExample 3: Graph without Eulerian Path")
    print("=" * 40)
    
    adj_matrix3 = [
        [0, 1, 1, 0],  # 0 → 1, 2
        [0, 0, 1, 0],  # 1 → 2
        [0, 0, 0, 1],  # 2 → 3
        [0, 0, 0, 0],  # 3: no outgoing edges
    ]
    
    print_matrix(adj_matrix3, vertices2)
    
    finder3 = EulerianPathFinder(adj_matrix3)
    
    has_path, start = finder3.has_eulerian_path()
    if has_path:
        print(f"\n✓ Eulerian path exists!")
        path = finder3.find_eulerian_path()
        if path:
            print(f"Eulerian path: {' → '.join(vertices2[v] for v in path)}")
    else:
        print("\n✗ No Eulerian path exists")
    
    # Calculate degrees
    in_deg, out_deg = finder3.calculate_degrees()
    print(f"\nVertex degrees:")
    for i in range(len(vertices2)):
        print(f"  Vertex {vertices2[i]}: in-degree = {in_deg[i]}, out-degree = {out_deg[i]}")
    print("Reason: More than one vertex has unequal in/out degrees")


if __name__ == "__main__":
    main()
