export default class Question {
    constructor(questionText, correct, answers, type = "text", imgDescription = "", link = "") {
        this.questionText = questionText;
        this.correct = correct;
        this.answers = answers;
        this.type = type;
        this.imgDescription;
        this.link = link;
    }
}
