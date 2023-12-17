import json
from random import shuffle


class Game:
    cities = []
    games = []

    def load_cities(self):
        with open('cities.json', 'r') as f:
            self.cities = json.load(f)

    def load_permutations(self):
        with open('permutations_shuffled.json', 'r') as f:
            permutations = json.load(f)
            # shuffle(permutations)
            self.games = permutations

    def __init__(self):
        self.load_cities()
        self.load_permutations()

    def get_city_name_by_id(self, id: int):
        return self.cities[id]["name"]

    def get_city_id_by_name(self, name: str):
        # TODO -- fails for capital i, such as izmir
        candidate = list(filter(lambda x: x["name"] == name.lower().capitalize(), self.cities))
        if not candidate:
            raise Exception("Girilen isimde bir şehir mevcut değil")
        return candidate[0]["code"]

    def get_city_neigbours_by_id(self, id: int):
        return self.cities[id]["neighbours"]

    def get_game(self, game_number: int = 0):
        if game_number >= len(self.games):
            print(f"Seçebileceğiniz maksimum oyun numarası {len(self.games) - 1}, rastgele oyun yükleniyor...")
            return self.games[game_number % (len(self.games) - 1)]
        return self.games[game_number]

    def get_shortest_path_as_string(self, game_number: int = 0):
        return " -> ".join(
            map(self.get_city_name_by_id, map(lambda x: x - 1, self.games[game_number]["shortest_path"])))

    def does_path_exist(self, origin: int, destination: int, path: list) -> bool:
        inbetween_nodes = set(path) - {origin, destination}
        if len(inbetween_nodes) == 0:
            return destination in self.cities[origin - 1]["neighbours"]
        else:
            # TODO -- optimize this by avoiding visiting nodes that are already visited
            candidates = set(inbetween_nodes).intersection(self.cities[origin - 1]["neighbours"])
            responses = map(lambda node: self.does_path_exist(node, destination, list(set(inbetween_nodes) - {node})), candidates)
            return True in responses

    def play(self):
        game_number = int(input(f'Oyun numarası giriniz: '))

        game_round = game.get_game(game_number)

        print(f'Başlangıç şehri: {game.get_city_name_by_id(game_round["origin"] - 1)}')
        print(f'Varılacak şehir: {game.get_city_name_by_id(game_round["destination"] - 1)}')
        print(f'En kısa mesafe : {game_round["distance"]}')

        i = 0
        guesses = [game_round["origin"], game_round["destination"]]

        did_win = False

        while i < game_round["distance"] + 3:
            next_city = input("Sıradaki şehir: ")

            try:
                next_city_id = int(next_city)
            except ValueError:
                try:
                    next_city_id = game.get_city_id_by_name(next_city)
                except Exception:
                    print(f'{next_city} isminde bir şehir mevcut değil')
                    continue

            if next_city_id not in guesses:
                guesses.append(next_city_id)
            else:
                print(f'{next_city} şehrini daha önce tahmin ettiniz, başka bir şehir deneyin')
                continue

            if game.does_path_exist(game_round["origin"], game_round["destination"], guesses):
                did_win = True
                break
            i += 1

        if did_win:
            print(f'Rota tamamlandı!')
            print(f'Tahmin sayınız: {i + 1}')
            if i + 1 != game_round["distance"]:
                print(f'En kısa yol: {game.get_shortest_path_as_string(game_number)}')
        else:
            print(f'Tahmin haklarınız bitti :(')
            print(f'En kısa yol: {game.get_shortest_path_as_string(game_number)}')


if __name__ == "__main__":
    game = Game()

    while True:
        game.play()
