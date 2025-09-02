#!/usr/bin/env python3
"""Draw graph from adjacency matrix"""

from typing import List
import matplotlib.pyplot as plt
import networkx as nx
import numpy as np


class GraphVisualizer:
    """Class to visualize graph from adjacency matrix"""
    
    def __init__(self, adj_matrix: List[List[int]]):
        """Initialize with adjacency matrix"""
        self.adj_matrix = adj_matrix
        self.n = len(adj_matrix)
        self.is_directed = self._check_directed()
    
    def _check_directed(self) -> bool:
        """Check if graph is directed (non-symmetric matrix)"""
        for i in range(self.n):
            for j in range(self.n):
                if self.adj_matrix[i][j] != self.adj_matrix[j][i]:
                    return True
        return False
    
    def create_graph(self) -> nx.Graph:
        """Create NetworkX graph from adjacency matrix"""
        if self.is_directed:
            G = nx.DiGraph()
        else:
            G = nx.Graph()
        
        # Add nodes
        for i in range(self.n):
            G.add_node(i)
        
        # Add edges
        for i in range(self.n):
            for j in range(self.n):
                if self.adj_matrix[i][j] > 0:
                    # For undirected graphs, avoid adding edge twice
                    if self.is_directed or i <= j:
                        G.add_edge(i, j, weight=self.adj_matrix[i][j])
        
        return G
    
    def draw_graph(self, node_labels: List[str] = None, title: str = "Graph Visualization", 
                   save_path: str = None, layout: str = "spring"):
        """Draw the graph"""
        G = self.create_graph()
        
        # Create figure
        plt.figure(figsize=(10, 8))
        
        # Choose layout
        if layout == "spring":
            pos = nx.spring_layout(G, k=2, iterations=50)
        elif layout == "circular":
            pos = nx.circular_layout(G)
        elif layout == "shell":
            pos = nx.shell_layout(G)
        elif layout == "kamada":
            pos = nx.kamada_kawai_layout(G)
        else:
            pos = nx.spring_layout(G)
        
        # Node labels
        if node_labels is None:
            node_labels = {i: str(i) for i in range(self.n)}
        else:
            node_labels = {i: node_labels[i] for i in range(self.n)}
        
        # Draw nodes
        nx.draw_networkx_nodes(G, pos, node_color='lightblue', 
                              node_size=1000, alpha=0.9)
        
        # Draw edges
        if self.is_directed:
            nx.draw_networkx_edges(G, pos, edge_color='gray', 
                                  arrows=True, arrowsize=20, 
                                  arrowstyle='->', width=2)
        else:
            nx.draw_networkx_edges(G, pos, edge_color='gray', width=2)
        
        # Draw labels
        nx.draw_networkx_labels(G, pos, node_labels, font_size=14, 
                               font_weight='bold')
        
        # Add title
        plt.title(title, fontsize=16, fontweight='bold')
        plt.axis('off')
        plt.tight_layout()
        
        # Save if path provided
        if save_path:
            plt.savefig(save_path, dpi=150, bbox_inches='tight')
            print(f"Graph saved to {save_path}")
        
        plt.show()
        
        return G
    
    def get_graph_info(self) -> dict:
        """Get information about the graph"""
        G = self.create_graph()
        
        info = {
            'nodes': G.number_of_nodes(),
            'edges': G.number_of_edges(),
            'is_directed': self.is_directed,
            'density': nx.density(G),
        }
        
        if not self.is_directed:
            info['is_connected'] = nx.is_connected(G)
            if info['is_connected']:
                info['diameter'] = nx.diameter(G)
                info['radius'] = nx.radius(G)
        else:
            info['is_strongly_connected'] = nx.is_strongly_connected(G)
            info['is_weakly_connected'] = nx.is_weakly_connected(G)
        
        return info


