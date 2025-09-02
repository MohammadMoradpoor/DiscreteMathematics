import numpy as np
import os

def get_matrix_dimensions():
    """Get square matrix dimensions from user input"""
    print("\nRelation Property Analyzer")
    print("-------------------------")
    print("This script analyzes a relation matrix for mathematical properties:")
    print("- Reflexivity        - Irreflexivity")
    print("- Symmetry           - Antisymmetry")
    print("- Transitivity       - Totality")
    print("For a relation on a set, the matrix must be square (same number of rows and columns).")
    print("-------------------------")
    
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
    
    # Set labels for displaying matrix with context
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

def check_reflexivity(R):
    """Check if relation is reflexive: ∀x: (x,x) ∈ R"""
    size = R.shape[0]
    for i in range(size):
        if R[i, i] == 0:
            return False
    return True

def check_irreflexivity(R):
    """Check if relation is irreflexive: ∀x: (x,x) ∉ R"""
    size = R.shape[0]
    for i in range(size):
        if R[i, i] == 1:
            return False
    return True

def check_symmetry(R):
    """Check if relation is symmetric: ∀x,y: (x,y) ∈ R ⟹ (y,x) ∈ R"""
    size = R.shape[0]
    for i in range(size):
        for j in range(size):
            if R[i, j] == 1 and R[j, i] != 1:
                return False
    return True

def check_antisymmetry(R):
    """Check if relation is antisymmetric: ∀x,y: (x,y) ∈ R ∧ (y,x) ∈ R ⟹ x = y"""
    size = R.shape[0]
    for i in range(size):
        for j in range(size):
            if i != j and R[i, j] == 1 and R[j, i] == 1:
                return False
    return True

def check_transitivity(R):
    """Check if relation is transitive: ∀x,y,z: (x,y) ∈ R ∧ (y,z) ∈ R ⟹ (x,z) ∈ R"""
    size = R.shape[0]
    for i in range(size):
        for j in range(size):
            for k in range(size):
                if R[i, j] == 1 and R[j, k] == 1 and R[i, k] != 1:
                    return False
    return True

def check_totality(R):
    """Check if relation is total: ∀x,y: x ≠ y ⟹ (x,y) ∈ R ∨ (y,x) ∈ R"""
    size = R.shape[0]
    for i in range(size):
        for j in range(size):
            if i != j and R[i, j] == 0 and R[j, i] == 0:
                return False
    return True

def display_matrix(matrix, elements=None):
    """Display a matrix with proper formatting and element labels"""
    print("\nRelation Matrix R:")
    size = matrix.shape[0]
    
    # Use element labels if provided, otherwise use numbers
    if elements is None:
        elements = [str(i) for i in range(size)]
    
    # Print column headers
    print("   " + " ".join([f"{elements[j]}" for j in range(size)]))
    
    # Print rows with row headers
    for i in range(size):
        print(f"{elements[i]}: " + " ".join([f"{int(val)}" for val in matrix[i]]))

def identify_relation_type(R):
    """Identify common relation types based on properties"""
    reflexive = check_reflexivity(R)
    symmetric = check_symmetry(R)
    transitive = check_transitivity(R)
    antisymmetric = check_antisymmetry(R)
    
    # Check for common relation types
    relation_types = []
    
    # Equivalence relation: reflexive, symmetric, transitive
    if reflexive and symmetric and transitive:
        relation_types.append("Equivalence relation")
    
    # Partial order: reflexive, antisymmetric, transitive
    if reflexive and antisymmetric and transitive:
        relation_types.append("Partial order")
    
    # Strict partial order: irreflexive, antisymmetric, transitive
    if check_irreflexivity(R) and antisymmetric and transitive:
        relation_types.append("Strict partial order")
    
    # Total order: partial order + total
    if reflexive and antisymmetric and transitive and check_totality(R):
        relation_types.append("Total order")
    
    return relation_types

