document.addEventListener("DOMContentLoaded", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude.toFixed(4);
            const longitude = position.coords.longitude.toFixed(4);

            // Display latitude and longitude
            document.getElementById("location-coordinates").innerText = 
                `Latitude: ${latitude}, Longitude: ${longitude}`;

            // Fetch and display location name
            await fetchLocationName(latitude, longitude);

            // Fetch prayer times
            const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`);
            const data = await response.json();

            displayPrayerTimes(data.data.timings);
            displayHijriDate(data.data.date.hijri);
            displayGregorianDate(data.data.date.gregorian);
            startPrayerCountdown(data.data.timings);
        }, () => {
            document.getElementById("location-name").innerText = "Akses lokasi ditolak.";
        });
    } else {
        document.getElementById("location-name").innerText = "Pelayar anda tidak menyokong geolokasi.";
    }

    document.getElementById("toggle-theme").addEventListener("click", toggleTheme);
});

// Function to get location name using OpenStreetMap API
async function fetchLocationName(lat, lon) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await response.json();
        document.getElementById("location-name").innerText = 
            `Lokasi Anda: ${data.address.city || data.address.town || data.address.village}, ${data.address.country}`;
    } catch (error) {
        document.getElementById("location-name").innerText = "Gagal mendapatkan nama lokasi.";
    }
}

// Display prayer times
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
    document.getElementById("hijri-date").innerText = `${hijri.day} ${hijri.month.en} ${hijri.year}`;
}

// Display Gregorian date
function displayGregorianDate(gregorian) {
    document.getElementById("gregorian-date").innerText = `${gregorian.day} ${gregorian.month.en} ${gregorian.year}`;
}

// Toggle dark mode
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}
