const apiUrl = "."

const loadGame = async () => {
    const response = await fetch(apiUrl + '/game');
    return await response.json();
}

const loadCities = async () => {
    const response = await fetch(apiUrl + '/cities');
    return await response.json();
}

const cities = loadCities();
const gameDetails = loadGame();
const guesses = [];
let guessCount = 0;

const changeVisibilityOfCity = (id) => {
    const style = document.getElementById(id).style.display;
    if (style === "none") {
        document.getElementById(id).style.display = "block";
    } else {
        document.getElementById(id).style.display = "none";
    }
}

const showCity = (id) => {
    const style = document.getElementById(id).style.display;
    if (style === "none") {
        document.getElementById(id).style.display = "block";
    }
}

const initGame = () => {
    gameDetails.then((e) => {
            showCity(e.origin);
            showCity(e.destination);
            guesses.push(e.origin);
            guesses.push(e.destination);
            cities.then((c) => {
                document.getElementById("typed-options").add(
                    new Option(c[e.origin - 1].name)
                );
                document.getElementById("typed-options").add(
                    new Option(c[e.destination - 1].name)
                );
                document.getElementById("daily-game-title").innerText = "Gezenti #" + (parseInt(e.game_id) + 1);
                document.getElementById("daily-game-route").innerText = "Rota: " + c[e.origin - 1].name + " → " + c[e.destination - 1].name;
                document.getElementById("guess-selectbox-info-bar").innerText = "Açılan Şehirler (2/" + (parseInt(e.distance) + 3 + 2) + ")";
            })
        }
    );
}


const guess = (e) => {
    return gameDetails.then((gameDetail) => {
            return cities.then(async (c) => {
                if (guesses.includes(e)) {
                    alert("tekrarli tahmin, baska sehir sec");
                    return false;
                }
                guesses.push(e);
                guessCount++;
                document.getElementById("guess-selectbox-info-bar").innerText = "Açılan Şehirler (" + (guessCount + 2) + "/" + (parseInt(gameDetail.distance) + 3 + 2) + ")";
                showCity(e);
                const result = await doesPathExist(c, gameDetail.origin, gameDetail.destination, guesses);
                if (result) {
                    finishGame(true, guessCount === gameDetail.distance);
                } else {
                    if (guessCount === gameDetail.distance + 3) {
                        finishGame(false, false);
                    }
                }
                return result;
            });
        }
    )
}

const finishGame = (didWin, isOptimal) => {
    if (didWin) {
        setTimeout(() => {
            alert('kazandin');
        }, 250);
    } else {
        setTimeout(() => {
            alert('kaybettin');
        }, 250);
    }

    if (!isOptimal) {
        setTimeout(async () => {
            alert('optimal rota: ' + await getOptimalPathAsString());
        }, 250);
    }

    gameDetails.then((e) => {
            for (let i = 1; i < 82; i++) {
                if (i !== e.origin && i !== e.destination) {
                    showCity(i);
                }
            }
        }
    )

    guesses.forEach((e) => {
            const paths = document.getElementById(e).getElementsByTagName('path');
            [].forEach.call(paths, function (p) {
                    p.style.fill = "#1094F6";
                }
            );
        }
    )
}


const doesPathExist = (graph, origin, destination, allowedNodes) => {
    const visited = new Set();

    const dfs = (node) => {
        visited.add(node);

        if (node === destination) {
            return true;
        }

        for (const neighbor of graph[node - 1].neighbours) {
            if (!visited.has(neighbor) && allowedNodes.includes(neighbor)) {
                if (dfs(neighbor)) {
                    return true;
                }
            }
        }

        return false;
    };

    return dfs(origin);
};

const getCityIdByName = (name) => {
    return cities.then((c) => {
            const candidate = c.filter(x => x.name.toLowerCase() === name.toLowerCase());

            if (candidate.length === 0) {
                alert("Girilen isimde bir şehir mevcut değil");
                return -1;
            }

            return candidate[0].code;
        }
    );
};

const getCityNameById = (cities, id) => {
    return cities[id - 1].name;
};

const getOptimalPathAsString = () => {
    return gameDetails.then((gameDetail) => {
        return cities.then(async (c) => {
            return gameDetail.shortest_path
                .map(x => getCityNameById(c, x))
                .join(" → ");
        });
    });
}
