import RandomizeOrder from "./randomizeArray.js";

function CreateQuestionElements(questionDetails, currentQuestion, maxQuestions) {
    const questionContainer = document.createElement("div");
    questionContainer.classList.add("question-container");

    const questionCounter = document.createElement("h2");
    questionCounter.classList.add("question-counter");
    questionCounter.innerHTML = `Fråga ${currentQuestion + 1}/${maxQuestions}`;
    questionContainer.appendChild(questionCounter);

    const questionText = document.createElement("p");
    questionText.classList.add("question-text");
    questionText.innerHTML = questionDetails.questionText;
    questionContainer.appendChild(questionText);

    if (questionDetails.type === "image") {
        const img = document.createElement("img");
        img.src = questionDetails.link;
        img.alt = questionDetails.imgDescription;
        questionContainer.appendChild(img);
    }
    const answersRandomOrder = RandomizeOrder(questionDetails.answers)
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
    answersRandomOrder.forEach(answer => {
        const btn = document.createElement("button");
        btn.classList.add("buttons");
        btn.innerHTML = answer;
        if (answer === questionDetails.correct) {
            btn.dataset.correct = "true";
        }
        buttonContainer.appendChild(btn);
    })
    return [questionContainer, buttonContainer];
}

export default CreateQuestionElements;