def display_results(R, elements):
    """Display analysis results with explanations"""
    size = R.shape[0]
    
    print("\n=== Relation Property Analysis ===")
    
    # Check reflexivity
    reflexive = check_reflexivity(R)
    print(f"\n1. Reflexivity: {reflexive}")
    print("   A relation is reflexive if (x,x) ∈ R for all elements x")
    if not reflexive:
        missing = [elements[i] for i in range(size) if R[i, i] == 0]
        print(f"   Missing reflexive pairs: {', '.join([f'({x},{x})' for x in missing])}")
    
    # Check irreflexivity
    irreflexive = check_irreflexivity(R)
    print(f"\n2. Irreflexivity: {irreflexive}")
    print("   A relation is irreflexive if (x,x) ∉ R for all elements x")
    if not irreflexive:
        present = [elements[i] for i in range(size) if R[i, i] == 1]
        print(f"   Present reflexive pairs: {', '.join([f'({x},{x})' for x in present])}")
    
    # Check symmetry
    symmetric = check_symmetry(R)
    print(f"\n3. Symmetry: {symmetric}")
    print("   A relation is symmetric if (x,y) ∈ R implies (y,x) ∈ R")
    if not symmetric:
        print("   Pairs breaking symmetry:")
        for i in range(size):
            for j in range(size):
                if R[i, j] == 1 and R[j, i] == 0:
                    print(f"   ({elements[i]},{elements[j]}) ∈ R but ({elements[j]},{elements[i]}) ∉ R")
    
    # Check antisymmetry
    antisymmetric = check_antisymmetry(R)
    print(f"\n4. Antisymmetry: {antisymmetric}")
    print("   A relation is antisymmetric if (x,y) ∈ R and (y,x) ∈ R implies x = y")
    if not antisymmetric:
        print("   Pairs breaking antisymmetry:")
        for i in range(size):
            for j in range(size):
                if i != j and R[i, j] == 1 and R[j, i] == 1:
                    print(f"   Both ({elements[i]},{elements[j]}) and ({elements[j]},{elements[i]}) are in R")
    
    # Check transitivity
    transitive = check_transitivity(R)
    print(f"\n5. Transitivity: {transitive}")
    print("   A relation is transitive if (x,y) ∈ R and (y,z) ∈ R implies (x,z) ∈ R")
    if not transitive:
        print("   Triples breaking transitivity:")
        count = 0
        for i in range(size):
            for j in range(size):
                for k in range(size):
                    if R[i, j] == 1 and R[j, k] == 1 and R[i, k] == 0:
                        print(f"   ({elements[i]},{elements[j]}) ∈ R and ({elements[j]},{elements[k]}) ∈ R but ({elements[i]},{elements[k]}) ∉ R")
                        count += 1
                        if count >= 5:  # Limit examples to avoid overwhelming output
                            print("   (additional examples omitted)")
                            break
                if count >= 5:
                    break
            if count >= 5:
                break
    
    # Check totality
    total = check_totality(R)
    print(f"\n6. Totality: {total}")
    print("   A relation is total if for any distinct x and y, either (x,y) ∈ R or (y,x) ∈ R")
    if not total:
        print("   Pairs breaking totality:")
        for i in range(size):
            for j in range(size):
                if i != j and R[i, j] == 0 and R[j, i] == 0:
                    print(f"   Neither ({elements[i]},{elements[j]}) nor ({elements[j]},{elements[i]}) are in R")
    
    # Identify relation types
    relation_types = identify_relation_type(R)
    if relation_types:
        print("\n=== Relation Classification ===")
        print("This relation is a:")
        for rtype in relation_types:
            print(f"- {rtype}")
    else:
        print("\n=== Relation Classification ===")
        print("This relation doesn't match any common relation type.")

def save_results_to_file(R, elements, results):
    """Save the analysis results to a file"""
    # Create projects/rel_props directory if it doesn't exist
    output_dir = os.path.join("projects", "rel_props")
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    filepath = os.path.join(output_dir, "relation_properties.txt")
    
    # Store all output to print it to file
    with open(filepath, 'w') as f:
        f.write("Relation Property Analysis Results\n")
        f.write("================================\n\n")
        
        f.write(f"Elements: {', '.join(elements)}\n\n")
        
        f.write("Relation Matrix R:\n")
        for i, row in enumerate(R):
            f.write(f"{elements[i]}: " + " ".join([str(int(val)) for val in row]) + "\n")
        f.write("\n")
        
        f.write("=== Relation Properties ===\n")
        f.write(f"1. Reflexivity: {check_reflexivity(R)}\n")
        f.write(f"2. Irreflexivity: {check_irreflexivity(R)}\n")
        f.write(f"3. Symmetry: {check_symmetry(R)}\n")
        f.write(f"4. Antisymmetry: {check_antisymmetry(R)}\n")
        f.write(f"5. Transitivity: {check_transitivity(R)}\n")
        f.write(f"6. Totality: {check_totality(R)}\n\n")
        
        # Identify relation types
        relation_types = identify_relation_type(R)
        if relation_types:
            f.write("=== Relation Classification ===\n")
            f.write("This relation is a:\n")
            for rtype in relation_types:
                f.write(f"- {rtype}\n")
        else:
            f.write("=== Relation Classification ===\n")
            f.write("This relation doesn't match any common relation type.\n")
    
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
        display_matrix(R, elements)
        
        # Analyze and display all properties
        display_results(R, elements)
        
        # Store results for file output
        results = {
            "reflexive": check_reflexivity(R),
            "irreflexive": check_irreflexivity(R),
            "symmetric": check_symmetry(R),
            "antisymmetric": check_antisymmetry(R),
            "transitive": check_transitivity(R),
            "total": check_totality(R),
            "relation_types": identify_relation_type(R)
        }
        
        # Ask to save results
        save_option = input("\nWould you like to save the analysis to a file? (y/n): ")
        if save_option.lower() == 'y':
            save_results_to_file(R, elements, results)
            
    except KeyboardInterrupt:
        print("\nOperation cancelled by user.")
    except Exception as e:
        print(f"\nAn error occurred: {str(e)}")

if __name__ == "__main__":
    main() 