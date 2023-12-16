import json
from random import shuffle


def read_from_json():
    with open('permutations.json', 'r') as f:
        permutations = json.load(f)
        shuffle(permutations)
        return permutations


if __name__ == '__main__':
    print(str(json.dumps(read_from_json(), default=vars, ensure_ascii=False)))
