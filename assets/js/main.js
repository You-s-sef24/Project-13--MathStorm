let questionNumber = 1;
let questions=[];
class User {
    constructor(name, difficulty) {
        this.name = name;
        this.difficulty = difficulty;
        this.score=0;
    }
}

let user;

function RenderHome() {
    document.querySelector('body').innerHTML = `
        <div class="container-fluid p-0">
            <nav class="navbar navbar-expand-sm navbar-light bg-white border">
                <span class="navbar-brand fw-bold ms-3"><i class='bx bx-math'></i> MathStorm</span>
            </nav>
        </div>

        <div class="container mt-5">
            <h3 class="fw-bold text-center">Welcome to MathStorm</h3>
            <p class="text-center text-muted">MathStorm is a fun and fast-paced math quiz app with three levels: Easy, Medium, and Hard. Test your skills in addition, subtraction, multiplication, and division. Can you master all levels and become a math champion?</p>
            <div>
                <div class="w-50 mb-3">
                    <label class="form-label" for="name">Enter Your Name</label>
                    <input type="text" class="form-control" id="name" required>
                </div>
                <div class="w-50 mb-3">
                    <label class="form-label" for="difficulty">Select Difficulty</label>
                    <select name="difficulty" class="form-select" id="difficulty">
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>
                <div class="d-flex justify-content-end">
                    <button class="btn btn-primary start">Start Quiz</button>
                </div>
            </div>
        </div>
    `;

    document.querySelector('.start').addEventListener('click', () => {
        let name=document.getElementById("name").value;
        let diff=document.getElementById("difficulty").value;
        questions = [];
        if(name!=''){
            user = new User(name, diff);
            setTimeout(()=>StartQuiz(user.difficulty),2000);
        }else{
            document.getElementById("name").classList.add('is-invalid');
        }
    });
}
RenderHome();

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(arr, minIndex, maxIndex) {
    let randomIndex = Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex;
    return arr[randomIndex];
}

function GenerateQuestion(difficulty) {
    let num1, num2, operand,correctAnswer,max,min;
    let operators = ['+', '-', '*', '/'];
    if (difficulty === 'Easy') {
        num1 = getRandomInt(2, 14);
        num2 = getRandomInt(2, 14);
        operand = getRandomElement(operators, 0, 1);
    } else if (difficulty === 'Medium') {
        num1 = getRandomInt(5, 18);
        num2 = getRandomInt(5, 18);
        operand = getRandomElement(operators, 0, 2);
    } else {
        num1 = getRandomInt(7, 25);
        num2 = getRandomInt(7, 25);
        operand = getRandomElement(operators, 0, 3);
    }

    if (num1>num2) {
        max=num1;
        min=num2;
    }else{
        max=num2;
        min=num1;
    }

    if (operand === '/') {
        max = min * getRandomInt(2, 10);
    }
    correctAnswer=eval(`${max}${operand}${min}`);

    let options=new Set([correctAnswer]);
    while(options.size<4){
        let num=correctAnswer + getRandomInt(-5,5);
        if (num>0) {
            options.add(num);
        }
    }
    return { max, min, operand, correctAnswer, options:[...options]};
}

function StartQuiz() {
    let question = GenerateQuestion(user.difficulty);
    let correctAnswer=question.correctAnswer;
    let answers=question.options;
    answers.sort((a, b) => a - b);

    document.querySelector('body').innerHTML = `
        <div class="container">
            <div class="stats mt-4">
                <label class="fw-bold text-muted mb-1">Question ${questionNumber}/10</label>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${questionNumber * 10}%;"> </div>
                </div>
            </div>
            <div class="question mt-4">
                <h3 class="fw-bold text-center mb-4">${question.max} ${question.operand} ${question.min} = ?</h3>
                <div class="answers mb-4">
                    ${
                        answers.map((ans,index)=>`
                            <div class="border rounded d-flex align-items-center p-2 mb-2">
                                <input class="form-check-input ms-2" type="radio" name="answer" id="option${index+1}" value="${ans}">
                                <label class="form-check-label ms-3 mb-0 w-100" for="option${index+1}">${ans}</label>
                            </div>
                        `).join('')
                    }
                </div>
                <div class="d-flex justify-content-end">
                    <button class="btn btn-primary submit disabled">Submit Answer</button>
                </div>
            </div>
        </div>
    `;

    let submitButton = document.querySelector('.submit');
    let radioButtons = document.querySelectorAll('input[name="answer"]');

    radioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
            submitButton.classList.remove('disabled');
        });
    });

    document.querySelector('.submit').addEventListener('click', () => {
        let selectedOption = document.querySelector('input[name="answer"]:checked');
        let selectedValue=Number(selectedOption.value);
        let selectedDiv = selectedOption.closest('.border');
        let correctOption = document.querySelector(`input[name="answer"][value="${correctAnswer}"]`);
        let correctDiv = correctOption.closest('.border');

        questions.push({
            max:question.max,
            operand:question.operand,
            min:question.min,
            ans:selectedValue,
            correct:question.correctAnswer
        });

        if (selectedValue===correctAnswer) {
            selectedOption.classList.add('bg-success','border','border-success');
            selectedDiv.classList.add('bg-success','text-white');
            user.score++;
            console.log(user.score);
        }else{
            selectedOption.classList.add('bg-danger','border','border-danger');
            selectedDiv.classList.add('bg-danger','text-white');
            correctDiv.classList.add('bg-success','border','border-success');
            correctDiv.classList.add('bg-success','text-white');
        }
        questionNumber++;
        if(questionNumber<=10){
            setTimeout(StartQuiz,1500);
            document.querySelector('.stats').innerHTML=`
                <label class="fw-bold text-muted mb-1">Question ${questionNumber}/10</label>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${questionNumber * 10}%;"> </div>
                </div>
            `;
        }else{
            setTimeout(RenderScore,1500);
        }
    });
}

