const numberBox = document.querySelector("number");
const questionBox = document.querySelector("question");
const choicesBox = document.querySelector(".choices");
const submitButton = document.querySelector("#submit");
const nextQuestionButton = document.querySelector("#next");
const api = "https://opentdb.com/api.php?amount=10&category=18&type=multiple";
const sampleQuestion = [
    {
        type: "mulitple",
        difficulty: "easy",
        category: "Aise hi",
        question: "Who are you?",
        correct_answer: "Programmer",
        incorrect_answers: [
        "Superhero",
        "Alien",
        "Ninja"
        ]
    }
]

async function getQuestions(){
    try {
        const res = await fetch(api);
        if (!res.ok) {
            throw new Error(`Failed to fetch questions. Status: ${res.status}`);
        }
        const data = await res.json();

        if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
            throw new Error("Invalid data format or empty results.");
        }

        return data.results;
    } catch (error) {
        console.error("Error fetching questions:", error.message);
        return [];
    }
}

function addRightAnswer(choices, rightAnswer) {

    let randomIndex = Math.floor(Math.random() * 4);

    choices.splice(randomIndex, 0, rightAnswer);

    return { choices, randomIndex };
}

function showQuestion(question, choices) {
    questionBox.innerHTML = question;

    let choicesContent = "";

    choices.forEach((choice, index) => {
        choicesContent += `
            <div class="choice">
                <input type="radio" id="choice${index}" name="choice" value="${index}">
                <label for="choice${index}">${choice}</label>
            </div>
        `;
    });

    choicesBox.innerHTML = choicesContent;
}

function sendQuestion(data, questionNumber) {
    numberBox.innerHTML = questionNumber;
    const incorrectChoices = data.incorrect_answers;
    const rightAnswer = data.correct_answer;

    const { choices, randomIndex } = addRightAnswer(incorrectChoices, rightAnswer);
    showQuestion(data.question, choices);


    submitButton.addEventListener("click", () => {
        submitAnswer(randomIndex);
    });

    setListeners();

    return randomIndex;
}

function submitAnswer(rightAnswerIndex) {
    console.log("clicked submit button");
    let selectedChoice = document.querySelector("input:checked");

    console.log(selectedChoice);

    if(selectedChoice) {
        if(selectedChoice.value == Number(rightAnswerIndex)) {
            document.querySelector('body').style.background = "#c6ffc6";
        } else {
            document.querySelector('body').style.background = "#ffb4b4";
        }
        submitButton.classList.add("hidden");
        nextQuestionButton.classList.remove("hidden");
    }
}

function nextQuestion() {
    submitButton.classList.remove("hidden");
    nextQuestionButton.classList.add("hidden");
    document.querySelector('body').style.background = "#fff";

}

function setListeners() {
    let choices = choicesBox.querySelectorAll(".choice");
    choices.forEach((choice) => {
        choice.addEventListener("click", () => {
            let clickedElements = document.querySelectorAll(".clicked");
            clickedElements.forEach((element) => {
                element.classList.remove("clicked");
            })
            if(choice.querySelector("input").checked) {
                choice.querySelector('label').classList.add("clicked");
            }
        })
    })
}

window.addEventListener("DOMContentLoaded", async () => {
    let questionNumber = 1;
    let data = await getQuestions();

    // if(!data) data = sampleQuestion;

    console.log(data);
    let rightAnswerIndex = sendQuestion(data[questionNumber-1], questionNumber);
    questionNumber++;

    setListeners();
    nextQuestionButton.addEventListener("click", () => {
        if(questionNumber === 10) window.location.reload();

        nextQuestion();
        rightAnswerIndex = sendQuestion(data[questionNumber-1], questionNumber);
        questionNumber++;
    });
})