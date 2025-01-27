document.addEventListener("DOMContentLoaded", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            document.getElementById("location").innerText = 
                `Lokasi Anda: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;

            // Fetch prayer times and dates
            const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`);
            const data = await response.json();

            displayPrayerTimes(data.data.timings);
            displayHijriDate(data.data.date.hijri);
            displayGregorianDate(data.data.date.gregorian);
            startPrayerCountdown(data.data.timings);
            saveToLocalStorage(data.data.timings);
        }, () => {
            document.getElementById("location").innerText = "Akses lokasi ditolak.";
        });
    } else {
        document.getElementById("location").innerText = "Pelayar anda tidak menyokong geolokasi.";
    }

    document.getElementById("toggle-theme").addEventListener("click", toggleTheme);
    loadFromLocalStorage();
});

// Display prayer times with translated names
function displayPrayerTimes(times) {
    const prayerTimesContainer = document.getElementById("prayer-times");
    prayerTimesContainer.innerHTML = "";

    for (const [prayer, time] of Object.entries(times)) {
        const prayerElement = document.createElement("div");
        prayerElement.classList.add("prayer");
        prayerElement.innerHTML = `<strong>${translatePrayerName(prayer)}</strong><br>${time}`;
        prayerTimesContainer.appendChild(prayerElement);
    }
}

// Translate prayer names to Bahasa Malaysia
function translatePrayerName(prayer) {
    const translations = {
        "Fajr": "Subuh",
        "Dhuhr": "Zohor",
        "Asr": "Asar",
        "Maghrib": "Maghrib",
        "Isha": "Isyak",
        "Sunrise": "Syuruk",
        "Midnight": "Tengah Malam",
        "Imsak": "Imsak"
    };
    return translations[prayer] || prayer;
}

// Display Hijri date
function displayHijriDate(hijri) {
    document.getElementById("hijri-date").innerText = 
        `${hijri.day} ${hijri.month.en} ${hijri.year}`;
}

// Display Gregorian date
function displayGregorianDate(gregorian) {
    document.getElementById("gregorian-date").innerText = 
        `${gregorian.day} ${gregorian.month.en} ${gregorian.year}`;
}

// Toggle dark/light mode
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

// Save prayer times to local storage
function saveToLocalStorage(data) {
    localStorage.setItem("prayerTimes", JSON.stringify(data));
}

// Load prayer times from local storage
function loadFromLocalStorage() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }
}
