#!/usr/bin/env python3
"""Check if a graph is connected using adjacency matrix"""

from typing import List, Set, Tuple
from collections import deque


class ConnectivityChecker:
    """Class to check graph connectivity from adjacency matrix"""
    
    def __init__(self, adj_matrix: List[List[int]], is_directed: bool = False):
        """Initialize with adjacency matrix"""
        self.adj_matrix = adj_matrix
        self.n = len(adj_matrix)
        self.is_directed = is_directed
    
    def dfs(self, start: int, visited: Set[int]) -> Set[int]:
        """Depth-first search from starting vertex"""
        stack = [start]
        visited.add(start)
        
        while stack:
            v = stack.pop()
            for u in range(self.n):
                if self.adj_matrix[v][u] > 0 and u not in visited:
                    visited.add(u)
                    stack.append(u)
        
        return visited
    
    def bfs(self, start: int) -> Set[int]:
        """Breadth-first search from starting vertex"""
        visited = set()
        queue = deque([start])
        visited.add(start)
        
        while queue:
            v = queue.popleft()
            for u in range(self.n):
                if self.adj_matrix[v][u] > 0 and u not in visited:
                    visited.add(u)
                    queue.append(u)
        
        return visited
    
    def is_connected_undirected(self) -> bool:
        """Check if undirected graph is connected"""
        # Start from vertex 0
        visited = self.dfs(0, set())
        
        # Graph is connected if all vertices are visited
        return len(visited) == self.n
    
    def is_strongly_connected(self) -> bool:
        """Check if directed graph is strongly connected"""
        # Check if all vertices are reachable from vertex 0
        visited = self.dfs(0, set())
        if len(visited) != self.n:
            return False
        
        # Create transpose of the graph
        transpose = [[0] * self.n for _ in range(self.n)]
        for i in range(self.n):
            for j in range(self.n):
                transpose[j][i] = self.adj_matrix[i][j]
        
        # Check if all vertices are reachable from vertex 0 in transpose
        visited_transpose = set()
        stack = [0]
        visited_transpose.add(0)
        
        while stack:
            v = stack.pop()
            for u in range(self.n):
                if transpose[v][u] > 0 and u not in visited_transpose:
                    visited_transpose.add(u)
                    stack.append(u)
        
        return len(visited_transpose) == self.n
    
    def is_weakly_connected(self) -> bool:
        """Check if directed graph is weakly connected"""
        # Convert to undirected graph
        undirected = [[0] * self.n for _ in range(self.n)]
        for i in range(self.n):
            for j in range(self.n):
                if self.adj_matrix[i][j] > 0 or self.adj_matrix[j][i] > 0:
                    undirected[i][j] = 1
                    undirected[j][i] = 1
        
        # Check connectivity on undirected version
        visited = set()
        stack = [0]
        visited.add(0)
        
        while stack:
            v = stack.pop()
            for u in range(self.n):
                if undirected[v][u] > 0 and u not in visited:
                    visited.add(u)
                    stack.append(u)
        
        return len(visited) == self.n
    
    def find_connected_components(self) -> List[Set[int]]:
        """Find all connected components in the graph"""
        components = []
        visited = set()
        
        for v in range(self.n):
            if v not in visited:
                # Find component containing vertex v
                component = self.dfs(v, visited.copy())
                components.append(component)
                visited.update(component)
        
        return components
    
    def check_connectivity(self) -> Tuple[bool, str, List[Set[int]]]:
        """Check connectivity and return detailed results"""
        if self.is_directed:
            strongly_connected = self.is_strongly_connected()
            weakly_connected = self.is_weakly_connected()
            
            if strongly_connected:
                return True, "Strongly connected", [set(range(self.n))]
            elif weakly_connected:
                components = self.find_connected_components()
                return False, "Weakly connected", components
            else:
                components = self.find_connected_components()
                return False, "Not connected", components
        else:
            connected = self.is_connected_undirected()
            components = self.find_connected_components()
            
            if connected:
                return True, "Connected", components
            else:
                return False, "Not connected", components


def print_matrix(matrix: List[List[int]], vertices: List[str] = None):
    """Print adjacency matrix in readable format"""
    n = len(matrix)
    if vertices is None:
        vertices = [str(i) for i in range(n)]
    
    print("\nAdjacency Matrix:")
    print("    ", end="")
    for v in vertices:
        print(f"{v:3}", end="")
    print()
    
    for i in range(n):
        print(f"{vertices[i]:3} ", end="")
        for j in range(n):
            print(f"{matrix[i][j]:3}", end="")
        print()


