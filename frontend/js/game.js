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
let guesses = [];
let guessCount = 0;

const showCity = (id) => {
    const style = document.getElementById(id).style.display;
    if (style === "none") {
        document.getElementById(id).style.display = "block";
    }
}

const getCurrentDateAsString = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

const initPage = () => {
    initGame();
    const gezentiData = localStorage.getItem("gezenti");
    if (gezentiData !== null) {
        const gezentiDataAsObject = JSON.parse(gezentiData)
        if (gezentiDataAsObject["last_played_game"] === getCurrentDateAsString()) {
            guesses = gezentiDataAsObject["guesses"];
            guessCount = gezentiDataAsObject["guess_count"];
            document.getElementById("autoComplete").disabled = true;

            gameDetails.then((gameDetail) => {
                    cities.then((c) => {
                            document.getElementById("guess-selectbox-info-bar").innerText = "Açılan Şehirler (" + (guessCount + 2) + "/" + (parseInt(gameDetail.distance) + 2) + ")";
                            for (let i = 1; i < 82; i++) {
                                if (i !== gameDetail.origin && i !== gameDetail.destination) {
                                    showCity(i);
                                }
                            }

                            guesses.forEach((e) => {
                                    const paths = document.getElementById(e).getElementsByTagName('path');
                                    [].forEach.call(paths, function (p) {
                                            p.style.fill = "#1094F6";
                                        }
                                    );
                                    if (e !== gameDetail.origin && e !== gameDetail.destination) {
                                        document.getElementById("typed-options").add(
                                            new Option(getCityNameById(c, e))
                                        );
                                    }

                                }
                            )

                        }
                    )
                }
            )
        }
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
                document.getElementById("guess-selectbox-info-bar").innerText = "Açılan Şehirler (2/" + (parseInt(e.distance) + 2) + ")";
            })
        }
    );
}


const guess = (e) => {
    return gameDetails.then((gameDetail) => {
            return cities.then(async (c) => {
                if (guesses.includes(e)) {
                    displayModal("Hata", "Seçtiğiniz şehri daha önce tahmin ettiniz, yeni şehir seçin");
                    return false;
                }
                guesses.push(e);
                guessCount++;
                document.getElementById("guess-selectbox-info-bar").innerText = "Açılan Şehirler (" + (guessCount + 2) + "/" + (parseInt(gameDetail.distance) + 2) + ")";
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

const finishGame = async (didWin, isOptimal) => {
    const gezentiData = {
        'last_played_game': getCurrentDateAsString(),
        'did_win': didWin,
        'guesses': guesses,
        'guess_count': guessCount,
    };
    localStorage.setItem("gezenti", JSON.stringify(gezentiData));
    const optimalRoute = await getOptimalPathAsString();

    if (didWin) {
        let winContent = "";
        if (!isOptimal) {
            winContent = "Ancak seçtiğiniz rotadan daha kısa bir çözüm mevcut: " + optimalRoute;
        } else {
            winContent = "Seçtiğiniz rota en optimal çözümlerden biri!"
        }
        displayModal("Kazandınız!", winContent);
    } else {
        displayModal("Kaybettiniz!", "İdeal çözüm: " + optimalRoute);
    }

    document.getElementById("autoComplete").disabled = true;

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
                displayModal("Hata", "Girilen isimde bir şehir mevcut değil");
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

const displayModal = (title, content) => {
    document.getElementById("modal-title").innerHTML = title;
    document.getElementById("modal-content").innerHTML = content;
    displayModalByContentId("warning-modal");
}

const displayModalByContentId = (id) => {
    gameModal.setContent(document.getElementById(id).innerHTML);
    gameModal.open();
}