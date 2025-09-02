import os
import networkx as nx
import matplotlib.pyplot as plt

def get_matrix_dimensions():
    """Get matrix dimensions from user input"""
    while True:
        try:
            rows = int(input("Enter number of rows (1-10): "))
            cols = int(input("Enter number of columns (1-10): "))
            
            if 1 <= rows <= 10 and 1 <= cols <= 10:
                return rows, cols
            else:
                print("Error: Dimensions must be between 1 and 10.")
        except ValueError:
            print("Error: Please enter valid integers.")

def get_matrix_values(rows, cols):
    """Get boolean matrix values from user input"""
    matrix = []
    
    print("\nEnter the adjacency matrix (1 where there is an edge, 0 otherwise):")
    print("Enter values row by row. You can separate values with spaces or enter them consecutively.")
    
    for i in range(rows):
        while True:
            try:
                row_input = input(f"Row {chr(65 + i)} ({cols} values): ")
                
                # Handle input with or without spaces
                if ' ' in row_input:
                    # Space-separated input
                    values = [int(val) for val in row_input.split()]
                else:
                    # Input without spaces - convert each character to an integer
                    values = [int(char) for char in row_input]
                
                # Check if the correct number of values was provided
                if len(values) != cols:
                    print(f"Error: Please enter exactly {cols} values.")
                    continue
                
                # Check if all values are 0 or 1
                if not all(val in [0, 1] for val in values):
                    print("Error: All values must be either 0 or 1.")
                    continue
                
                matrix.append(values)
                break
            except ValueError:
                print("Error: Please enter valid integers (0 or 1).")
    
    return matrix

def create_graph_from_matrix(matrix_values):
    """Creates a directed graph from a Boolean adjacency matrix"""
    # Create a directed graph using NetworkX
    G = nx.DiGraph()
    
    # Get dimensions of the matrix
    rows = len(matrix_values)
    cols = len(matrix_values[0]) if rows > 0 else 0
    
    # Determine the actual number of nodes needed (max of rows and columns)
    num_nodes = max(rows, cols)
    
    # First, add all nodes to the graph (using letters A, B, C, etc.)
    for i in range(num_nodes):
        node_name = chr(65 + i)  # A, B, C, etc.
        G.add_node(node_name)
    
    # Then add edges based on the adjacency matrix values
    for i in range(rows):
        for j in range(cols):
            # Only add an edge if the matrix value is 1
            if matrix_values[i][j] == 1:
                source = chr(65 + i)
                target = chr(65 + j)
                G.add_edge(source, target)
                
    return G

def save_graph_to_file(G, filename="directed_graph.png"):
    """Save the graph to a file"""
    # Create projects directory if it doesn't exist
    if not os.path.exists("projects"):
        os.makedirs("projects")
    
    filepath = os.path.join("projects", "graph_gen", filename)
    
    # Create a nice layout for the graph
    if len(G.edges()) > 0:
        plt.figure(figsize=(10, 8))
        pos = nx.circular_layout(G)
        
        # Draw nodes with labels
        nx.draw_networkx_nodes(G, pos, node_color='#1a237e', node_size=700, alpha=0.9)
        nx.draw_networkx_labels(G, pos, font_color='white', font_weight='bold')
        
        # Draw edges with arrows
        nx.draw_networkx_edges(G, pos, edge_color='#1a237e', width=2, arrowsize=20)
        
        plt.axis('off')
        plt.title('Directed Graph from Boolean Matrix')
        plt.tight_layout()
        plt.savefig(filepath)
        plt.close()
        
        print(f"\nGraph saved successfully to {filepath}")
    else:
        print("\nNo edges in the graph. Nothing to save.")

def main():
    print("Boolean Matrix Graph Generator")
    print("-----------------------------")
    
    # Get matrix dimensions
    rows, cols = get_matrix_dimensions()
    
    # Get matrix values
    matrix = get_matrix_values(rows, cols)
    
    # Display the entered matrix
    print("\nYou entered the following matrix:")
    for row in matrix:
        print(" ".join(str(val) for val in row))
    
    # Create graph
    graph = create_graph_from_matrix(matrix)
    
    # Save to file
    save_graph_to_file(graph)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nOperation cancelled by user.")
    except Exception as e:
        print(f"\nAn error occurred: {str(e)}") 