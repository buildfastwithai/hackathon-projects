function submitQuiz() {
    let score = 0;

    // English section
    const q1Answer = document.querySelector('input[name="q1"]:checked');
    const q2Answer = document.querySelector('input[name="q2"]:checked');

    // Question 1: "run" is a verb
    if (q1Answer && q1Answer.value === "B") {
        score++;
    }

    // Question 2: The cat is on the sofa
    if (q2Answer && q2Answer.value === "B") {
        score++;
    }

    // Math section
    const q3Answer = document.querySelector('input[name="q3"]:checked');
    const q4Answer = document.querySelector('input[name="q4"]:checked');

    // Question 3: 6 x 4 = 24
    if (q3Answer && q3Answer.value === "B") {
        score++;
    }

    // Question 4: 12 ÷ 3 = 4
    if (q4Answer && q4Answer.value === "A") {
        score++;
    }

    // Science section
    const q5Answer = document.querySelector('input[name="q5"]:checked');
    const q6Answer = document.querySelector('input[name="q6"]:checked');

    // Question 5: Eyes are used for seeing
    if (q5Answer && q5Answer.value === "B") {
        score++;
    }

    // Question 6: The heart pumps blood
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
