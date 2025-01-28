const API_URL = {
    users: "https://users-service.azurewebsites.net/api/users",
    recommendations: "https://recommendation-service.azurewebsites.net",
};

// Poblar géneros en los combo boxes
document.addEventListener("DOMContentLoaded", async () => {
    const genresSelects = [document.getElementById("reg-genres"), document.getElementById("genres")];
    try {
        const response = await fetch(`${API_URL.recommendations}/genres`);
        const genres = await response.json();

        genres.forEach((genre) => {
            genresSelects.forEach((select) => {
                const option = document.createElement("option");
                option.value = genre.id;
                option.textContent = genre.name;
                select.appendChild(option);
            });
        });
    } catch (error) {
        console.error("Error al cargar géneros:", error);
    }
});

// Registro de usuario
document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("reg-username").value;
    const password = document.getElementById("reg-password").value;
    const genres = Array.from(document.getElementById("reg-genres").selectedOptions).map(opt => opt.value);

    try {
        const response = await fetch(`${API_URL.users}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, genres }),
        });

        const result = await response.json();
        document.getElementById("register-result").innerText = result.message || result.error;
    } catch (error) {
        document.getElementById("register-result").innerText = "Error al registrar.";
    }
});

// Inicio de sesión
document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    try {
        const response = await fetch(`${API_URL.users}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            document.getElementById("login-result").innerText = "Login exitoso.";
            document.getElementById("recommendations").style.display = "block";
        } else {
            document.getElementById("login-result").innerText = "Error de credenciales.";
        }
    } catch (error) {
        document.getElementById("login-result").innerText = "Error al iniciar sesión.";
    }
});

// Buscar recomendaciones
document.getElementById("recommend-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const genres = Array.from(document.getElementById("genres").selectedOptions).map(opt => opt.value);

    try {
        const response = await fetch(`${API_URL.recommendations}/recommendations?genres=${genres.join(",")}`);
        const movies = await response.json();

        const moviesDiv = document.getElementById("movies");
        moviesDiv.innerHTML = "";

        movies.forEach((movie) => {
            const movieDiv = document.createElement("div");
            movieDiv.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                <p><strong>${movie.title}</strong></p>
            `;
            moviesDiv.appendChild(movieDiv);
        });
    } catch (error) {
        document.getElementById("movies").innerText = "Error al obtener películas.";
    }
});
