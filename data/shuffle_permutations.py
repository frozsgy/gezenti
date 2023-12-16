import json
from random import shuffle


def read_from_json():
    with open('permutations.json', 'r') as f:
        permutations = json.load(f)
        shuffle(permutations)
        return permutations


if __name__ == '__main__':
    print(read_from_json())
