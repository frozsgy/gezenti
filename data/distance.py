import itertools
import json

from calculate import get_cities_and_neighbours_list
from copy import deepcopy

from city_pair import CityPair


def floyd_warshall(dist, vertex_count):
    for k in range(vertex_count):
        for i in range(vertex_count):
            for j in range(vertex_count):
                dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])

    return dist


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

    # print(distance_matrix)

    city_pairs = []

    for pair in city_permutations:
        origin = pair[0] - 1
        destination = pair[1] - 1
        distance = distance_matrix[origin][destination]
        if distance > 1:
            city_pairs.append(CityPair(source_data[origin], source_data[destination], distance, []))

    print(str(json.dumps(city_pairs, default=vars, ensure_ascii=False)))
