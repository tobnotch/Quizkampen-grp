export default class Question {
    constructor(questionText, correct, answers, type = "text", link = 0) {
        this.questionText = questionText;
        this.correct = correct;
        this.answers = answers;
        this.type = type;
        this.link = link;
    }
}
