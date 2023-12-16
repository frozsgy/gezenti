from city import City


class CityPair:
    origin: City
    destination: City
    distance: int
    shortest_path: list

    def __init__(self, origin: City, destination: City, distance: int, shortest_path: list):
        self.origin = origin
        self.destination = destination
        self.distance = distance
        self.shortest_path = shortest_path

    def __str__(self):
        return f"{self.origin}->{self.destination}, distance: {self.distance}"