function RenderScore(){
    document.querySelector('body').innerHTML = `
        <div class="container">
            <h1 class="fw-bold text-center text-primary mt-5">Quiz Complete</h1>
            <h3 class="fw-bold text-center mt-3">${user.name}, here’s your score!</h3>
            <div class="mt-4">
                <label class="fw-bold text-muted mb-1">${user.score}/10</label>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${user.score*10}%;"> </div>
                </div>
                <label class="fw-bold text-primary mb-1">${user.difficulty}</label>
            </div>
            <p class="text-center text-primary mt-3">You answered ${user.score} out of 10 questions correctly</p>
            <div class="d-flex justify-content-center align-items-center mt-4 gap-3">
                <div class="border rounded w-50 p-2">
                    <div class="d-flex gap-2">
                        <i class='bx bxs-check-circle text-success h3'></i>
                        <h4 class="fw-bold text-success">Correct</h4>
                    </div>
                    <p class="fw-bold text-center text-success h3 m-0">${user.score}</p>
                </div>
                <div class="border rounded w-50 p-2">
                    <div class="d-flex gap-2">
                        <i class='bx bxs-x-circle text-danger h3'></i>
                        <h4 class="fw-bold text-danger">Incorrect</h4>
                    </div>
                    <p class="fw-bold text-center text-danger h3 m-0">${10-user.score}</p>
                </div>
            </div>
            <div class="d-flex justify-content-around gap-3 mt-4">
                <button class="btn btn-primary retake w-50">Retake Quiz</button>
                <button class="btn btn-secondary results w-50">View Detailed Result</button>
            </div>
        </div>
    `;
    document.querySelector('.retake').addEventListener('click',()=>{
        questionNumber=1;
        questions = [];
        user.score=0;
        setTimeout(RenderHome,1000);
    });
    document.querySelector('.results').addEventListener('click',()=>{
        setTimeout(RenderAnswers,1000);
    });
}

function RenderAnswers(){
    document.querySelector('body').innerHTML=`
        <div class="container-fluid p-0">
            <nav class="navbar navbar-expand-sm navbar-light bg-white border">
                <span class="navbar-brand fw-bold ms-3"><i class='bx bx-math'></i> MathStorm</span>
            </nav>
        </div>
    `;
    questions.forEach((question,index)=>{
        document.querySelector('body').innerHTML+=`
            <div class="container">
                <div class="border rounded shadow p-3 my-4">
                    <p class="fw-bold text-primary m-0">Question ${index+1}/10</p>
                    <h3 class="text-center fw-bold mb-3">${question.max} ${question.operand} ${question.min} = ?</h3>
                    <div class="d-flex justify-content-around mb-3">
                    ${ (question.ans===question.correct)
                        ?`<p class="fw-bold text-success m-0">Your Answer: ${question.ans}</p>`
                        :`<p class="fw-bold text-danger m-0">Your Answer: ${question.ans}</p>`
                    }
                        <p class="fw-bold text-success m-0">Correct Answer: ${question.correct}</p>
                    </div>
                    <div class="d-flex justify-content-center gap-1">
                        ${ (question.ans===question.correct)
                            ? `<i class='bx bxs-check-circle text-success h3'></i>
                            <h3 class="fw-bold text-center text-success">Correct</h3>`
                            :`<i class='bx bxs-x-circle text-danger h3'></i>
                            <h3 class="fw-bold text-center text-danger">Incorrect</h3>`
                        }
                    </div>
                </div>
            </div>
        `;
    });
    document.querySelector('body').innerHTML+=`
        <div class="d-flex justify-content-center mb-5">
            <button class="btn btn-primary retake">Retake Quiz</button>
        </div>
    `;

    document.querySelector('.retake').addEventListener('click',()=>{
        questionNumber=1;
        user.score=0;
        questions=[];
        setTimeout(RenderHome,1000);
    });
}