def main():
    """Main function with examples"""
    
    print("Graph Connectivity Checker")
    print("=" * 50)
    
    # Example 1: Connected undirected graph
    print("\nExample 1: Connected Undirected Graph")
    print("-" * 40)
    
    # Graph structure:
    #     0---1
    #     |   |
    #     2---3
    
    adj_matrix1 = [
        [0, 1, 1, 0],  # 0 connected to 1, 2
        [1, 0, 0, 1],  # 1 connected to 0, 3
        [1, 0, 0, 1],  # 2 connected to 0, 3
        [0, 1, 1, 0],  # 3 connected to 1, 2
    ]
    
    print_matrix(adj_matrix1)
    
    checker1 = ConnectivityChecker(adj_matrix1, is_directed=False)
    connected, status, components = checker1.check_connectivity()
    
    print(f"\nGraph type: Undirected")
    print(f"Status: {status}")
    print(f"Is connected: {'Yes' if connected else 'No'}")
    print(f"Number of components: {len(components)}")
    for i, comp in enumerate(components):
        print(f"  Component {i+1}: {sorted(comp)}")
    
    # Example 2: Disconnected undirected graph
    print("\n" + "=" * 50)
    print("\nExample 2: Disconnected Undirected Graph")
    print("-" * 40)
    
    # Graph structure:
    #     0---1    4---5
    #     |        |
    #     2        6
    #     |
    #     3
    
    adj_matrix2 = [
        [0, 1, 1, 0, 0, 0, 0],  # 0 connected to 1, 2
        [1, 0, 0, 0, 0, 0, 0],  # 1 connected to 0
        [1, 0, 0, 1, 0, 0, 0],  # 2 connected to 0, 3
        [0, 0, 1, 0, 0, 0, 0],  # 3 connected to 2
        [0, 0, 0, 0, 0, 1, 1],  # 4 connected to 5, 6
        [0, 0, 0, 0, 1, 0, 0],  # 5 connected to 4
        [0, 0, 0, 0, 1, 0, 0],  # 6 connected to 4
    ]
    
    print_matrix(adj_matrix2)
    
    checker2 = ConnectivityChecker(adj_matrix2, is_directed=False)
    connected, status, components = checker2.check_connectivity()
    
    print(f"\nGraph type: Undirected")
    print(f"Status: {status}")
    print(f"Is connected: {'Yes' if connected else 'No'}")
    print(f"Number of components: {len(components)}")
    for i, comp in enumerate(components):
        print(f"  Component {i+1}: {sorted(comp)}")
    
    # Example 3: Strongly connected directed graph
    print("\n" + "=" * 50)
    print("\nExample 3: Strongly Connected Directed Graph")
    print("-" * 40)
    
    # Graph structure (cycle):
    #     0 → 1
    #     ↑   ↓
    #     3 ← 2
    
    adj_matrix3 = [
        [0, 1, 0, 0],  # 0 → 1
        [0, 0, 1, 0],  # 1 → 2
        [0, 0, 0, 1],  # 2 → 3
        [1, 0, 0, 0],  # 3 → 0
    ]
    
    print_matrix(adj_matrix3)
    
    checker3 = ConnectivityChecker(adj_matrix3, is_directed=True)
    connected, status, components = checker3.check_connectivity()
    
    print(f"\nGraph type: Directed")
    print(f"Status: {status}")
    print(f"Is strongly connected: {'Yes' if connected else 'No'}")
    print(f"Number of strongly connected components: {len(components)}")
    for i, comp in enumerate(components):
        print(f"  Component {i+1}: {sorted(comp)}")
    
    # Example 4: Weakly connected directed graph
    print("\n" + "=" * 50)
    print("\nExample 4: Weakly Connected Directed Graph")
    print("-" * 40)
    
    # Graph structure:
    #     0 → 1 → 2
    #         ↓
    #         3
    
    adj_matrix4 = [
        [0, 1, 0, 0],  # 0 → 1
        [0, 0, 1, 1],  # 1 → 2, 3
        [0, 0, 0, 0],  # 2 (no outgoing)
        [0, 0, 0, 0],  # 3 (no outgoing)
    ]
    
    print_matrix(adj_matrix4)
    
    checker4 = ConnectivityChecker(adj_matrix4, is_directed=True)
    connected, status, components = checker4.check_connectivity()
    
    print(f"\nGraph type: Directed")
    print(f"Status: {status}")
    print(f"Is strongly connected: {'Yes' if 'Strongly' in status else 'No'}")
    print(f"Is weakly connected: {'Yes' if 'Weakly' in status or 'Strongly' in status else 'No'}")
    
    # Interactive mode
    print("\n" + "=" * 50)
    print("\nInteractive Mode")
    print("-" * 40)
    
    choice = input("\nDo you want to enter your own graph? (y/n): ").lower()
    if choice == 'y':
        n = int(input("Enter number of vertices: "))
        
        graph_type = input("Is the graph directed? (y/n): ").lower()
        is_directed = graph_type == 'y'
        
        print("\nEnter adjacency matrix (0 or 1 for each edge):")
        print("Format: Enter each row separated by spaces")
        adj_matrix = []
        for i in range(n):
            row = list(map(int, input(f"Row {i}: ").split()))
            if len(row) != n:
                print(f"Error: Row must have {n} elements")
                return
            adj_matrix.append(row)
        
        print_matrix(adj_matrix)
        
        checker = ConnectivityChecker(adj_matrix, is_directed)
        connected, status, components = checker.check_connectivity()
        
        print(f"\nGraph type: {'Directed' if is_directed else 'Undirected'}")
        print(f"Status: {status}")
        
        if is_directed:
            print(f"Is strongly connected: {'Yes' if 'Strongly' in status else 'No'}")
            print(f"Is weakly connected: {'Yes' if 'Weakly' in status or 'Strongly' in status else 'No'}")
        else:
            print(f"Is connected: {'Yes' if connected else 'No'}")
        
        print(f"Number of components: {len(components)}")
        for i, comp in enumerate(components):
            print(f"  Component {i+1}: {sorted(comp)}")


if __name__ == "__main__":
    main()
