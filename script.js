async function updateWeather() {
        navigator.geolocation.getCurrentPosition(async (position) => {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const url =
                `https://api.open-meteo.com/v1/forecast` +
                `?latitude=${lat}&longitude=${lon}` +
                `&current=temperature_2m,is_day,weather_code` +
                `&timezone=auto`;

            const res = await fetch(url);
            const data = await res.json();

            const temp = data.current.temperature_2m;
            const isDay = Number(data.current.is_day);
            const weatherCode = data.current.weather_code;

            const getDay = document.querySelector(".app");
            const starEl = document.querySelector(".big-star");
            const weatherContent = document.getElementById("weather-content");
            const tempEl = document.getElementById("temperature");
            const cloudsEL = document.querySelectorAll(".clouds-1, .clouds-2");
            const blurEL = document.querySelector(".blur");
            const treeEl = document.querySelectorAll(".tree");
            const weatherEl = document.querySelector(".weather-condition");
            
            switch (isDay) {
                case 0:
                    getDay.style.background = "#1C1C6B";
                    starEl.style.background = "url(assets/moon.png)";
                    break;
                
                case 1:
                    getDay.style.background = "#c3efff";
                    starEl.style.background = "url(assets/sun.png)";
                    break;
                default:
                    break;
            }

            let weatherDesc;
            switch (weatherCode) {
                case 0: 
                    weatherDesc =  "Clear Sky";
                    for (const cloud of cloudsEL) {
                        cloud.style.display = "none";
                    }
                    for (const tree of treeEl) {
                        tree.style.background = "url(assets/tree.png)";
                    }
                    break;
                case 1:
                case 2:
                case 3: 
                    weatherDesc = "Cloudy";
                    for (const cloud of cloudsEL) {
                        cloud.style.display = "block";
                    }
                    for (const tree of treeEl) {
                        tree.style.background = "url(assets/tree.png)";
                    }
                    break;
                case 45:
                case 48: 
                    weatherDesc = "Fog";
                    blurEL.style.background = "rgba(113, 135, 152, 0.5)";
                    for (const cloud of cloudsEL) {
                        cloud.style.display = "block";
                    }
                    for (const tree of treeEl) {
                        tree.style.background = "url(assets/tree.png)";
                    }
                    break;
                case 61:
                case 63:
                case 65: 
                    weatherDesc = "Rain";
                    for (const cloud of cloudsEL) {
                        cloud.style.display = "block";
                    }
                    for (const tree of treeEl) {
                        tree.style.background = "url(assets/tree-rain.png)";
                    }
                    weatherEl.style.background = "url(assets/rain.png)";
                    weatherEl.style.animationDuration =  "0.2s";
                    
                    break;
                case 71:
                case 73:
                case 75: 
                    weatherDesc = "Snow";
                    for (const cloud of cloudsEL) {
                        cloud.style.display = "block";
                    }
                    for (const tree of treeEl) {
                        tree.style.background = "url(assets/tree-snow.png)";
                    }
                    weatherEl.style.background = "url(assets/snow.png)";
                    weatherEl.style.animationDuration =  "0.5s";
                    break;
                default: 
                    weatherDesc = "Unknown";
                    break;
            }
            tempEl.textContent = `${temp}°C`;
            weatherContent.textContent = `It's ${weatherDesc} Today!`;
        }
    );
}

function calender() {
    const today = new Date();
    const day = today.getDate();
    const months = ["January", "February", "March", "April", "May",
        "June", "July", "August", "September", "October", 
        "November", "December"]
    const month = months[today.getMonth()];
    const ending = getDayEnding(day);
    const dayEl = document.getElementById("day");
    dayEl.textContent = `${day}${ending}`;
    const monthEl = document.getElementById("month")
    monthEl.textContent = month;
}

function getDayEnding(day) {
    if (day >= 11 && day <= 13) {
        return "th";
    }

    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

function scheduleMidnightUpdate() {
    const now = new Date();

    const tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, 0, 0, 0, 0
    )

    const msUntilMidnight = tomorrow - now;
    setTimeout(() => {calender(); scheduleMidnightUpdate();}, msUntilMidnight);
}

function updateTime() {
    const now = new Date();
    const time = now.toLocaleTimeString();
    const timeEl = document.getElementById("time");
    timeEl.textContent = time;
}

calender();
scheduleMidnightUpdate();
updateTime();
setInterval(updateTime, 1000);
updateWeather();
setInterval(updateWeather, 30000);