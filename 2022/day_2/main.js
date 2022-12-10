const fs = require("fs")

const toStandards = {
    "A": "Rock",
    "B": "Paper",
    "C": "Scissors",
    "X": "Rock",
    "Y": "Paper",
    "Z": "Scissors",
}
const toStandardChoices = (line)=> line.split(" ").map(a => toStandards[a])
const roundTotal = ({winPoints, choicePoints}) => winPoints + choicePoints
const getTotalScoreFromAllRounds = (acc, curr) => acc + roundTotal(curr);
const calculateRoundPoints = ([opponentChoice, yourChoice]) => {
    const choicePoints = {
        "Rock": 1,
        "Paper": 2,
        "Scissors": 3,
    }[yourChoice]
    if (opponentChoice === yourChoice) return {winPoints: 3, choicePoints}
    const moves = ["Rock", "Paper", "Scissors"];
    const opponentIndex = moves.findIndex(a => a===opponentChoice)
    const winningMove = moves[(opponentIndex+1) %3]
    if (yourChoice === winningMove) return { winPoints: 6, choicePoints }
    return {winPoints: 0, choicePoints}
}
const part1 = (fileName) => {
    const data = fs.readFileSync(fileName).toString()
    const rounds = data.split("\n").
        map(toStandardChoices).
        map(calculateRoundPoints)
    return rounds.reduce(getTotalScoreFromAllRounds, 0)
};

console.log("part 1", part1("./input.txt"));


const winningMove = (opponentChoice, desiredOutcomeCode) => {
    const moves = ["Rock", "Paper", "Scissors"];
    const desiredMoveIndexOffset = {
        X: 2, //lose
        Y: 0, //draw
        Z: 1,//win
    }
    const opponentMoveIndex = moves.findIndex(a => a === opponentChoice)
    const desiredMoveIndex = (opponentMoveIndex + desiredMoveIndexOffset[desiredOutcomeCode]) % 3;
    return moves[desiredMoveIndex];
};
const parseLineToPlayerChoices = (line) => {
    const [opponentChoiceCode, desiredOutcomeCode] = line.split(" ")
    const opponentChoice = toStandards[opponentChoiceCode];
    return [opponentChoice, winningMove(opponentChoice, desiredOutcomeCode)]
}
const part2 = (fileName) => {
    const data = fs.readFileSync(fileName).toString()
    const rounds = data.split("\n").
        map(parseLineToPlayerChoices).
        map(calculateRoundPoints)
    return rounds.reduce(getTotalScoreFromAllRounds, 0)
}
console.log("part 2 ", part2("./input.txt"));
