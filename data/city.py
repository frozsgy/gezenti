import json


class City:
    name: str
    code: int
    neighbours: list

    def __init__(self, name: str, code: int):
        self.name = name
        self.code = code
        self.neighbours = []

    def __str__(self):
        return f'{self.name}={self.code}, neighbours: {self.neighbours}'

    def add_neighbour(self, neighbour: int):
        self.neighbours.append(neighbour)

    def add_neighbours(self, neighbours: list):
        for neighbour in neighbours:
            self.add_neighbour(neighbour)
