#!/usr/bin/env python3
"""Simple Dijkstra's Algorithm Implementation"""

import heapq
from typing import Dict, List, Tuple, Optional


class Graph:
    """Simple graph class for Dijkstra's algorithm"""
    
    def __init__(self):
        # Dictionary to store graph: {node: [(neighbor, weight), ...]}
        self.graph = {}
    
    def add_edge(self, source: str, destination: str, weight: int):
        """Add a weighted edge to the graph"""
        if source not in self.graph:
            self.graph[source] = []
        if destination not in self.graph:
            self.graph[destination] = []
        
        # Add edge (directed graph)
        self.graph[source].append((destination, weight))
    
    def get_neighbors(self, node: str) -> List[Tuple[str, int]]:
        """Get all neighbors of a node with their weights"""
        return self.graph.get(node, [])
    
    def get_nodes(self) -> List[str]:
        """Get all nodes in the graph"""
        return list(self.graph.keys())


def dijkstra(graph: Graph, start: str) -> Tuple[Dict[str, float], Dict[str, Optional[str]]]:
    """Find shortest paths from start node using Dijkstra's algorithm"""
    
    # Initialize distances with infinity for all nodes except start
    distances = {node: float('infinity') for node in graph.get_nodes()}
    distances[start] = 0
    
    # Dictionary to track the previous node in shortest path
    previous = {node: None for node in graph.get_nodes()}
    
    # Priority queue: (distance, node)
    pq = [(0, start)]
    
    # Set to track visited nodes
    visited = set()
    
    while pq:
        # Get node with minimum distance
        current_distance, current_node = heapq.heappop(pq)
        
        # Skip if already visited
        if current_node in visited:
            continue
        
        # Mark as visited
        visited.add(current_node)
        
        # Check all neighbors
        for neighbor, weight in graph.get_neighbors(current_node):
            # Calculate new distance through current node
            distance = current_distance + weight
            
            # If shorter path found, update it
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                previous[neighbor] = current_node
                heapq.heappush(pq, (distance, neighbor))
    
    return distances, previous


def get_shortest_path(previous: Dict[str, Optional[str]], start: str, end: str) -> List[str]:
    """Reconstruct the shortest path from start to end"""
    path = []
    current = end
    
    # Backtrack from end to start
    while current is not None:
        path.append(current)
        current = previous[current]
    
    # Reverse to get path from start to end
    path.reverse()
    
    # Check if path exists
    if path[0] != start:
        return []  # No path exists
    
    return path


def main():
    """Main function with example usage"""
    
    # Create a sample graph
    print("Sample Graph Structure:")
    print("""
         B---4---D
        /|      /|\\
       2 |     / | 1
      /  3    /  |  \\
     A   |   7   5   F
      \\  |  /    |  /
       1 | /     | 3
        \\|/      |/
         C---2---E
    """)
    
    g = Graph()
    
    # Add edges (source, destination, weight)
    g.add_edge('A', 'B', 2)
    g.add_edge('A', 'C', 1)
    g.add_edge('B', 'C', 3)
    g.add_edge('B', 'D', 4)
    g.add_edge('C', 'D', 7)
    g.add_edge('C', 'E', 2)
    g.add_edge('D', 'E', 5)
    g.add_edge('D', 'F', 1)
    g.add_edge('E', 'F', 3)
    
    # Run Dijkstra's algorithm
    start_node = 'A'
    distances, previous = dijkstra(g, start_node)
    
    # Print results
    print(f"\nShortest distances from '{start_node}':")
    for node, distance in sorted(distances.items()):
        if distance == float('infinity'):
            print(f"  {node}: No path")
        else:
            path = get_shortest_path(previous, start_node, node)
            print(f"  {node}: Distance = {distance}, Path: {' -> '.join(path)}")


if __name__ == "__main__":
    main()