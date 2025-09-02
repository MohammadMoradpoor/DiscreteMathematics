import numpy as np
import os

def get_matrix_dimensions(matrix_name):
    """Get matrix dimensions from user input with guidance on compatibility"""
    print("\nImportant compatibility information:")
    print("- For Boolean addition (OR), both matrices must have exactly the same dimensions")
    print("- For Boolean AND, the number of columns in Matrix A must equal")
    print("  the number of rows in Matrix B")
    print("--------------------------------------------------------------------")
    
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

def boolean_matrix_addition(A, B):
    """Perform Boolean matrix addition (OR operation)"""
    if A.shape != B.shape:
        raise ValueError("Matrices must have the same dimensions for addition")
    
    # Convert to numpy arrays and ensure boolean type
    A = np.array(A, dtype=bool)
    B = np.array(B, dtype=bool)
    
    # Perform OR operation
    result = np.logical_or(A, B)
    return result.astype(int)

def boolean_matrix_elementwise_and(A, B):
    """Perform element-wise Boolean AND operation"""
    if A.shape != B.shape:
        raise ValueError("Matrices must have the same dimensions for element-wise AND")
    A = np.array(A, dtype=bool)
    B = np.array(B, dtype=bool)
    result = np.logical_and(A, B)
    return result.astype(int)

def save_results_to_file(matrix_a, matrix_b, addition, elementwise_and):
    """Save the matrix operations results to a file in projects/bool_matrix"""
    output_dir = os.path.join("projects", "bool_matrix")
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    filepath = os.path.join(output_dir, "matrix_results.txt")
    with open(filepath, 'w') as f:
        f.write("Boolean Matrix Operations Results\n")
        f.write("===============================\n\n")
        f.write("Matrix A:\n")
        for row in matrix_a:
            f.write(" ".join([str(int(val)) for val in row]) + "\n")
        f.write("\n")
        f.write("Matrix B:\n")
        for row in matrix_b:
            f.write(" ".join([str(int(val)) for val in row]) + "\n")
        f.write("\n")
        f.write("Boolean Matrix Addition (A ∨ B):\n")
        for row in addition:
            f.write(" ".join([str(int(val)) for val in row]) + "\n")
        f.write("\n")
        f.write("Boolean Matrix AND (A ∧ B):\n")
        for row in elementwise_and:
            f.write(" ".join([str(int(val)) for val in row]) + "\n")
    print(f"\nResults saved to {filepath}")

def main():
    print("\n========= Boolean Matrix Operations =========")
    print("This script performs Boolean operations on two matrices\n")

    # Get dimensions for both matrices first
    print("First, let's define Matrix A:")
    rows_a, cols_a = get_matrix_dimensions("A")
    print("\nNow, let's define Matrix B:")
    rows_b, cols_b = get_matrix_dimensions("B")

    # Check compatibility for AND/OR
    if rows_a != rows_b or cols_a != cols_b:
        print("\n✗ Error: Matrices must have the same dimensions for Boolean addition (OR) and AND.")
        print(f"Matrix A is {rows_a}×{cols_a}, Matrix B is {rows_b}×{cols_b}.")
        print("Operation aborted.")
        return
    else:
        print("\n✓ Matrices have matching dimensions for Boolean addition (OR) and AND.")

    # Get matrix values
    try:
        print("\nNow enter the values for each matrix:")
        matrix_a = get_matrix_values(rows_a, cols_a, "A")
        matrix_b = get_matrix_values(rows_b, cols_b, "B")
    except Exception as e:
        print(f"\nError in matrix input: {str(e)}")
        print("Operation aborted.")
        return

    # Display the entered matrices
    display_matrix(matrix_a, "Matrix A")
    display_matrix(matrix_b, "Matrix B")

    # Calculate and display Boolean operations
    try:
        # Boolean addition (OR)
        addition = boolean_matrix_addition(matrix_a, matrix_b)
        print("\n=== Boolean Matrix Addition (A ∨ B) ===")
        display_matrix(addition, "Result")
    except Exception as e:
        print(f"\nError in Boolean addition: {str(e)}")
        print("Operation aborted.")
        return

    try:
        # Boolean AND (element-wise)
        elementwise_and = boolean_matrix_elementwise_and(matrix_a, matrix_b)
        print("\n=== Boolean Matrix AND (A ∧ B) ===")
        display_matrix(elementwise_and, "Result")
    except Exception as e:
        print(f"\nError in Boolean AND: {str(e)}")
        print("Operation aborted.")
        return

    # Save results to file in projects/bool_matrix
    save_option = input("\nWould you like to save the results to a file? (y/n): ")
    if save_option.lower() == 'y':
        save_results_to_file(matrix_a, matrix_b, addition, elementwise_and)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nOperation cancelled by user.")
    except Exception as e:
        print(f"\nAn error occurred: {str(e)}") 