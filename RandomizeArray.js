function RandomizeOrder(array) {
    let inputArray = [...array];
    const outputArray = [];
    while (inputArray.length > 0) {
        const randomIdx = Math.floor(Math.random() * inputArray.length)
        outputArray.push(inputArray[randomIdx]);
        inputArray = inputArray.slice(0, randomIdx).concat(inputArray.slice(randomIdx+1));
    }
    return outputArray;

}

export default RandomizeOrder;