from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
import numpy as np
import json
import base64
from io import BytesIO
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import networkx as nx

# Add projects directories to path
projects_base = os.path.join(os.path.dirname(__file__), '..', 'projects')
sys.path.append(projects_base)
sys.path.append(os.path.join(projects_base, '2_relation_to_graph'))
sys.path.append(os.path.join(projects_base, '3_boolean_and_or'))
sys.path.append(os.path.join(projects_base, '4_boolean_multiplication'))
sys.path.append(os.path.join(projects_base, '5_relation_power'))
sys.path.append(os.path.join(projects_base, '6_relation_properties'))
sys.path.append(os.path.join(projects_base, '7_8_9_relation_closures'))
sys.path.append(os.path.join(projects_base, '10_relation_composition'))
sys.path.append(os.path.join(projects_base, '11_graph_visualizer'))
sys.path.append(os.path.join(projects_base, '12_vertex_degree'))
sys.path.append(os.path.join(projects_base, '13_complement_matrix'))
sys.path.append(os.path.join(projects_base, '14_subgraph_checker'))
sys.path.append(os.path.join(projects_base, '15_connectivity_checker'))
sys.path.append(os.path.join(projects_base, '16_path_length_calculator'))
sys.path.append(os.path.join(projects_base, '17_eulerian_path'))
sys.path.append(os.path.join(projects_base, '18_dijkstra_shortest_path'))

# Import all project modules - we'll handle import errors gracefully
try:
    from relation_to_graph import create_graph_from_matrix
except ImportError:
    create_graph_from_matrix = None

try:
    from boolean_and_or import boolean_matrix_addition, boolean_matrix_elementwise_and
except ImportError:
    boolean_matrix_addition = None
    boolean_matrix_elementwise_and = None

try:
    from boolean_multiplication import boolean_matrix_multiplication
except ImportError:
    boolean_matrix_multiplication = None

try:
    from relation_power import calculate_all_powers, calculate_transitive_closure
except ImportError:
    calculate_all_powers = None
    calculate_transitive_closure = None

try:
    from relation_properties import (check_reflexivity, check_irreflexivity, 
                                    check_symmetry, check_antisymmetry, 
                                    check_transitivity, check_totality)
except ImportError:
    check_reflexivity = None
    check_irreflexivity = None
    check_symmetry = None
    check_antisymmetry = None
    check_transitivity = None
    check_totality = None

try:
    from relation_closures import RelationClosures
except ImportError:
    RelationClosures = None

try:
    from relation_composition import RelationComposition
except ImportError:
    RelationComposition = None

try:
    from graph_visualizer import GraphVisualizer
except ImportError:
    GraphVisualizer = None

try:
    from vertex_degree_calculator import VertexDegreeCalculator
except ImportError:
    VertexDegreeCalculator = None

try:
    from complement_matrix_calculator import ComplementMatrixCalculator
except ImportError:
    ComplementMatrixCalculator = None

try:
    from subgraph_checker import SubgraphChecker
except ImportError:
    SubgraphChecker = None

try:
    from connectivity_checker import ConnectivityChecker
except ImportError:
    ConnectivityChecker = None

try:
    from path_length_calculator import PathLengthCalculator
except ImportError:
    PathLengthCalculator = None

try:
    from eulerian_path_finder import EulerianPathFinder
except ImportError:
    EulerianPathFinder = None

try:
    from dijkstra_algorithm import Graph, dijkstra, get_shortest_path
except ImportError:
    Graph = None
    dijkstra = None
    get_shortest_path = None

app = Flask(__name__)
CORS(app)

