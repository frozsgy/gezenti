const loadGame = async () => {
    const response = await fetch('http://127.0.0.1:5000/game');
    return await response.json();
}

const loadCities = async () => {
    const response = await fetch('http://127.0.0.1:5000/cities');
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
                document.getElementById("daily-game-route").innerText = "Rota: " + c[e.origin - 1].name + " -> " + c[e.destination - 1].name;
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
                showCity(e);
                const result = await doesPathExist(gameDetail.origin, gameDetail.destination, guesses);
                if (result) {
                    finishGame(true);
                } else {
                    if (guessCount === gameDetail.distance + 3) {
                        finishGame(false);
                    }
                }
                return result;
            });
        }
    )
}

const finishGame = (didWin) => {
    if (didWin) {
        setTimeout(() => {
            alert('kazandin');
        }, 250);
    } else {
        setTimeout(() => {
            alert('kaybettin');
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


const doesPathExist = (origin, destination, path) => {
    return cities.then(async (c) => {
            const inbetweenNodes = new Set(path.filter(node => node !== origin && node !== destination));
            if (inbetweenNodes.size === 0) {
                return c[origin - 1]["neighbours"].includes(destination);
            } else {
                const candidates = new Set([...inbetweenNodes].filter(node => c[origin - 1]["neighbours"].includes(node)));
                const responses = await Promise.all(Array.from(candidates).map(node =>
                    doesPathExist(node, destination, [...new Set([...inbetweenNodes].filter(item => item !== node))])
                ));
                return responses.includes(true);
            }
        }
    );
}

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

