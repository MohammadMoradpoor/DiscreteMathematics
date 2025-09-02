#!/usr/bin/env python3
"""Calculate composition of two relations RoS"""

from typing import List, Tuple


class RelationComposition:
    """Class to calculate composition of two relations"""
    
    def __init__(self, matrix_R: List[List[int]], matrix_S: List[List[int]]):
        """Initialize with matrices for relations R and S"""
        self.R = matrix_R
        self.S = matrix_S
        self.validate_matrices()
    
    def validate_matrices(self):
        """Validate that matrices can be composed"""
        # R: A → B (m × n matrix)
        # S: B → C (n × p matrix)
        # RoS: A → C (m × p matrix)
        
        self.m = len(self.R)  # rows of R
        if self.m == 0:
            raise ValueError("Matrix R is empty")
        
        self.n = len(self.R[0])  # columns of R
        
        # Check R is rectangular
        for row in self.R:
            if len(row) != self.n:
                raise ValueError("Matrix R is not rectangular")
        
        # Check S dimensions
        if len(self.S) != self.n:
            raise ValueError(f"Matrix S must have {self.n} rows to compose with R")
        
        self.p = len(self.S[0]) if len(self.S) > 0 else 0  # columns of S
        
        # Check S is rectangular
        for row in self.S:
            if len(row) != self.p:
                raise ValueError("Matrix S is not rectangular")
    
    def compose(self) -> List[List[int]]:
        """Calculate RoS composition"""
        # RoS[i][j] = 1 if there exists k such that R[i][k] = 1 and S[k][j] = 1
        
        RoS = [[0] * self.p for _ in range(self.m)]
        
        for i in range(self.m):
            for j in range(self.p):
                # Check if there exists intermediate element k
                for k in range(self.n):
                    if self.R[i][k] == 1 and self.S[k][j] == 1:
                        RoS[i][j] = 1
                        break  # Found one path, that's enough
        
        return RoS
    
    def get_relation_pairs(self, matrix: List[List[int]], 
                          set_A: List[str], set_B: List[str]) -> List[Tuple[str, str]]:
        """Get ordered pairs from relation matrix"""
        pairs = []
        for i in range(len(matrix)):
            for j in range(len(matrix[0])):
                if matrix[i][j] == 1:
                    pairs.append((set_A[i], set_B[j]))
        return pairs


def print_matrix(matrix: List[List[int]], title: str, 
                row_labels: List[str] = None, col_labels: List[str] = None):
    """Print matrix with labels"""
    print(f"\n{title}:")
    
    if not matrix:
        print("  (Empty matrix)")
        return
    
    rows = len(matrix)
    cols = len(matrix[0]) if rows > 0 else 0
    
    # Default labels if not provided
    if row_labels is None:
        row_labels = [str(i) for i in range(rows)]
    if col_labels is None:
        col_labels = [str(i) for i in range(cols)]
    
    # Print column headers
    print("     ", end="")
    for label in col_labels:
        print(f"{label:4}", end="")
    print()
    
    # Print rows
    for i in range(rows):
        print(f"{row_labels[i]:4} ", end="")
        for j in range(cols):
            print(f"{matrix[i][j]:4}", end="")
        print()


def print_relation_info(pairs: List[Tuple[str, str]], name: str):
    """Print relation as set of ordered pairs"""
    if pairs:
        pairs_str = ", ".join(f"({a},{b})" for a, b in pairs)
        print(f"{name} = {{{pairs_str}}}")
    else:
        print(f"{name} = ∅ (empty relation)")


