#!/usr/bin/env python3
"""Calculate reflexive, symmetric, and transitive closures of a relation"""

from typing import List, Tuple
import copy


class RelationClosures:
    """Class to calculate various closures of a relation"""
    
    def __init__(self, matrix: List[List[int]]):
        """Initialize with relation matrix"""
        self.original_matrix = matrix
        self.n = len(matrix)
        self.validate_matrix()
    
    def validate_matrix(self):
        """Validate that matrix is square"""
        for row in self.original_matrix:
            if len(row) != self.n:
                raise ValueError("Matrix must be square")
    
    def reflexive_closure(self) -> List[List[int]]:
        """Calculate reflexive closure by adding diagonal elements"""
        result = copy.deepcopy(self.original_matrix)
        
        # Add all diagonal elements (a,a) for all a
        for i in range(self.n):
            result[i][i] = 1
        
        return result
    
    def symmetric_closure(self) -> List[List[int]]:
        """Calculate symmetric closure by adding reverse of each relation"""
        result = copy.deepcopy(self.original_matrix)
        
        # If (a,b) exists, add (b,a)
        for i in range(self.n):
            for j in range(self.n):
                if self.original_matrix[i][j] == 1:
                    result[j][i] = 1
        
        return result
    
    def transitive_closure(self) -> List[List[int]]:
        """Calculate transitive closure using Warshall's algorithm"""
        result = copy.deepcopy(self.original_matrix)
        
        # Warshall's algorithm
        for k in range(self.n):
            for i in range(self.n):
                for j in range(self.n):
                    # If there's a path from i to k and from k to j, add path from i to j
                    result[i][j] = result[i][j] or (result[i][k] and result[k][j])
        
        return result
    
    def matrix_multiply_boolean(self, A: List[List[int]], B: List[List[int]]) -> List[List[int]]:
        """Boolean matrix multiplication for relation composition"""
        result = [[0] * self.n for _ in range(self.n)]
        
        for i in range(self.n):
            for j in range(self.n):
                for k in range(self.n):
                    if A[i][k] == 1 and B[k][j] == 1:
                        result[i][j] = 1
                        break
        
        return result
    
    def transitive_closure_powers(self) -> List[List[int]]:
        """Alternative: Calculate transitive closure using matrix powers"""
        result = copy.deepcopy(self.original_matrix)
        power = copy.deepcopy(self.original_matrix)
        
        # Calculate R ∪ R² ∪ R³ ∪ ... ∪ R^n
        for _ in range(self.n - 1):
            power = self.matrix_multiply_boolean(power, self.original_matrix)
            # Add to result (union)
            for i in range(self.n):
                for j in range(self.n):
                    result[i][j] = result[i][j] or power[i][j]
        
        return result
    
    def check_properties(self, matrix: List[List[int]]) -> dict:
        """Check if relation has reflexive, symmetric, transitive properties"""
        properties = {
            'reflexive': True,
            'symmetric': True,
            'transitive': True,
            'antisymmetric': True,
            'equivalence': False,
            'partial_order': False
        }
        
        # Check reflexive
        for i in range(self.n):
            if matrix[i][i] != 1:
                properties['reflexive'] = False
                break
        
        # Check symmetric and antisymmetric
        for i in range(self.n):
            for j in range(self.n):
                if matrix[i][j] == 1:
                    if matrix[j][i] != 1:
                        properties['symmetric'] = False
                    if i != j and matrix[j][i] == 1:
                        properties['antisymmetric'] = False
        
        # Check transitive
        for i in range(self.n):
            for j in range(self.n):
                for k in range(self.n):
                    if matrix[i][j] == 1 and matrix[j][k] == 1:
                        if matrix[i][k] != 1:
                            properties['transitive'] = False
                            break
        
        # Check for equivalence relation
        properties['equivalence'] = (properties['reflexive'] and 
                                    properties['symmetric'] and 
                                    properties['transitive'])
        
        # Check for partial order
        properties['partial_order'] = (properties['reflexive'] and 
                                      properties['antisymmetric'] and 
                                      properties['transitive'])
        
        return properties
    
    def get_relation_pairs(self, matrix: List[List[int]]) -> List[Tuple[int, int]]:
        """Get ordered pairs from relation matrix"""
        pairs = []
        for i in range(self.n):
            for j in range(self.n):
                if matrix[i][j] == 1:
                    pairs.append((i, j))
        return pairs
    
    def count_added_pairs(self, original: List[List[int]], closure: List[List[int]]) -> int:
        """Count how many pairs were added to form closure"""
        count = 0
        for i in range(self.n):
            for j in range(self.n):
                if closure[i][j] == 1 and original[i][j] == 0:
                    count += 1
        return count