@app.route('/api/relation-to-graph', methods=['POST'])
def relation_to_graph():
    try:
        data = request.json
        matrix = data['matrix']
        
        # Create graph using NetworkX
        G = nx.DiGraph()
        n = len(matrix)
        
        for i in range(n):
            G.add_node(chr(65 + i))
        
        for i in range(n):
            for j in range(n):
                if matrix[i][j] == 1:
                    G.add_edge(chr(65 + i), chr(65 + j))
        
        # Generate graph visualization
        plt.figure(figsize=(8, 6))
        pos = nx.spring_layout(G)
        nx.draw(G, pos, with_labels=True, node_color='lightblue', 
                node_size=1000, font_size=16, font_weight='bold',
                arrows=True, arrowsize=20, edge_color='gray')
        
        # Convert to base64
        buffer = BytesIO()
        plt.savefig(buffer, format='png', bbox_inches='tight')
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.getvalue()).decode()
        plt.close()
        
        return jsonify({
            'success': True,
            'graph_image': f'data:image/png;base64,{image_base64}',
            'nodes': list(G.nodes()),
            'edges': list(G.edges()),
            'num_nodes': G.number_of_nodes(),
            'num_edges': G.number_of_edges()
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/boolean-operations', methods=['POST'])
def boolean_operations():
    try:
        data = request.json
        matrix_a = np.array(data['matrixA'])
        matrix_b = np.array(data['matrixB'])
        
        # Check dimensions
        if matrix_a.shape != matrix_b.shape:
            return jsonify({
                'success': False, 
                'error': 'Matrices must have the same dimensions'
            }), 400
        
        # Perform operations
        addition = boolean_matrix_addition(matrix_a, matrix_b)
        elementwise_and = boolean_matrix_elementwise_and(matrix_a, matrix_b)
        
        return jsonify({
            'success': True,
            'addition': addition.tolist(),
            'elementwise_and': elementwise_and.tolist()
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/boolean-multiplication', methods=['POST'])
def boolean_mult():
    try:
        data = request.json
        matrix_a = np.array(data['matrixA'])
        matrix_b = np.array(data['matrixB'])
        
        # Check dimensions
        if matrix_a.shape[1] != matrix_b.shape[0]:
            return jsonify({
                'success': False,
                'error': f'Matrix dimensions incompatible: A is {matrix_a.shape}, B is {matrix_b.shape}'
            }), 400
        
        result = boolean_matrix_multiplication(matrix_a, matrix_b)
        
        return jsonify({
            'success': True,
            'result': result.tolist(),
            'result_shape': result.shape
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/relation-power', methods=['POST'])
def relation_power():
    try:
        data = request.json
        matrix = np.array(data['matrix'])
        max_power = data.get('maxPower', 3)
        
        # Check if matrix is square
        if matrix.shape[0] != matrix.shape[1]:
            return jsonify({
                'success': False,
                'error': 'Matrix must be square'
            }), 400
        
        powers = calculate_all_powers(matrix, max_power)
        transitive_closure = calculate_transitive_closure(matrix)
        
        return jsonify({
            'success': True,
            'powers': [p.tolist() for p in powers],
            'transitive_closure': transitive_closure.tolist()
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/relation-properties', methods=['POST'])
def relation_props():
    try:
        data = request.json
        matrix = np.array(data['matrix'])
        
        # Check if matrix is square
        if matrix.shape[0] != matrix.shape[1]:
            return jsonify({
                'success': False,
                'error': 'Matrix must be square'
            }), 400
        
        properties = {
            'reflexive': check_reflexivity(matrix),
            'irreflexive': check_irreflexivity(matrix),
            'symmetric': check_symmetry(matrix),
            'antisymmetric': check_antisymmetry(matrix),
            'transitive': check_transitivity(matrix),
            'total': check_totality(matrix)
        }
        
        # Check for special relation types
        relation_types = []
        if properties['reflexive'] and properties['symmetric'] and properties['transitive']:
            relation_types.append('Equivalence Relation')
        if properties['reflexive'] and properties['antisymmetric'] and properties['transitive']:
            relation_types.append('Partial Order')
        if properties['irreflexive'] and properties['antisymmetric'] and properties['transitive']:
            relation_types.append('Strict Partial Order')
        
        return jsonify({
            'success': True,
            'properties': properties,
            'relation_types': relation_types
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/relation-closures', methods=['POST'])
def relation_closures():
    try:
        data = request.json
        matrix = data['matrix']
        
        closures = RelationClosures(matrix)
        
        reflexive = closures.reflexive_closure()
        symmetric = closures.symmetric_closure()
        transitive = closures.transitive_closure()
        
        return jsonify({
            'success': True,
            'reflexive_closure': reflexive,
            'symmetric_closure': symmetric,
            'transitive_closure': transitive,
            'original_properties': closures.check_properties(matrix)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/relation-composition', methods=['POST'])
def relation_composition():
    try:
        data = request.json
        matrix_r = data['matrixR']
        matrix_s = data['matrixS']
        
        comp = RelationComposition(matrix_r, matrix_s)
        result = comp.compose()
        
        return jsonify({
            'success': True,
            'composition': result,
            'dimensions': {
                'R': f'{len(matrix_r)}×{len(matrix_r[0])}',
                'S': f'{len(matrix_s)}×{len(matrix_s[0])}',
                'RoS': f'{len(result)}×{len(result[0])}'
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/visualize-graph', methods=['POST'])
def visualize_graph():
    try:
        data = request.json
        adj_matrix = data['adjMatrix']
        
        viz = GraphVisualizer(adj_matrix)
        info = viz.get_graph_info()
        
        # Create visualization
        G = viz.create_graph()
        plt.figure(figsize=(10, 8))
        pos = nx.spring_layout(G)
        
        if viz.is_directed:
            nx.draw(G, pos, with_labels=True, node_color='lightblue',
                   node_size=1000, font_size=16, arrows=True, arrowsize=20)
        else:
            nx.draw(G, pos, with_labels=True, node_color='lightblue',
                   node_size=1000, font_size=16)
        
        # Convert to base64
        buffer = BytesIO()
        plt.savefig(buffer, format='png', bbox_inches='tight')
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.getvalue()).decode()
        plt.close()
        
        return jsonify({
            'success': True,
            'graph_image': f'data:image/png;base64,{image_base64}',
            'info': info
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/vertex-degree', methods=['POST'])
def vertex_degree():
    try:
        data = request.json
        adj_matrix = data['adjMatrix']
        is_directed = data.get('isDirected', False)
        
        calc = VertexDegreeCalculator(adj_matrix)
        
        if is_directed:
            in_deg, out_deg, total_deg = calc.calculate_degrees_directed()
            result = {
                'in_degrees': in_deg,
                'out_degrees': out_deg,
                'total_degrees': total_deg,
                'is_directed': True
            }
        else:
            degrees = calc.calculate_degree_undirected()
            special = calc.find_special_vertices(degrees)
            result = {
                'degrees': degrees,
                'special_vertices': special,
                'is_directed': False
            }
        
        return jsonify({
            'success': True,
            **result
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/complement-matrix', methods=['POST'])
def complement_matrix():
    try:
        data = request.json
        adj_matrix = data['adjMatrix']
        
        calc = ComplementMatrixCalculator(adj_matrix)
        complement = calc.calculate_complement()
        
        orig_props = calc.get_graph_properties(adj_matrix)
        comp_props = calc.get_graph_properties(complement)
        
        return jsonify({
            'success': True,
            'complement': complement,
            'original_properties': orig_props,
            'complement_properties': comp_props
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/check-subgraph', methods=['POST'])
def check_subgraph():
    try:
        data = request.json
        matrix_g1 = data['matrixG1']
        matrix_g2 = data['matrixG2']
        
        checker = SubgraphChecker(matrix_g1, matrix_g2)
        is_subgraph, mapping, message = checker.find_subgraph()
        is_induced, induced_mapping = checker.find_induced_subgraph()
        
        return jsonify({
            'success': True,
            'is_subgraph': is_subgraph,
            'mapping': mapping,
            'message': message,
            'is_induced_subgraph': is_induced,
            'induced_mapping': induced_mapping
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/check-connectivity', methods=['POST'])
def check_connectivity():
    try:
        data = request.json
        adj_matrix = data['adjMatrix']
        is_directed = data.get('isDirected', False)
        
        checker = ConnectivityChecker(adj_matrix, is_directed)
        connected, status, components = checker.check_connectivity()
        
        return jsonify({
            'success': True,
            'is_connected': connected,
            'status': status,
            'components': [list(comp) for comp in components],
            'num_components': len(components)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/calculate-path-length', methods=['POST'])
def calculate_path_length():
    try:
        data = request.json
        adj_matrix = data['adjMatrix']
        weight_matrix = data['weightMatrix']
        path = data['path']
        
        calc = PathLengthCalculator(adj_matrix, weight_matrix)
        valid, length, edges = calc.calculate_path_length(path)
        
        return jsonify({
            'success': True,
            'valid': valid,
            'total_length': length,
            'edges': edges
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/find-eulerian-path', methods=['POST'])
def find_eulerian_path():
    try:
        data = request.json
        adj_matrix = data['adjMatrix']
        
        finder = EulerianPathFinder(adj_matrix)
        has_path, start = finder.has_eulerian_path()
        
        if has_path:
            path = finder.find_eulerian_path()
            in_deg, out_deg = finder.calculate_degrees()
            
            return jsonify({
                'success': True,
                'has_eulerian_path': True,
                'path': path,
                'start_vertex': start,
                'in_degrees': in_deg,
                'out_degrees': out_deg
            })
        else:
            in_deg, out_deg = finder.calculate_degrees()
            return jsonify({
                'success': True,
                'has_eulerian_path': False,
                'reason': 'Graph does not satisfy Eulerian path conditions',
                'in_degrees': in_deg,
                'out_degrees': out_deg
            })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/dijkstra-shortest-path', methods=['POST'])
def dijkstra_shortest_path():
    try:
        data = request.json
        edges = data['edges']  # List of [source, dest, weight]
        start_node = data['startNode']
        
        g = Graph()
        for edge in edges:
            g.add_edge(edge[0], edge[1], edge[2])
        
        distances, previous = dijkstra(g, start_node)
        
        # Get paths to all nodes
        paths = {}
        for node in distances:
            if node != start_node:
                path = get_shortest_path(previous, start_node, node)
                paths[node] = path
        
        return jsonify({
            'success': True,
            'distances': distances,
            'paths': paths
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
