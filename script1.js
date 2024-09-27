function submitQuiz() {
    let score = 0;

    // Math section
    const q1Answer = document.querySelector('input[name="q1"]:checked');
    const q2Answer = document.querySelector('input[name="q2"]:checked');

    // Question 1: 3 + 2 = 5
    if (q1Answer && q1Answer.value === "B") {
        score++;
    }

    // Question 2: 5 - 3 = 2
    if (q2Answer && q2Answer.value === "B") {
        score++;
    }

    // English section
    const q3Answer = document.querySelector('input[name="q3"]:checked');
    const q4Answer = document.querySelector('input[name="q4"]:checked');

    // Question 3: Apple is a fruit
    if (q3Answer && q3Answer.value === "B") {
        score++;
    }

    // Question 4: The sky is blue
    if (q4Answer && q4Answer.value === "B") {
        score++;
    }

    // Science section
    const q5Answer = document.querySelector('input[name="q5"]:checked');
    const q6Answer = document.querySelector('input[name="q6"]:checked');

    // Question 5: Tree is a plant
    if (q5Answer && q5Answer.value === "C") {
        score++;
    }

    // Question 6: Lion is an animal
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
