document.addEventListener('DOMContentLoaded', function () {
    const mapSize = 11;
    const fixedCells = [[1, 1], [3, 8], [5, 3], [8, 9], [9, 5]];
    const mapEl = document.getElementById('map');
    const currentElementEl = document.getElementById('currentElement');

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

    function initializeMap() {
        for (let i = 0; i < mapSize; i++) {
            for (let j = 0; j < mapSize; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.position = `${i},${j}`;

                if (fixedCells.some(coord => coord[0] === i && coord[1] === j)) {
                    cell.classList.add('fixed');
                } else {
                    cell.addEventListener('dragover', function (event) {
                        event.preventDefault();
                    });

                    cell.addEventListener('drop', function (event) {
                        const position = event.target.dataset.position.split(',').map(num => parseInt(num));
                        placeElement(position);
                    });
                }

                mapEl.appendChild(cell);
            }
        }
    }

    function displayElement(element) {
        currentElementEl.innerHTML = '';

        // Find the dimensions of the shape.
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

        // Only render active rows and columns
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


    function placeElement(position) {
        const element = elements[currentElementIndex];

        element.shape.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                if (cell) {
                    const targetCell = mapEl.querySelector(`[data-position='${position[0] + rowIndex},${position[1] + cellIndex}']`);
                    if (targetCell && !targetCell.classList.contains('fixed')) {
                        targetCell.setAttribute('type', element.type);
                    }
                }
            });
        });

        currentElementIndex = (currentElementIndex + 1) % elements.length;
        displayElement(elements[currentElementIndex]);
    }

    shuffle(elements);
    initializeMap();
    currentElementIndex = 0;
    displayElement(elements[currentElementIndex]);
});
