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
        }
    );
}


const guess = (e) => {
    return gameDetails.then((gameDetail) => {
            return cities.then(async (c) => {
                if (guesses.includes(e)) {
                    console.log("tekrarli tahmin, baska sehir sec");
                    return false;
                }
                guesses.push(e);
                guessCount++;
                changeVisibilityOfCity(e);
                const result = await doesPathExist(gameDetail.origin, gameDetail.destination, guesses);
                if (result) {
                    console.log("yes");
                    finishGame(true);
                } else {
                    if (guessCount === gameDetail.distance + 3) {
                        finishGame(false);
                    }
                    console.log("new guesses " + guesses);
                }
                return result;
            });
        }
    )
}

const finishGame = (didWin) => {
    if (didWin) {
        console.log("kazandin");
    } else {
        console.log("kaybettin");
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
    return cities.then((c) => {
            const inbetweenNodes = new Set(path.filter(node => node !== origin && node !== destination));
            if (inbetweenNodes.size === 0) {
                return c[origin - 1]["neighbours"].includes(destination);
            } else {
                for (const node of inbetweenNodes) {
                    if (c[origin - 1]["neighbours"].includes(node)) {
                        return doesPathExist(node, destination, [...new Set([...inbetweenNodes].filter(item => item !== node))]);
                    }
                }
                return false;
            }
        }
    );
}

const getCityIdByName = (name) => {
    return cities.then((c) => {
            const candidate = c.filter(x => x.name.toLowerCase() === name.toLowerCase());

            if (candidate.length === 0) {
                console.log("Girilen isimde bir şehir mevcut değil");
                return -1;
            }

            return candidate[0].code;
        }
    );

};

