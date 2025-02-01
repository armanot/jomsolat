document.addEventListener("DOMContentLoaded", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude.toFixed(4);
            const longitude = position.coords.longitude.toFixed(4);

            // Display coordinates on the page
            document.getElementById("location-coordinates").innerText = 
                `Latitude: ${latitude}, Longitude: ${longitude}`;

            // Fetch location name and prayer times
            await fetchLocationName(latitude, longitude);
            await fetchPrayerTimes(latitude, longitude);
        }, () => {
            document.getElementById("location-name").innerText = "Akses lokasi ditolak.";
        });
    } else {
        document.getElementById("location-name").innerText = "Pelayar anda tidak menyokong geolokasi.";
    }

    document.getElementById("toggle-theme").addEventListener("click", toggleTheme);
});

// Function to fetch Malaysia-specific prayer times
async function fetchPrayerTimes(lat, lon) {
    try {
        console.log(`Fetching prayer times for: ${lat}, ${lon}`);
        const response = await fetch(`https://mpt.i906.my/api/prayer/${lat},${lon}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Prayer time data received:", data);

        if (data && data.data) {
            const prayerTimes = processPrayerTimes(data.data);
            displayPrayerTimes(prayerTimes);
        } else {
            document.getElementById("prayer-times").innerText = "Tidak dapat mendapatkan waktu solat.";
        }
    } catch (error) {
        console.error("Error fetching prayer times:", error);
        document.getElementById("prayer-times").innerText = "Ralat mendapatkan waktu solat.";
    }
}

// Function to process prayer times from Unix timestamps
function processPrayerTimes(data) {
    const prayerNames = ["Subuh", "Syuruk", "Zohor", "Asar", "Maghrib", "Isyak"];
    
    const today = new Date();
    const todayIndex = today.getDate() - 1;  // Get today's index from the API

    if (!data.times || todayIndex < 0 || todayIndex >= data.times.length) {
        console.error("Prayer times data is missing or invalid.");
        return [];
    }

    const timesArray = data.times[todayIndex];

    if (timesArray.length !== prayerNames.length) {
        console.error("Prayer time count mismatch. Expected 7, got:", timesArray.length);
    }

    return prayerNames.map((name, index) => {
        if (index < timesArray.length) {
            const date = new Date(timesArray[index] * 1000);
            const timeStr = date.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' });
            return { name, time: timeStr };
        } else {
            return { name, time: "N/A" };
        }
    });
}


// Function to display formatted prayer times
function displayPrayerTimes(prayerTimes) {
    const prayerTimesContainer = document.getElementById("prayer-times");
    prayerTimesContainer.innerHTML = "";

    prayerTimes.forEach(prayer => {
        const prayerElement = document.createElement("div");
        prayerElement.classList.add("prayer");
        prayerElement.innerHTML = `<strong>${prayer.name}</strong><br>${prayer.time}`;
        prayerTimesContainer.appendChild(prayerElement);
    });

    console.log("Displayed prayer times:", prayerTimes);
}


// Function to fetch and display location name using OpenStreetMap API
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

// Toggle between dark and light mode
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

// Load theme from local storage
function loadThemePreference() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }
}

async function fetchHijriDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const gregorianDate = `${day}-${month}-${year}`;

    try {
        const response = await fetch(`https://api.aladhan.com/v1/gToH?date=${gregorianDate}`);
        const data = await response.json();

        if (data && data.data) {
            document.getElementById("hijri-date").innerText = 
                `${data.data.hijri.day} ${data.data.hijri.month.en} ${data.data.hijri.year}H`;
            document.getElementById("gregorian-date").innerText = 
                `${day} ${getMonthName(month)} ${year}`;
        }
    } catch (error) {
        console.error("Error fetching Hijri date:", error);
        document.getElementById("hijri-date").innerText = "Gagal mendapatkan tarikh Hijrah.";
    }
}

function getMonthName(monthNumber) {
    const monthNames = [
        "Januari", "Februari", "Mac", "April", "Mei", "Jun",
        "Julai", "Ogos", "September", "Oktober", "November", "Disember"
    ];
    return monthNames[parseInt(monthNumber, 10) - 1];
}

fetchHijriDate();




// Initialize page with theme preference
loadThemePreference();
