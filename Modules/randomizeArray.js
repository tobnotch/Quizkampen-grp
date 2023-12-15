function RandomizeOrder(array) {
    let inputArray = array.slice();
    const outputArray = [];
    while (inputArray.length > 0) {
        const randomIdx = Math.floor(Math.random() * inputArray.length)
        outputArray.push(inputArray[randomIdx]);
        inputArray = inputArray.slice(0, randomIdx).concat(inputArray.slice(randomIdx+1));
        console.log(inputArray, outputArray);
    }
    
    console.log(inputArray, outputArray);
    return outputArray;

}

export default RandomizeOrder;