def print_matrix(matrix: List[List[int]], title: str, elements: List[str] = None):
    """Print matrix with title"""
    n = len(matrix)
    if elements is None:
        elements = [str(i) for i in range(n)]
    
    print(f"\n{title}:")
    print("    ", end="")
    for e in elements:
        print(f"{e:3}", end="")
    print()
    
    for i in range(n):
        print(f"{elements[i]:3} ", end="")
        for j in range(n):
            print(f"{matrix[i][j]:3}", end="")
        print()


def print_pairs(pairs: List[Tuple[int, int]], elements: List[str] = None):
    """Print relation as ordered pairs"""
    if not pairs:
        print("∅ (empty)")
    else:
        if elements:
            pairs_str = ", ".join(f"({elements[a]},{elements[b]})" for a, b in pairs)
        else:
            pairs_str = ", ".join(f"({a},{b})" for a, b in pairs)
        print(f"{{{pairs_str}}}")


def main():
    """Main function with examples"""
    
    print("Relation Closures Calculator")
    print("=" * 60)
    print("\nThis program calculates:")
    print("1. Reflexive closure: Add (a,a) for all elements a")
    print("2. Symmetric closure: If (a,b) exists, add (b,a)")
    print("3. Transitive closure: If (a,b) and (b,c) exist, add (a,c)")
    
    # Example 1: Simple relation
    print("\n" + "=" * 60)
    print("Example 1: Simple Relation")
    print("-" * 40)
    
    matrix1 = [
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
        [0, 0, 0, 0],
    ]
    
    elements1 = ['a', 'b', 'c', 'd']
    print_matrix(matrix1, "Original Relation R", elements1)
    
    closures1 = RelationClosures(matrix1)
    
    # Check original properties
    props = closures1.check_properties(matrix1)
    print("\nOriginal relation properties:")
    print(f"  Reflexive: {props['reflexive']}")
    print(f"  Symmetric: {props['symmetric']}")
    print(f"  Transitive: {props['transitive']}")
    
    print("\nOriginal pairs:", end=" ")
    print_pairs(closures1.get_relation_pairs(matrix1), elements1)
    
    # Reflexive closure
    ref_closure = closures1.reflexive_closure()
    print_matrix(ref_closure, "Reflexive Closure", elements1)
    added = closures1.count_added_pairs(matrix1, ref_closure)
    print(f"Added {added} pairs for reflexive closure")
    print("Reflexive closure pairs:", end=" ")
    print_pairs(closures1.get_relation_pairs(ref_closure), elements1)
    
    # Symmetric closure
    sym_closure = closures1.symmetric_closure()
    print_matrix(sym_closure, "Symmetric Closure", elements1)
    added = closures1.count_added_pairs(matrix1, sym_closure)
    print(f"Added {added} pairs for symmetric closure")
    print("Symmetric closure pairs:", end=" ")
    print_pairs(closures1.get_relation_pairs(sym_closure), elements1)
    
    # Transitive closure
    trans_closure = closures1.transitive_closure()
    print_matrix(trans_closure, "Transitive Closure (Warshall's Algorithm)", elements1)
    added = closures1.count_added_pairs(matrix1, trans_closure)
    print(f"Added {added} pairs for transitive closure")
    print("Transitive closure pairs:", end=" ")
    print_pairs(closures1.get_relation_pairs(trans_closure), elements1)
    
    # Example 2: Equivalence relation
    print("\n" + "=" * 60)
    print("Example 2: Creating Equivalence Relation")
    print("-" * 40)
    
    matrix2 = [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 1],
    ]
    
    elements2 = ['x', 'y', 'z']
    print_matrix(matrix2, "Original Relation", elements2)
    
    closures2 = RelationClosures(matrix2)
    
    # To make equivalence relation, apply all three closures
    # First make it reflexive
    step1 = closures2.reflexive_closure()
    print_matrix(step1, "Step 1: Reflexive Closure", elements2)
    
    # Then make it symmetric
    closures2_temp = RelationClosures(step1)
    step2 = closures2_temp.symmetric_closure()
    print_matrix(step2, "Step 2: + Symmetric Closure", elements2)
    
    # Finally make it transitive
    closures2_final = RelationClosures(step2)
    step3 = closures2_final.transitive_closure()
    print_matrix(step3, "Step 3: + Transitive Closure (Equivalence Relation)", elements2)
    
    # Verify it's an equivalence relation
    props = closures2_final.check_properties(step3)
    print(f"\nFinal relation is equivalence relation: {props['equivalence']}")
    
    # Example 3: Partial order
    print("\n" + "=" * 60)
    print("Example 3: Partial Order Relation")
    print("-" * 40)
    
    # Less than or equal relation on {1, 2, 3}
    matrix3 = [
        [1, 1, 1],  # 1 ≤ 1, 1 ≤ 2, 1 ≤ 3
        [0, 1, 1],  # 2 ≤ 2, 2 ≤ 3
        [0, 0, 1],  # 3 ≤ 3
    ]
    
    elements3 = ['1', '2', '3']
    print_matrix(matrix3, "Relation ≤ (less than or equal)", elements3)
    
    closures3 = RelationClosures(matrix3)
    props = closures3.check_properties(matrix3)
    
    print("\nRelation properties:")
    print(f"  Reflexive: {props['reflexive']}")
    print(f"  Antisymmetric: {props['antisymmetric']}")
    print(f"  Transitive: {props['transitive']}")
    print(f"  Partial Order: {props['partial_order']}")
    
    # Interactive mode
    print("\n" + "=" * 60)
    print("Interactive Mode")
    print("-" * 40)
    
    choice = input("\nDo you want to enter your own relation? (y/n): ").lower()
    if choice == 'y':
        n = int(input("Enter size of relation matrix (n×n): "))
        
        print(f"\nEnter {n}×{n} relation matrix:")
        print("Format: Enter each row with 0s and 1s separated by spaces")
        matrix = []
        for i in range(n):
            row = list(map(int, input(f"Row {i}: ").split()))
            if len(row) != n:
                print(f"Error: Row must have {n} elements")
                return
            matrix.append(row)
        
        # Create element labels
        if n <= 26:
            elements = [chr(97 + i) for i in range(n)]  # a, b, c, ...
        else:
            elements = [str(i) for i in range(n)]
        
        print_matrix(matrix, "Original Relation", elements)
        
        closures = RelationClosures(matrix)
        
        # Check properties
        props = closures.check_properties(matrix)
        print("\nOriginal relation properties:")
        for prop, value in props.items():
            print(f"  {prop.capitalize()}: {value}")
        
        print("\nSelect closure to calculate:")
        print("1. Reflexive closure")
        print("2. Symmetric closure")
        print("3. Transitive closure")
        print("4. All closures")
        
        closure_choice = input("Enter choice (1-4): ").strip()
        
        if closure_choice in ['1', '4']:
            ref_closure = closures.reflexive_closure()
            print_matrix(ref_closure, "Reflexive Closure", elements)
            added = closures.count_added_pairs(matrix, ref_closure)
            print(f"Added {added} pairs")
        
        if closure_choice in ['2', '4']:
            sym_closure = closures.symmetric_closure()
            print_matrix(sym_closure, "Symmetric Closure", elements)
            added = closures.count_added_pairs(matrix, sym_closure)
            print(f"Added {added} pairs")
        
        if closure_choice in ['3', '4']:
            trans_closure = closures.transitive_closure()
            print_matrix(trans_closure, "Transitive Closure", elements)
            added = closures.count_added_pairs(matrix, trans_closure)
            print(f"Added {added} pairs")
            
            # Also show using matrix powers method
            trans_closure2 = closures.transitive_closure_powers()
            print_matrix(trans_closure2, "Transitive Closure (Matrix Powers Method)", elements)


if __name__ == "__main__":
    main()
