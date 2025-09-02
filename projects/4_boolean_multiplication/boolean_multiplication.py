import numpy as np
import os

def get_matrix_dimensions(matrix_name):
    """Get matrix dimensions from user input with guidance on compatibility"""
    if matrix_name == "A":
        print("\nBoolean Matrix Multiplication Calculator")
        print("---------------------------------------")
        print("For Boolean matrix multiplication (A ⊙ B):")
        print("- The number of columns in Matrix A must equal the number of rows in Matrix B")
        print("- Result will be a matrix with dimensions: (rows of A) × (columns of B)")
        print("---------------------------------------")
    while True:
        try:
            rows = int(input(f"Enter number of rows for Matrix {matrix_name} (1-10): "))
            cols = int(input(f"Enter number of columns for Matrix {matrix_name} (1-10): "))
            
            if 1 <= rows <= 10 and 1 <= cols <= 10:
                return rows, cols
            else:
                print("Error: Dimensions must be between 1 and 10.")
        except ValueError:
            print("Error: Please enter valid integers.")

def get_matrix_values(rows, cols, matrix_name):
    """Get boolean matrix values from user input"""
    matrix = []
    
    print(f"\nEnter values for Matrix {matrix_name} (0 or 1):")
    print("Enter values row by row, separated by spaces.")
    print("(If you enter values without spaces, each digit will be treated as a separate value)")
    
    for i in range(rows):
        while True:
            try:
                row_input = input(f"Row {i+1} ({cols} values): ")
                
                # Check if input contains spaces
                if ' ' in row_input:
                    # Parse input with spaces
                    values = [int(val) for val in row_input.split()]
                else:
                    # Parse input without spaces (treat each character as a separate value)
                    values = [int(val) for val in row_input]
                
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
    
    return np.array(matrix, dtype=int)

def display_matrix(matrix, name="Matrix"):
    """Display a matrix with proper formatting"""
    print(f"\n{name}:")
    rows, cols = matrix.shape
    
    # Print column headers
    print("   " + " ".join([f"{j}" for j in range(cols)]))
    
    # Print rows with row headers
    for i in range(rows):
        print(f"{i}: " + " ".join([f"{int(val)}" for val in matrix[i]]))

def boolean_matrix_multiplication(A, B):
    """Perform Boolean matrix multiplication (A ⊙ B)"""
    if A.shape[1] != B.shape[0]:
        raise ValueError("Matrix dimensions are not compatible for multiplication")
    
    # Convert to numpy arrays and ensure boolean type
    A = np.array(A, dtype=bool)
    B = np.array(B, dtype=bool)
    
    result = np.zeros((A.shape[0], B.shape[1]), dtype=int)
    for i in range(A.shape[0]):
        for j in range(B.shape[1]):
            # For each element (i, j) in the result, check if there exists a k
            # such that A[i, k] ⊙ B[k, j] = 1 (i.e., A[i, k] and B[k, j] are both 1)
            for k in range(A.shape[1]):
                if A[i, k] and B[k, j]:
                    result[i, j] = 1
                    break  # Once we find a 1, we can stop checking other k values
    return result

def save_results_to_file(matrix_a, matrix_b, product):
    """Save the matrix multiplication results to a file"""
    # Create projects/bool_mult directory if it doesn't exist
    output_dir = os.path.join("projects", "bool_mult")
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    filepath = os.path.join(output_dir, "boolean_multiplication_results.txt")
    
    with open(filepath, 'w') as f:
        f.write("Boolean Matrix Multiplication Results\n")
        f.write("===================================\n\n")
        
        f.write("Matrix A:\n")
        for row in matrix_a:
            f.write(" ".join([str(int(val)) for val in row]) + "\n")
        f.write("\n")
        
        f.write("Matrix B:\n")
        for row in matrix_b:
            f.write(" ".join([str(int(val)) for val in row]) + "\n")
        f.write("\n")
        
        f.write("Boolean Matrix Multiplication (A ⊙ B):\n")
        for row in product:
            f.write(" ".join([str(int(val)) for val in row]) + "\n")
    
    print(f"\nResults saved to {filepath}")

def main():
    try:
        # Get dimensions for matrix A
        rows_a, cols_a = get_matrix_dimensions("A")
        # Get dimensions for matrix B
        rows_b, cols_b = get_matrix_dimensions("B")

        # Check compatibility before taking values
        if cols_a != rows_b:
            print(f"\n✗ Matrices are not compatible for multiplication")
            print(f"  Matrix A has {cols_a} columns but Matrix B has {rows_b} rows")
            print(f"  These values must be equal for multiplication to be defined")
            print("Exiting program.")
            return
        else:
            print(f"\n✓ Matrices are compatible - Result will be a {rows_a}×{cols_b} matrix")

        # Now get values for both matrices
        matrix_a = get_matrix_values(rows_a, cols_a, "A")
        matrix_b = get_matrix_values(rows_b, cols_b, "B")

        # Display the entered matrices
        display_matrix(matrix_a, "Matrix A")
        display_matrix(matrix_b, "Matrix B")

        # Calculate and display Boolean multiplication
        try:
            product = boolean_matrix_multiplication(matrix_a, matrix_b)
            print("\n=== Boolean Matrix Multiplication (A ⊙ B) ===")
            print("(Where ⊙ represents Boolean matrix multiplication)")
            display_matrix(product, "Result")

            # Ask to save results
            save_option = input("\nWould you like to save the results to a file? (y/n): ")
            if save_option.lower() == 'y':
                save_results_to_file(matrix_a, matrix_b, product)

        except ValueError as e:
            print(f"\nError calculating Boolean multiplication: {str(e)}")

    except KeyboardInterrupt:
        print("\nOperation cancelled by user.")
    except Exception as e:
        print(f"\nAn error occurred: {str(e)}")

if __name__ == "__main__":
    main()
