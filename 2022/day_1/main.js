const fs = require("fs")

const data = fs.readFileSync("./input.txt").toString()

const allElvesCalorieCountGroups = data.split("\n\n").map(g => g.split("\n").map(n => parseInt(n)))
const allElvesCalorieCountTotals = allElvesCalorieCountGroups.map(g => g.reduce((acc, curr) => acc+curr, 0)).filter(a=> a)
const maxCalories = Math.max(...allElvesCalorieCountTotals)
console.log("maxCalories:",maxCalories)
const sortedCalories = allElvesCalorieCountTotals.sort((a,b) => b-a)
const sumOfTopThree = sortedCalories.slice(0,3).reduce((acc, curr)=> acc+curr,0);
console.log("sumOfTopThree:",sumOfTopThree)
