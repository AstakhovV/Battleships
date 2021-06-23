let view = {
    displayMessage: function (mes) {
        let messageArea = document.getElementById('messageArea')
        messageArea.innerHTML = mes
    },
    displayHit: function (location) {
        let cell = document.getElementById(location)
        cell.setAttribute('class', 'hit')
    },
    displayMiss: function (location) {
        let cell = document.getElementById(location)
        cell.setAttribute('class', 'miss')
    }
}

let model = {
    boardSize: 7,
    numShips: 0,
    shipsSunk: 0,
    shipLength: 3,
    ships: [
        {locations: [0, 0, 0], hits: ['', '', '']},
        {locations: [0, 0, 0], hits: ['', '', '']},
        {locations: [0, 0, 0], hits: ['', '', '']},
        {locations: [0, 0, 0], hits: ['', '', '']}
    ],
    fire: function (guess) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i]
            let index = ship.locations.indexOf(guess)
            if (ship.hits[index] === "hit") {
                view.displayMessage("Упс, вы уже попадали в эту локацию!");
                return true;
            } else if (index >= 0) {
                ship.hits[index] = 'hit'
                view.displayHit(guess)
                view.displayMessage('Попадание!')
                if (this.isSunk(ship)) {
                    view.displayMessage('Флот потоплен!')
                    this.shipsSunk++
                    informationShips.innerHTML = `Потоплено кораблей: <span class="primary">${model.shipsSunk}</span> из <span class="primary">${model.numShips}</span> `
                }
                return true
            }
        }
        view.displayMiss(guess)
        view.displayMessage('Промах.')
        return false
    },
    isSunk: function (ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== 'hit') {
                return false
            }
        }
        return true
    },
    generateShipLocations: function () {
        let locations
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip()
            } while (this.collision(locations))
            this.ships[i].locations = locations
        }
    },
    generateShip: function () {
        let direction = Math.floor(Math.random() * 2)
        let row, col
        if (direction === 1) { // horizontal
            row = Math.floor(Math.random() * this.boardSize)
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength))
        } else { // vertical
            col = Math.floor(Math.random() * this.boardSize)
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength))
        }
        let newShipLocations = []
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + '' + (col + i))
            } else {
                newShipLocations.push((row + i) + '' + col)
            }
        }
        return newShipLocations
    },
    collision: function (locations) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i]
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true
                }
            }
        }
        return false
    }
}

let controller = {
    guesses: 0,
    processGuess: function (guess) {
        let location = guess
        if (location) {
            this.guesses++
            let hit = model.fire(location)
            if (hit && model.shipsSunk === model.numShips) {
                finishGame ()
            }
        }
    }
}

function init() {
    model.generateShipLocations()
}

const startBtn = document.querySelector('#start');
const screens = document.querySelectorAll('.screen')
const difficultyList = document.querySelector('#difficulty-list');
const difficultyBtn = document.querySelectorAll('.difficulty-btn');
const informationShips = document.getElementById('informationShips')
const informationDifficulty = document.getElementById('informationDifficulty')
const canvasFireworks = document.getElementById('fireworks-canvas')
const tableTd = document.getElementsByTagName('td')

startBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    screens[0].classList.add('up')
})
difficultyList.addEventListener('click', (e) => {
    if (e.target.classList.contains('difficulty-btn')) {
        model.numShips = parseInt(e.target.getAttribute('data-time'))
        screens[1].classList.add('up');
        init()
        informationShips.innerHTML = `Потоплено кораблей: <span class="primary">${model.shipsSunk}</span> из <span class="primary">${model.numShips}</span> `
    }
})

for (let i=0; i < tableTd.length; i++){
    tableTd[i].addEventListener('click', clickTable)
}
function clickTable(e) {
    let element = e.target.id
    controller.processGuess(element)
}


function resetGame() {
    window.location.reload()
}

function finishGame (){
    board.removeAttribute('class')
    board.innerHTML = `<h1>Вы потопили
 <span class="primary">${model.numShips}</span>
   корабля за <span class="primary">${controller.guesses}</span> ходов</h1><hr><button class="reset-btn" onclick="resetGame()">Начать заново</button>`;
    canvasFireworks.classList.remove('deactive')
    fireworkStart()
}

for (let i = 0; i < difficultyBtn.length; i++) {
    difficultyBtn[i].addEventListener('mouseover', increaseSize)
    difficultyBtn[i].addEventListener('mouseleave', decreaseSize)
}

function increaseSize(e) {
    size = parseInt(e.target.getAttribute('data-time'))
    informationDifficulty.style.width = `${size * 90}px`

}
function decreaseSize() {
    informationDifficulty.style.width = `0px`
}