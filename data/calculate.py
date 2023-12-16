from city import City
import json


def get_cities_and_neighbours_list():
    cities = load_cities()
    load_neighbours(cities)
    return cities


def load_cities() -> list:
    cities = []
    with open('cities.txt', 'r') as f:
        cities_map = map(lambda x: x.replace('\n', '').split(','), f.readlines())
        for city in cities_map:
            city = City(city[0], int(city[1]))
            cities.append(city)
    return cities


def load_neighbours(cities: list):
    with open('neighbours.txt', 'r') as f:
        neighbours_map = map(lambda x: x.replace('\n', '').split(','), f.readlines())
        for neighbours in neighbours_map:
            city_name = neighbours[0]
            neighbours_list = neighbours[1:]
            filtered = find_city_by_name(cities, city_name)

            for neighbour_candidate in neighbours_list:
                filtered.add_neighbour(find_city_by_name(cities, neighbour_candidate).code)


def find_city_by_name(cities: list, name: str) -> City:
    return list(filter(lambda x: x.name == name, cities))[0]


if __name__ == '__main__':
    print(str(json.dumps(get_cities_and_neighbours_list(), default=vars, ensure_ascii=False)))
