document.addEventListener('DOMContentLoaded', function () {
    const mapSize = 11;
    const fixedCells = [[1, 1], [3, 8], [5, 3], [8, 9], [9, 5]];
    const mapEl = document.getElementById('map');
    const currentElementEl = document.getElementById('currentElement');
    let currentSeasonIndex = 0;
    const seasons = ["spring", "summer", "autumn", "winter"];
    let totalUsedTime = 0;
    let score = 0;
    let countedFullRows = Array(mapSize).fill(false);
    let countedFullColumns = Array(mapSize).fill(false);


    let elements = [
        {
            time: 2,
            type: 'water',
            shape: [[1, 1, 1],
            [0, 0, 0],
            [0, 0, 0]],
            rotation: 0,
            mirrored: false
        },
        // rest of the elements
    ];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function preventDefault(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        const position = event.target.dataset.position.split(',').map(num => parseInt(num));
        placeElement(position);
    }

    function initializeMap() {
        for (let i = 0; i < mapSize; i++) {
            for (let j = 0; j < mapSize; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.position = `${i},${j}`;

                if (fixedCells.some(coord => coord[0] === i && coord[1] === j)) {
                    cell.classList.add('fixed');
                } else {
                    cell.addEventListener('dragover', preventDefault);
                    cell.addEventListener('drop', handleDrop);

                }

                mapEl.appendChild(cell);
            }
        }
    }

    function displayElement(element) {
        currentElementEl.innerHTML = '';

        let shapeColumns = element.shape[0].length;
        let shapeRows = element.shape.length;

        let columnsWithElements = Array(shapeColumns).fill(0);
        let rowsWithElements = Array(shapeRows).fill(0);

        element.shape.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                if (cell === 1) {
                    columnsWithElements[cellIndex] = 1;
                    rowsWithElements[rowIndex] = 1;
                }
            });
        });

        const activeColumns = columnsWithElements.reduce((a, b) => a + b, 0);
        const activeRows = rowsWithElements.reduce((a, b) => a + b, 0);

        currentElementEl.style.gridTemplateColumns = `repeat(${activeColumns}, 30px)`;
        currentElementEl.style.gridTemplateRows = `repeat(${activeRows}, 30px)`;

        const timeLabel = document.getElementById('timeLabel');
        timeLabel.innerHTML = `${element.time} <img src="time_icon.png" alt="Time Icon" class="time-icon">`;

        rowsWithElements.forEach((rowFlag, rowIndex) => {
            if (rowFlag) {
                columnsWithElements.forEach((colFlag, colIndex) => {
                    if (colFlag) {
                        const cellEl = document.createElement('div');
                        cellEl.classList.add('cell');

                        if (element.shape[rowIndex][colIndex]) {
                            cellEl.setAttribute('type', element.type);
                            cellEl.setAttribute('draggable', true);

                            cellEl.addEventListener('dragstart', function (event) {
                                event.dataTransfer.setData('text/plain', JSON.stringify({ elementIndex: currentElementIndex, offsetX: colIndex, offsetY: rowIndex }));
                            });
                        } else {
                            cellEl.style.backgroundColor = 'transparent';
                        }

                        currentElementEl.appendChild(cellEl);
                    }
                });
            }
        });
    }

    function displaySeason() {
        const timeSpentInCurrentSeason = totalUsedTime % 7;

        if (timeSpentInCurrentSeason == 0) {
            document.querySelector(`.${seasons[currentSeasonIndex]}-progress`).textContent = '0';
        } else {
            document.querySelector(`.${seasons[currentSeasonIndex]}-progress`).textContent = timeSpentInCurrentSeason;
        }
    }


    function placeElement(position) {
        console.log("Placing element at position: ", position);

        const element = elements[currentElementIndex];
        console.log("Element to be placed: ", element);

        if (!canPlaceElement(position, element)) {
            console.log("Cannot place element at this position.");
            return;
        }

        element.shape.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                if (cell) {
                    const targetX = position[0] + rowIndex;
                    const targetY = position[1] + cellIndex;

                    if (targetX >= 0 && targetX < mapSize && targetY >= 0 && targetY < mapSize) {
                        const targetCell = mapEl.querySelector(`[data-position='${targetX},${targetY}']`);
                        console.log("Target cell: ", targetCell);

                        if (targetCell && !targetCell.classList.contains('fixed')) {
                            targetCell.setAttribute('type', element.type);
                            console.log("Set type: ", element.type, " for cell: ", targetCell);
                        }
                    }
                }
            });
        });

        currentElementIndex = (currentElementIndex + 1) % elements.length;
        displayElement(elements[currentElementIndex]);

        const timeSpentInCurrentSeason = totalUsedTime % 7;

        totalUsedTime += element.time;

        if (timeSpentInCurrentSeason + element.time > 6 && currentSeasonIndex < 3) {
            currentSeasonIndex++;
        }

        checkBorderlandsMission();

        displaySeason();

        if (totalUsedTime >= 28) {
            console.log("Game Over!");
            document.querySelectorAll('.cell:not(.fixed)').forEach(cell => {
                cell.removeEventListener('dragover', preventDefault);
                cell.removeEventListener('drop', handleDrop);
            });
        }
    }

    function canPlaceElement(position, element) {
        for (let i = 0; i < element.shape.length; i++) {
            for (let j = 0; j < element.shape[i].length; j++) {
                if (element.shape[i][j]) {
                    const targetX = position[0] + i;
                    const targetY = position[1] + j;

                    if (targetX < 0 || targetX >= mapSize || targetY < 0 || targetY >= mapSize) {
                        return false;
                    }

                    const targetCell = mapEl.querySelector(`[data-position='${targetX},${targetY}']`);

                    if (targetCell.classList.contains('fixed') || targetCell.hasAttribute('type')) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    function checkBorderlandsMission() {
        for (let i = 0; i < mapSize; i++) {
            if (countedFullRows[i]) continue;

            let rowIsFull = true;
            for (let j = 0; j < mapSize; j++) {
                const cell = mapEl.querySelector(`[data-position='${i},${j}']`);
                if (!cell.hasAttribute('type') && !cell.classList.contains('fixed')) {
                    rowIsFull = false;
                    break;
                }
            }
            if (rowIsFull) {
                countedFullRows[i] = true;
                score += 6;
            }
        }

        for (let j = 0; j < mapSize; j++) {
            if (countedFullColumns[j]) continue;

            let columnIsFull = true;
            for (let i = 0; i < mapSize; i++) {
                const cell = mapEl.querySelector(`[data-position='${i},${j}']`);
                if (!cell.hasAttribute('type') && !cell.classList.contains('fixed')) {
                    columnIsFull = false;
                    break;
                }
            }
            if (columnIsFull) {
                countedFullColumns[j] = true;
                score += 6;
            }
        }

        // Update score display
        document.getElementById('scoreDisplay').textContent = score;
    }

    shuffle(elements);
    initializeMap();
    currentElementIndex = 0;
    displayElement(elements[currentElementIndex]);
});