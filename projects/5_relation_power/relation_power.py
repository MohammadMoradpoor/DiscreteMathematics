import numpy as np
import os

def get_matrix_dimensions():
    """Get square matrix dimensions from user input"""
    print("\nRelation Closure Calculator")
    print("--------------------------")
    print("This script calculates R¹, R², R³, ..., R^n and R^∞ for a relation matrix R.")
    print("For a relation on a set, the matrix must be square (same number of rows and columns).")
    print("--------------------------")
    
    while True:
        try:
            size = int(input("Enter size of the square matrix R (1-10): "))
            
            if 1 <= size <= 10:
                return size
            else:
                print("Error: Size must be between 1 and 10.")
        except ValueError:
            print("Error: Please enter a valid integer.")

def get_matrix_values(size):
    """Get boolean matrix values from user input"""
    matrix = []
    
    print("\nEnter values for relation matrix R (0 or 1):")
    print("Enter values row by row, separated by spaces.")
    print("(If you enter values without spaces, each digit will be treated as a separate value)")
    
    # Set labels (optional, for displaying matrix with context)
    elements = [chr(65 + i) for i in range(size)]  # A, B, C, etc.
    print(f"\nElements for this relation: {', '.join(elements)}")
    
    for i in range(size):
        while True:
            try:
                row_input = input(f"Row {elements[i]} ({size} values): ")
                
                # Check if input contains spaces
                if ' ' in row_input:
                    # Parse input with spaces
                    values = [int(val) for val in row_input.split()]
                else:
                    # Parse input without spaces (treat each character as a separate value)
                    values = [int(val) for val in row_input]
                
                # Check if the correct number of values was provided
                if len(values) != size:
                    print(f"Error: Please enter exactly {size} values.")
                    continue
                
                # Check if all values are 0 or 1
                if not all(val in [0, 1] for val in values):
                    print("Error: All values must be either 0 or 1.")
                    continue
                
                matrix.append(values)
                break
            except ValueError:
                print("Error: Please enter valid integers (0 or 1).")
    
    return np.array(matrix, dtype=int)

def get_power_n():
    """Get the n value for R^n from user input"""
    while True:
        try:
            n = int(input("\nEnter the maximum power n to calculate (1-10): "))
            
            if 1 <= n <= 10:
                return n
            else:
                print("Error: n must be between 1 and 10.")
        except ValueError:
            print("Error: Please enter a valid integer.")

def boolean_matrix_multiplication(A, B):
    """Perform Boolean matrix multiplication"""
    # Convert to numpy arrays and ensure boolean type
    A = np.array(A, dtype=bool)
    B = np.array(B, dtype=bool)
    
    result = np.zeros(A.shape, dtype=int)
    for i in range(A.shape[0]):
        for j in range(A.shape[1]):
            # For each element (i,j), we need to check if there exists a k
            # where A[i,k] AND B[k,j] is 1
            for k in range(A.shape[0]):
                if A[i, k] and B[k, j]:
                    result[i, j] = 1
                    break  # Once we find a 1, we can stop checking other k values
    return result

def calculate_all_powers(R, max_n):
    """Calculate R¹, R², R³, ..., R^n"""
    powers = [R.copy()]  # R¹ is just R
    
    current_power = R.copy()
    for i in range(2, max_n + 1):
        current_power = boolean_matrix_multiplication(current_power, R)
        powers.append(current_power.copy())
    
    return powers

def calculate_transitive_closure(R):
    """Calculate R^∞ (transitive closure) using Warshall's algorithm"""
    size = R.shape[0]
    result = R.copy()
    
    # Warshall's algorithm for transitive closure
    for k in range(size):
        for i in range(size):
            for j in range(size):
                result[i, j] = result[i, j] or (result[i, k] and result[k, j])
    
    return result

def display_matrix(matrix, name="Matrix", elements=None):
    """Display a matrix with proper formatting and element labels"""
    print(f"\n{name}:")
    size = matrix.shape[0]
    
    # Use element labels if provided, otherwise use numbers
    if elements is None:
        elements = [str(i) for i in range(size)]
    
    # Print column headers
    print("   " + " ".join([f"{elements[j]}" for j in range(size)]))
    
    # Print rows with row headers
    for i in range(size):
        print(f"{elements[i]}: " + " ".join([f"{int(val)}" for val in matrix[i]]))

def save_results_to_file(R, powers, R_inf, max_n, elements):
    """Save the relation matrices to a file"""
    # Create rel_closure directory if it doesn't exist
    if not os.path.exists("projects/rel_closure"):
        os.makedirs("projects/rel_closure")
    
    filepath = os.path.join("projects/rel_closure", "relation_closure_results.txt")
    
    with open(filepath, 'w') as f:
        f.write("Relation Closure Calculation Results\n")
        f.write("==================================\n\n")
        
        f.write(f"Elements: {', '.join(elements)}\n\n")
        
        f.write("Original Relation Matrix R (R¹):\n")
        for i, row in enumerate(R):
            f.write(f"{elements[i]}: " + " ".join([str(int(val)) for val in row]) + "\n")
        f.write("\n")
        
        # Write all calculated powers
        for i in range(1, max_n):
            f.write(f"R^{i+1} (Relation Composed {i+1} Times):\n")
            for j, row in enumerate(powers[i]):
                f.write(f"{elements[j]}: " + " ".join([str(int(val)) for val in row]) + "\n")
            f.write("\n")
        
        f.write("R^∞ (Transitive Closure):\n")
        for i, row in enumerate(R_inf):
            f.write(f"{elements[i]}: " + " ".join([str(int(val)) for val in row]) + "\n")
    
    print(f"\nResults saved to {filepath}")

def main():
    try:
        # Get matrix dimensions (square matrix)
        size = get_matrix_dimensions()
        
        # Generate element labels
        elements = [chr(65 + i) for i in range(size)]
        
        # Get matrix values
        R = get_matrix_values(size)
        
        # Display the entered relation matrix
        display_matrix(R, "Original Relation Matrix R (R¹)", elements)
        
        # Get maximum n for R^n calculation
        max_n = get_power_n()
        
        # Calculate all powers R¹, R², R³, ..., R^n
        powers = calculate_all_powers(R, max_n)
        
        # Calculate R^∞ (transitive closure)
        R_inf = calculate_transitive_closure(R)
        
        # Display results for each power
        for i in range(1, max_n):
            display_matrix(powers[i], f"R^{i+1} (Relation Composed {i+1} Times)", elements)
        
        # Display transitive closure
        display_matrix(R_inf, "R^∞ (Transitive Closure)", elements)
        
        # Ask to save results
        save_option = input("\nWould you like to save the results to a file? (y/n): ")
        if save_option.lower() == 'y':
            save_results_to_file(R, powers, R_inf, max_n, elements)
            
    except KeyboardInterrupt:
        print("\nOperation cancelled by user.")
    except Exception as e:
        print(f"\nAn error occurred: {str(e)}")

if __name__ == "__main__":
    main()