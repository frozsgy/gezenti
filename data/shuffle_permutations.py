import json
from random import shuffle


def read_from_json():
    with open('permutations.json', 'r') as f:
        permutations = json.load(f)
        shuffle(permutations)
        return permutations


def read_from_json_while_preserving_original_order():
    response = []
    with open('permutations.json', 'r') as f:
        permutations = json.load(f)
        with open('permutations_shuffled.json.old', 'r') as fs:
            shuffled_permutations = json.load(fs)

            for entry in shuffled_permutations:
                origin = entry['origin']
                destination = entry['destination']

                q = next(x for x in permutations if x['origin'] == origin and x['destination'] == destination)
                response.append(q)

        return response

if __name__ == '__main__':
    print(str(json.dumps(read_from_json_while_preserving_original_order(), default=vars, ensure_ascii=False)))
