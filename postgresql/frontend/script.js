document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = document.getElementById("id").value;
    const name = document.getElementById("name").value;
    const roll = document.getElementById("roll").value;
    const age = document.getElementById("age").value;
    const marks = document.getElementById("marks").value;

    const responseElement = document.getElementById("response");

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, name, roll, age, marks }),
        });

        const result = await response.json();
        if (result.success) {
            responseElement.style.color = "green";
            responseElement.textContent = "Login successful!";
        } else {
            responseElement.style.color = "red";
            responseElement.textContent = "Invalid credentials!";
        }
    } catch (error) {
        responseElement.textContent = "An error occurred. Please try again.";
    }
});