def main():
    """Main function with examples"""
    
    print("Relation Composition Calculator (RoS)")
    print("=" * 60)
    print("\nNote: RoS means 'R composed with S' or 'R followed by S'")
    print("If (a,b) ∈ R and (b,c) ∈ S, then (a,c) ∈ RoS")
    
    # Example 1: Simple composition
    print("\n" + "=" * 60)
    print("Example 1: Simple Relation Composition")
    print("-" * 40)
    
    # Define sets
    set_A = ['a', 'b', 'c']
    set_B = ['x', 'y', 'z']
    set_C = ['1', '2', '3']
    
    print(f"Set A = {{{', '.join(set_A)}}}")
    print(f"Set B = {{{', '.join(set_B)}}}")
    print(f"Set C = {{{', '.join(set_C)}}}")
    
    # R: A → B
    matrix_R1 = [
        [1, 0, 1],  # a → x, z
        [0, 1, 0],  # b → y
        [1, 1, 0],  # c → x, y
    ]
    
    # S: B → C
    matrix_S1 = [
        [1, 0, 0],  # x → 1
        [0, 1, 1],  # y → 2, 3
        [0, 0, 1],  # z → 3
    ]
    
    print_matrix(matrix_R1, "Matrix R (A → B)", set_A, set_B)
    print_matrix(matrix_S1, "Matrix S (B → C)", set_B, set_C)
    
    comp1 = RelationComposition(matrix_R1, matrix_S1)
    RoS1 = comp1.compose()
    
    print_matrix(RoS1, "Matrix RoS (A → C)", set_A, set_C)
    
    # Show as ordered pairs
    print("\nRelations as ordered pairs:")
    R_pairs = comp1.get_relation_pairs(matrix_R1, set_A, set_B)
    S_pairs = comp1.get_relation_pairs(matrix_S1, set_B, set_C)
    RoS_pairs = comp1.get_relation_pairs(RoS1, set_A, set_C)
    
    print_relation_info(R_pairs, "R")
    print_relation_info(S_pairs, "S")
    print_relation_info(RoS_pairs, "RoS")
    
    # Explain composition
    print("\nComposition explanation:")
    for i, a in enumerate(set_A):
        for j, c in enumerate(set_C):
            if RoS1[i][j] == 1:
                # Find intermediate element
                for k, b in enumerate(set_B):
                    if matrix_R1[i][k] == 1 and matrix_S1[k][j] == 1:
                        print(f"  ({a},{c}) ∈ RoS because ({a},{b}) ∈ R and ({b},{c}) ∈ S")
                        break
    
    # Example 2: Identity relation
    print("\n" + "=" * 60)
    print("Example 2: Composition with Identity Relation")
    print("-" * 40)
    
    # R: A → A
    matrix_R2 = [
        [0, 1, 0],
        [0, 0, 1],
        [1, 0, 0],
    ]
    
    # Identity on A
    matrix_I = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
    ]
    
    set_A2 = ['1', '2', '3']
    
    print_matrix(matrix_R2, "Matrix R", set_A2, set_A2)
    print_matrix(matrix_I, "Matrix I (Identity)", set_A2, set_A2)
    
    comp2 = RelationComposition(matrix_R2, matrix_I)
    RoI = comp2.compose()
    
    print_matrix(RoI, "Matrix RoI", set_A2, set_A2)
    print("\nNote: RoI = R (composing with identity gives original relation)")
    
    # Example 3: Chain of relations
    print("\n" + "=" * 60)
    print("Example 3: Chain of Relations")
    print("-" * 40)
    
    # Three relations forming a chain
    # R: Students → Courses
    students = ['Ali', 'Sara', 'Omar']
    courses = ['Math', 'CS', 'Physics']
    departments = ['Science', 'Engineering']
    
    print(f"Students = {{{', '.join(students)}}}")
    print(f"Courses = {{{', '.join(courses)}}}")
    print(f"Departments = {{{', '.join(departments)}}}")
    
    # R: Students enrolled in Courses
    matrix_R3 = [
        [1, 1, 0],  # Ali: Math, CS
        [0, 1, 1],  # Sara: CS, Physics
        [1, 0, 1],  # Omar: Math, Physics
    ]
    
    # S: Courses belong to Departments
    matrix_S3 = [
        [1, 0],  # Math: Science
        [0, 1],  # CS: Engineering
        [1, 0],  # Physics: Science
    ]
    
    print_matrix(matrix_R3, "R: Students → Courses", students, courses)
    print_matrix(matrix_S3, "S: Courses → Departments", courses, departments)
    
    comp3 = RelationComposition(matrix_R3, matrix_S3)
    RoS3 = comp3.compose()
    
    print_matrix(RoS3, "RoS: Students → Departments", students, departments)
    
    print("\nInterpretation:")
    for i, student in enumerate(students):
        depts = []
        for j, dept in enumerate(departments):
            if RoS3[i][j] == 1:
                depts.append(dept)
        if depts:
            print(f"  {student} is enrolled in department(s): {', '.join(depts)}")
    
    # Interactive mode
    print("\n" + "=" * 60)
    print("Interactive Mode")
    print("-" * 40)
    
    choice = input("\nDo you want to enter your own relations? (y/n): ").lower()
    if choice == 'y':
        # Get dimensions
        print("\nEnter dimensions for relation R (A → B):")
        m = int(input("  Number of elements in set A: "))
        n = int(input("  Number of elements in set B: "))
        
        print("\nEnter dimensions for relation S (B → C):")
        n2 = int(input("  Number of elements in set B (must match above): "))
        if n2 != n:
            print(f"Error: Set B must have {n} elements for composition")
            return
        p = int(input("  Number of elements in set C: "))
        
        # Get matrix R
        print(f"\nEnter matrix R ({m}×{n}):")
        print("Format: Enter each row with 0s and 1s separated by spaces")
        matrix_R = []
        for i in range(m):
            row = list(map(int, input(f"Row {i}: ").split()))
            if len(row) != n:
                print(f"Error: Row must have {n} elements")
                return
            matrix_R.append(row)
        
        # Get matrix S
        print(f"\nEnter matrix S ({n}×{p}):")
        matrix_S = []
        for i in range(n):
            row = list(map(int, input(f"Row {i}: ").split()))
            if len(row) != p:
                print(f"Error: Row must have {p} elements")
                return
            matrix_S.append(row)
        
        # Create labels
        set_A = [f"a{i+1}" for i in range(m)]
        set_B = [f"b{i+1}" for i in range(n)]
        set_C = [f"c{i+1}" for i in range(p)]
        
        print_matrix(matrix_R, "Matrix R (A → B)", set_A, set_B)
        print_matrix(matrix_S, "Matrix S (B → C)", set_B, set_C)
        
        # Calculate composition
        comp = RelationComposition(matrix_R, matrix_S)
        RoS = comp.compose()
        
        print_matrix(RoS, "Matrix RoS (A → C)", set_A, set_C)
        
        # Show as ordered pairs
        print("\nRelations as ordered pairs:")
        R_pairs = comp.get_relation_pairs(matrix_R, set_A, set_B)
        S_pairs = comp.get_relation_pairs(matrix_S, set_B, set_C)
        RoS_pairs = comp.get_relation_pairs(RoS, set_A, set_C)
        
        print_relation_info(R_pairs, "R")
        print_relation_info(S_pairs, "S")
        print_relation_info(RoS_pairs, "RoS")
        
        # Count relations
        print(f"\nStatistics:")
        print(f"  |R| = {len(R_pairs)} pairs")
        print(f"  |S| = {len(S_pairs)} pairs")
        print(f"  |RoS| = {len(RoS_pairs)} pairs")


if __name__ == "__main__":
    main()
