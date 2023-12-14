function GenerateStartScreen(categories) {
    const categoryContainer = document.createElement("div");
    const h1 = document.createElement("h1");
    h1.innerHTML = "Välkommen!";
    h1.classList.add("welcome");
    const h2 = document.createElement("h2");
    categoryContainer.classList.add("category-container");
    h2.innerHTML = "Välj kategori nedan för att spela";
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
    return [categoryContainer, difficultySelection, buttonContainer]
}

function GenerateDifficultySelection() {
    const div = document.createElement("div");
    div.classList.add("difficulty-selection");

    const p = document.createElement("p");
    p.innerHTML = "Välj svårighetsgrad";
    div.appendChild(p);
    const radioDetails = [ {id: "Easy", text: "Lätt"},{id: "Normal", text: "Normal"}, {id: "Hard", text: "Svår"} ];
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