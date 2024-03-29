document.addEventListener('DOMContentLoaded', function () {
    const mapSize = 11;
    const fixedCells = [[1, 1], [3, 8], [5, 3], [8, 9], [9, 5]];
    const mapEl = document.getElementById('map');
    const currentElementEl = document.getElementById('currentElement');
    let currentSeasonIndex = 0;
    let totalUsedTime = 0;
    let forestEdgeCount = 0;
    let borderlandsCount = 0;
    let wateringPotatoesCount = 0;
    const seasons = ["spring", "summer", "autumn", "water"];
    let countedFullRows = Array(mapSize).fill(false);
    let countedFullColumns = Array(mapSize).fill(false);
    let seasonPoints = { spring: 0, summer: 0, autumn: 0, water: 0 };
    const missionsPerSeason = {
        spring: ['borderlands', 'edgeOfTheForest'],
        summer: ['edgeOfTheForest', 'wateringPotatoes'],
        autumn: ['wateringPotatoes', 'sleepyValley'],
        water: ['sleepyValley', 'borderlands']
    };

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
        {
            time: 2,
            type: 'town',
            shape: [[1, 1, 1],
            [0, 0, 0],
            [0, 0, 0]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 1,
            type: 'forest',
            shape: [[1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'farm',
            shape: [[1, 1, 1],
            [0, 0, 1],
            [0, 0, 0]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'forest',
            shape: [[1, 1, 1],
            [0, 0, 1],
            [0, 0, 0]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'town',
            shape: [[1, 1, 1],
            [0, 1, 0],
            [0, 0, 0]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'farm',
            shape: [[1, 1, 1],
            [0, 1, 0],
            [0, 0, 0]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 1,
            type: 'town',
            shape: [[1, 1, 0],
            [1, 0, 0],
            [0, 0, 0]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 1,
            type: 'town',
            shape: [[1, 1, 1],
            [1, 1, 0],
            [0, 0, 0]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 1,
            type: 'farm',
            shape: [[1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 1,
            type: 'farm',
            shape: [[0, 1, 0],
            [1, 1, 1],
            [0, 1, 0]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'water',
            shape: [[1, 1, 1],
            [1, 0, 0],
            [1, 0, 0]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'water',
            shape: [[1, 0, 0],
            [1, 1, 1],
            [1, 0, 0]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'forest',
            shape: [[1, 1, 0],
            [0, 1, 1],
            [0, 0, 1]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'forest',
            shape: [[1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'water',
            shape: [[1, 1, 0],
            [1, 1, 0],
            [0, 0, 0]],
            rotation: 0,
            mirrored: false
        },
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
        const data = JSON.parse(event.dataTransfer.getData('text/plain'));
        const offsetX = data.offsetX;
        const offsetY = data.offsetY;

        const adjustedPosition = [position[0] - offsetY, position[1] - offsetX];
        placeElement(adjustedPosition);
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
        currentElementEl.style.justifyContent = 'center';
        currentElementEl.style.alignItems = 'center';

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
        document.querySelector('.season-progress').textContent = timeSpentInCurrentSeason === 0 ? 7 : timeSpentInCurrentSeason;
        document.querySelector('.season-name').textContent = seasons[currentSeasonIndex];
        document.querySelectorAll('.game-element').forEach(el => {
            el.classList.remove('active-mission');
        });
        missionsPerSeason[seasons[currentSeasonIndex]].forEach(mission => {
            document.querySelector(`#${mission}`).classList.add('active-mission');
        });
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

        const timeSpentBeforeThisElement = totalUsedTime % 7;

        totalUsedTime += element.time;
        document.getElementById("totalTime").innerHTML = "Total time: " + totalUsedTime;

        if (totalUsedTime >= 28) {
            endGame();
            return;
        }

        const timeSpentInCurrentSeason = totalUsedTime % 7;

        if ((timeSpentBeforeThisElement + element.time > 7 || timeSpentInCurrentSeason === 0) && currentSeasonIndex < 3) {
            currentSeasonIndex++;
        }

        checkBorderlandsMission();
        checkEdgeOfTheForestMission();
        checkWateringPotatoesMission();
        checkSleepyValleyMission();
        displayTotalPoints();
        displaySeason();
    }

    function endGame() {
        console.log("Game Over!");
        document.querySelectorAll('.cell:not(.fixed)').forEach(cell => {
            cell.removeEventListener('dragover', preventDefault);
            cell.removeEventListener('drop', handleDrop);
        });
        displayTotalPoints();
        window.alert("GAME OVER! 28 TIME UNITS HAS PASSED");
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

    function rotateMatrix(matrix) {
        const N = matrix.length - 1;
        const result = matrix.map((row, i) =>
            row.map((val, j) => matrix[N - j][i])
        );
        return result;
    }

    function mirrorMatrix(matrix) {
        return matrix.map(row => [...row].reverse());
    }

    function checkBorderlandsMission() {
        if (!missionsPerSeason[seasons[currentSeasonIndex]].includes('borderlands')) {
            return;
        }

        let previousBorderlandsCount = borderlandsCount;

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
                borderlandsCount += 6;
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
                borderlandsCount += 6;
            }
        }

        let pointsEarnedThisPlacement = borderlandsCount - previousBorderlandsCount;
        seasonPoints[seasons[currentSeasonIndex]] += pointsEarnedThisPlacement;
        updateSeasonalPointsDisplay();
        updateMissionScores();
    }

    function checkEdgeOfTheForestMission() {
        if (!missionsPerSeason[seasons[currentSeasonIndex]].includes('edgeOfTheForest')) {
            return;
        }

        let previousForestEdgeCount = forestEdgeCount;

        forestEdgeCount = 0;

        for (let j = 0; j < mapSize; j++) {
            const topCell = mapEl.querySelector(`[data-position='0,${j}']`);
            if (topCell.getAttribute('type') === 'forest') {
                forestEdgeCount++;
            }
        }

        for (let j = 0; j < mapSize; j++) {
            const bottomCell = mapEl.querySelector(`[data-position='${mapSize - 1},${j}']`);
            if (bottomCell.getAttribute('type') === 'forest') {
                forestEdgeCount++;
            }
        }

        for (let i = 1; i < mapSize - 1; i++) {
            const leftCell = mapEl.querySelector(`[data-position='${i},0']`);
            if (leftCell.getAttribute('type') === 'forest') {
                forestEdgeCount++;
            }
        }

        for (let i = 1; i < mapSize - 1; i++) {
            const rightCell = mapEl.querySelector(`[data-position='${i},${mapSize - 1}']`);
            if (rightCell.getAttribute('type') === 'forest') {
                forestEdgeCount++;
            }
        }

        let pointsEarnedThisPlacement = forestEdgeCount - previousForestEdgeCount;
        seasonPoints[seasons[currentSeasonIndex]] += pointsEarnedThisPlacement;
        updateSeasonalPointsDisplay();
        updateMissionScores();
    }

    function checkWateringPotatoesMission() {
        if (!missionsPerSeason[seasons[currentSeasonIndex]].includes('wateringPotatoes')) {
            return;
        }

        let previousWateringPotatoesCount = wateringPotatoesCount;
        let countedWaterCells = new Set();

        wateringPotatoesCount = 0;

        for (let i = 0; i < mapSize; i++) {
            for (let j = 0; j < mapSize; j++) {
                const cell = mapEl.querySelector(`[data-position='${i},${j}']`);
                if (cell.getAttribute('type') === 'farm') {
                    const adjCells = [
                        { cell: mapEl.querySelector(`[data-position='${i - 1},${j}']`), pos: `${i - 1},${j}` },
                        { cell: mapEl.querySelector(`[data-position='${i + 1},${j}']`), pos: `${i + 1},${j}` },
                        { cell: mapEl.querySelector(`[data-position='${i},${j - 1}']`), pos: `${i},${j - 1}` },
                        { cell: mapEl.querySelector(`[data-position='${i},${j + 1}']`), pos: `${i},${j + 1}` }
                    ];
                    adjCells.forEach(({ cell, pos }) => {
                        if (cell && cell.getAttribute('type') === 'water' && !countedWaterCells.has(pos)) {
                            wateringPotatoesCount += 2;
                            countedWaterCells.add(pos);
                        }
                    });
                }
            }
        }

        let pointsEarnedThisPlacement = wateringPotatoesCount - previousWateringPotatoesCount;
        seasonPoints[seasons[currentSeasonIndex]] += pointsEarnedThisPlacement;
        updateSeasonalPointsDisplay();
        updateMissionScores();
    }

    let sleepyValleyCount = 0;

    function checkSleepyValleyMission() {
        if (!missionsPerSeason[seasons[currentSeasonIndex]].includes('sleepyValley')) {
            return;
        }

        let previousSleepyValleyCount = sleepyValleyCount;

        let points = 0;

        for (let i = 0; i < mapSize; i++) {
            let forestCountInRow = 0;

            for (let j = 0; j < mapSize; j++) {
                const cell = mapEl.querySelector(`[data-position='${i},${j}']`);
                if (cell.getAttribute('type') === 'forest') {
                    forestCountInRow++;
                }
            }

            if (forestCountInRow === 3) {
                points += 4;
            }
        }

        sleepyValleyCount = points;

        let pointsEarnedThisPlacement = sleepyValleyCount - previousSleepyValleyCount;
        seasonPoints[seasons[currentSeasonIndex]] += pointsEarnedThisPlacement;
        updateSeasonalPointsDisplay();
        updateMissionScores();
    }

    function updateSeasonalPointsDisplay() {
        for (const season in seasonPoints) {
            document.getElementById(`points-${season}`).textContent = `${seasonPoints[season]} points`;
        }
    }

    function updateMissionScores() {
        const missionsEls = document.querySelectorAll('.game-element .score');
        if (missionsEls && missionsEls.length) {
            missionsEls[0].textContent = `(${borderlandsCount} points)`;
            missionsEls[1].textContent = `(${forestEdgeCount} points)`;
            missionsEls[2].textContent = `(${wateringPotatoesCount} points)`;
            missionsEls[3].textContent = `(${sleepyValleyCount} points)`;
        }
    }

    function displayTotalPoints() {
        const totalPts = borderlandsCount + forestEdgeCount + wateringPotatoesCount + sleepyValleyCount;
        document.getElementById("totalPoints").textContent = `Total Points: ${totalPts}`;
    }

    document.getElementById('rotateButton').addEventListener('click', function () {
        elements[currentElementIndex].shape = rotateMatrix(elements[currentElementIndex].shape);
        displayElement(elements[currentElementIndex]);
    });

    document.getElementById('mirrorButton').addEventListener('click', function () {
        if (!elements[currentElementIndex].mirrored) {
            elements[currentElementIndex].shape = mirrorMatrix(elements[currentElementIndex].shape);
            elements[currentElementIndex].mirrored = true;
        } else {
            elements[currentElementIndex].mirrored = false;
            elements[currentElementIndex].shape = mirrorMatrix(elements[currentElementIndex].shape);
        }
        displayElement(elements[currentElementIndex]);
    });

    shuffle(elements);
    initializeMap();
    currentElementIndex = 0;
    displayElement(elements[currentElementIndex]);
});