def print_matrix(matrix: List[List[int]], vertices: List[str] = None):
    """Print adjacency matrix"""
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
    
    print("Graph Visualizer")
    print("=" * 50)
    
    # Example 1: Simple undirected graph
    print("\nExample 1: Simple Undirected Graph")
    print("-" * 40)
    
    # Triangle graph
    adj_matrix1 = [
        [0, 1, 1],
        [1, 0, 1],
        [1, 1, 0],
    ]
    
    vertices1 = ['A', 'B', 'C']
    print_matrix(adj_matrix1, vertices1)
    
    viz1 = GraphVisualizer(adj_matrix1)
    info1 = viz1.get_graph_info()
    
    print("\nGraph Information:")
    print(f"  Type: {'Directed' if info1['is_directed'] else 'Undirected'}")
    print(f"  Nodes: {info1['nodes']}")
    print(f"  Edges: {info1['edges']}")
    print(f"  Density: {info1['density']:.2f}")
    if 'is_connected' in info1:
        print(f"  Connected: {info1['is_connected']}")
    
    print("\nDrawing graph...")
    viz1.draw_graph(vertices1, "Triangle Graph", "triangle_graph.png")
    
    # Example 2: Directed graph
    print("\n" + "=" * 50)
    print("\nExample 2: Directed Graph")
    print("-" * 40)
    
    # Directed cycle
    adj_matrix2 = [
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
        [1, 0, 0, 0],
    ]
    
    vertices2 = ['0', '1', '2', '3']
    print_matrix(adj_matrix2, vertices2)
    
    viz2 = GraphVisualizer(adj_matrix2)
    info2 = viz2.get_graph_info()
    
    print("\nGraph Information:")
    print(f"  Type: {'Directed' if info2['is_directed'] else 'Undirected'}")
    print(f"  Nodes: {info2['nodes']}")
    print(f"  Edges: {info2['edges']}")
    print(f"  Strongly connected: {info2.get('is_strongly_connected', 'N/A')}")
    print(f"  Weakly connected: {info2.get('is_weakly_connected', 'N/A')}")
    
    print("\nDrawing graph...")
    viz2.draw_graph(vertices2, "Directed Cycle", "directed_cycle.png", layout="circular")
    
    # Example 3: Complete graph
    print("\n" + "=" * 50)
    print("\nExample 3: Complete Graph K5")
    print("-" * 40)
    
    # Complete graph with 5 vertices
    n = 5
    adj_matrix3 = [[1 if i != j else 0 for j in range(n)] for i in range(n)]
    
    vertices3 = [chr(65 + i) for i in range(n)]  # A, B, C, D, E
    print_matrix(adj_matrix3, vertices3)
    
    viz3 = GraphVisualizer(adj_matrix3)
    info3 = viz3.get_graph_info()
    
    print("\nGraph Information:")
    print(f"  Type: {'Directed' if info3['is_directed'] else 'Undirected'}")
    print(f"  Nodes: {info3['nodes']}")
    print(f"  Edges: {info3['edges']}")
    print(f"  Density: {info3['density']:.2f}")
    
    print("\nDrawing graph...")
    viz3.draw_graph(vertices3, "Complete Graph K5", "complete_k5.png", layout="circular")
    
    # Interactive mode
    print("\n" + "=" * 50)
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
        
        # Layout choice
        print("\nAvailable layouts:")
        print("1. Spring (default)")
        print("2. Circular")
        print("3. Shell")
        print("4. Kamada-Kawai")
        
        layout_choice = input("Choose layout (1-4, default=1): ").strip()
        layouts = {"1": "spring", "2": "circular", "3": "shell", "4": "kamada"}
        layout = layouts.get(layout_choice, "spring")
        
        # Title
        title = input("Enter graph title (default='Custom Graph'): ").strip()
        if not title:
            title = "Custom Graph"
        
        # Save option
        save_choice = input("Save graph image? (y/n): ").lower()
        save_path = None
        if save_choice == 'y':
            save_path = input("Enter filename (e.g., 'my_graph.png'): ").strip()
            if not save_path.endswith('.png'):
                save_path += '.png'
        
        viz = GraphVisualizer(adj_matrix)
        info = viz.get_graph_info()
        
        print("\nGraph Information:")
        print(f"  Type: {'Directed' if info['is_directed'] else 'Undirected'}")
        print(f"  Nodes: {info['nodes']}")
        print(f"  Edges: {info['edges']}")
        print(f"  Density: {info['density']:.2f}")
        
        print(f"\nDrawing graph with {layout} layout...")
        viz.draw_graph(vertices, title, save_path, layout)


if __name__ == "__main__":
    try:
        main()
    except ImportError:
        print("\nError: Required libraries not installed!")
        print("Please install the required libraries:")
        print("  pip install matplotlib networkx numpy")
        print("\nOr run:")
        print("  pip install -r requirements.txt")
