function GenerateStartScreen(categories) {
    const categoryContainer = document.createElement("div");
    const h1 = document.createElement("h1");
    h1.innerHTML = "Welcome!";
    h1.classList.add("welcome");
    const h2 = document.createElement("h2");
    categoryContainer.classList.add("category-container");
    h2.innerHTML = "Pick a category below to start playing";
    categoryContainer.appendChild(h1);
    categoryContainer.appendChild(h2);
    
    const difficultySelection = GenerateDifficultySelection();
    
    const buttonContainer = document.createElement("div");
    categories.forEach(category => {
        const button = document.createElement("button");
        button.innerHTML = category;
        button.id = category;
        button.classList.add("buttons");
        buttonContainer.appendChild(button);
    })
    const challengeButton = document.createElement("button");
    challengeButton.textContent = "Ultra secret challenge mode";
    challengeButton.classList.add("challenge-mode-button")
    challengeButton.id = "Secret Challenge";
    return [categoryContainer, difficultySelection, buttonContainer, challengeButton]
}

function GenerateDifficultySelection() {
    const div = document.createElement("div");
    div.classList.add("difficulty-selection");

    const p = document.createElement("p");
    p.innerHTML = "Choose difficulty";
    div.appendChild(p);
    const radioDetails = [ {id: "Easy", text: "Easy"},{id: "Normal", text: "Normal"}, {id: "Hard", text: "Hard"} ];
    for (const details of radioDetails) {
        const radioInput = document.createElement("input");
        radioInput.type = "radio";
        radioInput.name = "difficulty";
        radioInput.id = details.id;
        if (details.id === "Normal") {
            radioInput.checked = true;
        }
        const radioLabel = document.createElement("label");
        radioLabel.htmlFor = details.id;
        radioLabel.innerHTML = details.text;
        div.appendChild(radioInput);
        div.appendChild(radioLabel);
    }
    return div;
}

export default GenerateStartScreen;