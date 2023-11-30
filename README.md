# The mapmaker
## Description of the game
### Brief overview
In this single-player game, you have to place map elements of different shapes and terrain types on an 11x11 square grid map. Each element is assigned a time value (1 or 2) and the game consists of 28 time units. At the end (or during) of the game, a number of checks (missions) are performed against the current state of the grid, and the final score is calculated.
### Initial state of the map
The map is an 11x11 square grid, initially filled with empty cells. The map contains mountain fields in 5 fixed cells. Our mountains are located in the following cells of the map:
```
(row, column) => (2,2), (4,9), (6,4), (9,10), (10,6)
```
### Placing map elements
The types of terrain of map elements that can be placed are: forest, village, farm and water. The possible elements are shuffled randomly and then you need to place them on the map one by one in sequence. Each map element can be rotated and mirrored, and the map element cannot cover an already reserved field (a mountain is a reserved field), or have any part of it hanging off the map.
### End of the game
The game lasts up to 28 time units. Each map element is assigned a time unit, which determines how long it takes to explore it. You can draw new map elements until you reach 28 time units. When the total time value reaches or exceeds 28 time units, the game ends. For example, if we have 1 time unit left and we get a map element with two time units, we can still place the map element and then the game ends.
### Calculating the score
At the beginning of each game, 4 random mission cards (A,B,C,D) must be selected to score points. At the end of the game, you have to count the points you got for each mission, and the sum of these will be the final score. For each of the four missions, you must also indicate how many points you have received for each mission!
### Seasons
The 28 time units represent one year. It can be divided into 4 seasons, each season lasting up to 7 units of time. If the total time value reaches or exceeds a multiple of 7 while placing the map elements, the season ends.
At the end of each season, you can score for 2 missions. At the end of spring, you can score points for mission A-B, at the end of summer for mission B-C, at the end of autumn for mission C-D and at the end of winter for mission D-A. For each of the four missions, you need to indicate per season how many points you have earned for each mission!
At the end of the game, the points you have earned over the four seasons will be added together to give you your final score.
### Missions
1. Edge of the forest: you get one point for each forest field adjacent to the edge of your map.
2. Sleepy valley: for every row with three forest fields, you get four points.
3. Watering potatoes: You get two points for each water field adjacent to your farm fields.
4. Borderlands: for each full row or column, you get six points.

### Possible map element types
You will find the possible map element types in this array, we have prepared it for you. You have to shuffle it at the beginning of the game and then place it one by one on the map. It is up to you how to do the placing. You could always draw a faint outline of the element you want to place while moving the mouse over the map, but another way is to just click on a cell and it will insert the shape in the given position starting from the top left cell. Objects also have ___rotation___ and ___mirrored___ data properties, so you can store these in the shapes you draw.
