from city import City


def main():
    return load_cities()


def load_cities():
    cities = []
    with open('cities.txt', 'r') as f:
        cities_map = map(lambda x: x.replace('\n', '').split(','), f.readlines())
        for city in cities_map:
            city = City(city[0], int(city[1]))
            cities.append(city)
    return cities


if __name__ == '__main__':
    main()
