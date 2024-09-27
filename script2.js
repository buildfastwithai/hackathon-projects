function submitQuiz() {
    let score = 0;

    // English section
    const q1Answer = document.querySelector('input[name="q1"]:checked');
    const q2Answer = document.querySelector('input[name="q2"]:checked');

    // Question 1: "Ball" starts with "buh" sound
    if (q1Answer && q1Answer.value === "B") {
        score++;
    }

    // Question 2: Apple is something you eat
    if (q2Answer && q2Answer.value === "B") {
        score++;
    }

    // Math section
    const q3Answer = document.querySelector('input[name="q3"]:checked');
    const q4Answer = document.querySelector('input[name="q4"]:checked');

    // Question 3: 245 + 132 = 377
    if (q3Answer && q3Answer.value === "A") {
        score++;
    }

    // Question 4: 500 - 275 = 225
    if (q4Answer && q4Answer.value === "A") {
        score++;
    }

    // Science section
    const q5Answer = document.querySelector('input[name="q5"]:checked');
    const q6Answer = document.querySelector('input[name="q6"]:checked');

    // Question 5: Water helps plants grow
    if (q5Answer && q5Answer.value === "A") {
        score++;
    }

    // Question 6: Humans need oxygen to breathe
    if (q6Answer && q6Answer.value === "B") {
        score++;
    }

    // Display the result
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `You got ${score} out of 6 correct!`;

    if (score === 6) {
        resultElement.style.color = 'green';
    } else {
        resultElement.style.color = 'red';
    }
}
