class City:
    name: str
    code: int

    def __init__(self, name: str, code: int):
        self.name = name
        self.code = code

    def __str__(self):
        return f'{self.name}={self.code}'
