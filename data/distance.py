import itertools
import json

from calculate import get_cities_and_neighbours_list
from copy import deepcopy
from sys import maxsize

from city_pair import CityPair


def floyd_warshall(dist, vertex_count):
    for k in range(vertex_count):
        for i in range(vertex_count):
            for j in range(vertex_count):
                dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])

    return dist


NO_PARENT = -1


def dijkstra(adjacency_matrix, start_vertex):
    n_vertices = len(adjacency_matrix[0])

    shortest_distances = [maxsize] * n_vertices

    added = [False] * n_vertices

    for vertex_index in range(n_vertices):
        shortest_distances[vertex_index] = maxsize
        added[vertex_index] = False

    shortest_distances[start_vertex] = 0

    parents = [-1] * n_vertices

    parents[start_vertex] = NO_PARENT

    for i in range(1, n_vertices):
        nearest_vertex = -1
        shortest_distance = maxsize
        for vertex_index in range(n_vertices):
            if not added[vertex_index] and shortest_distances[vertex_index] < shortest_distance:
                nearest_vertex = vertex_index
                shortest_distance = shortest_distances[vertex_index]

        added[nearest_vertex] = True

        for vertex_index in range(n_vertices):
            edge_distance = adjacency_matrix[nearest_vertex][vertex_index]

            if edge_distance > 0 and shortest_distance + edge_distance < shortest_distances[vertex_index]:
                parents[vertex_index] = nearest_vertex
                shortest_distances[vertex_index] = shortest_distance + edge_distance

    return get_solutions(start_vertex, shortest_distances, parents)


def get_solutions(start_vertex, distances, parents):
    n_vertices = len(distances)

    shortest_paths = []

    for vertex_index in range(n_vertices):
        if vertex_index != start_vertex:
            shortest_paths.append(
                {
                    "origin": start_vertex,
                    "destination": vertex_index,
                    "distance": distances[vertex_index],
                    "shortest_path": get_path(vertex_index, parents)
                }
            )

    return shortest_paths


def get_path(current_vertex, parents, path=None):
    if path is None:
        path = []
    if current_vertex == NO_PARENT:
        return path
    return get_path(parents[current_vertex], parents, [current_vertex] + path)


if __name__ == "__main__":
    source_data = get_cities_and_neighbours_list()

    vertices = 81
    infinity = 9999
    graph = [[infinity for i in range(vertices)] for j in range(vertices)]

    for city in source_data:
        graph[city.code - 1][city.code - 1] = 0
        for neighbour in city.neighbours:
            graph[city.code - 1][neighbour - 1] = 1

    distance_matrix = floyd_warshall(deepcopy(graph), vertices)

    city_permutations = itertools.permutations(range(1, 82), 2)

    city_pairs = []
    dijkstra_results = []
    for i in range(81):
        dijkstra_results += dijkstra(deepcopy(graph), i)

    for pair in city_permutations:
        origin = pair[0] - 1
        destination = pair[1] - 1
        distance = distance_matrix[origin][destination]
        if distance > 1:
            dijkstra_result = list(
                filter(lambda x: x["origin"] == origin and x["destination"] == destination, dijkstra_results)
            )[0]

            if distance != dijkstra_result["distance"]:
                print(
                    f"dijkstra and floyd warshall did not provide the same result "
                    f"for {source_data[origin]}->{source_data[destination]}"
                )
            city_pair = CityPair(
                source_data[origin].code,
                source_data[destination].code,
                distance - 1,
                list(map(lambda x: x + 1, dijkstra_result["shortest_path"]))
            )

            city_pairs.append(city_pair)

    print(str(json.dumps(city_pairs, default=vars, ensure_ascii=False)))
