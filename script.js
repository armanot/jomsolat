document.addEventListener("DOMContentLoaded", async () => {
    loadThemePreference();
    fetchHijriDate();
    startClock(); // Start updating the clock

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude = position.coords.latitude.toFixed(4);
                const longitude = position.coords.longitude.toFixed(4);

                // Update UI with coordinates
                document.getElementById("location-coordinates").innerText = 
                    `📍 Latitude: ${latitude}, Longitude: ${longitude}`;

                // Fetch and update location and prayer times
                await fetchLocationName(latitude, longitude);
                await fetchPrayerTimes(latitude, longitude);
            },
            () => {
                document.getElementById("location-name").innerText = "❌ Akses lokasi ditolak.";
                document.getElementById("prayer-times").innerText = "⚠️ Tidak dapat memuatkan waktu solat.";
            }
        );
    } else {
        document.getElementById("location-name").innerText = "❌ Pelayar anda tidak menyokong geolokasi.";
    }

    document.getElementById("toggle-theme").addEventListener("click", toggleTheme);
});

// Function to start the real-time clock
function startClock() {
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        document.getElementById("current-time").innerText = `⏰ Waktu Sekarang: ${timeString}`;
    }

    updateClock(); // Initial call
    setInterval(updateClock, 1000); // Update every second
}

// Function to fetch Malaysia-specific prayer times
async function fetchPrayerTimes(lat, lon) {
    const prayerTimesContainer = document.getElementById("prayer-times");
    prayerTimesContainer.innerHTML = `<p>⏳ Memuatkan waktu solat...</p>`;

    try {
        console.log(`Fetching prayer times for: ${lat}, ${lon}`);
        const response = await fetch(`https://mpt.i906.my/api/prayer/${lat},${lon}`);
        
        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

        const data = await response.json();
        if (data?.data) {
            const prayerTimes = processPrayerTimes(data.data);
            displayPrayerTimes(prayerTimes);
        } else {
            prayerTimesContainer.innerText = "⚠️ Tidak dapat mendapatkan waktu solat.";
        }
    } catch (error) {
        console.error("Error fetching prayer times:", error);
        prayerTimesContainer.innerText = "❌ Ralat mendapatkan waktu solat.";
    }
}

// Function to process prayer times from Unix timestamps
function processPrayerTimes(data) {
    const prayerNames = ["Subuh", "Syuruk", "Zohor", "Asar", "Maghrib", "Isyak"];
    
    const today = new Date();
    const todayIndex = today.getDate() - 1; // Get today's index from the API

    if (!data.times || todayIndex < 0 || todayIndex >= data.times.length) {
        console.error("Prayer times data is missing or invalid.");
        return [];
    }

    const timesArray = data.times[todayIndex];

    return prayerNames.map((name, index) => ({
        name,
        time: timesArray[index] 
            ? new Date(timesArray[index] * 1000).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' }) 
            : "N/A"
    }));
}

// Function to display formatted prayer times
function displayPrayerTimes(prayerTimes) {
    const prayerTimesContainer = document.getElementById("prayer-times");
    prayerTimesContainer.innerHTML = "";

    prayerTimes.forEach(({ name, time }) => {
        const prayerElement = document.createElement("div");
        prayerElement.classList.add("prayer");
        prayerElement.innerHTML = `<strong>${name}</strong><br>${time}`;
        prayerElement.style.opacity = 0;
        prayerTimesContainer.appendChild(prayerElement);

        // Fade-in animation
        setTimeout(() => (prayerElement.style.opacity = 1), 300);
    });

    console.log("Displayed prayer times:", prayerTimes);
}

// Function to fetch and display location name using OpenStreetMap API
async function fetchLocationName(lat, lon) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await response.json();

        const city = data?.address?.city || data?.address?.town || data?.address?.village || "Lokasi tidak dikenali";
        const country = data?.address?.country || "Malaysia";
        
        document.getElementById("location-name").innerText = `📍 Lokasi Anda: ${city}, ${country}`;
    } catch (error) {
        console.error("Error fetching location:", error);
        document.getElementById("location-name").innerText = "❌ Gagal mendapatkan nama lokasi.";
    }
}

// Toggle between dark and light mode
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

// Load theme from local storage
function loadThemePreference() {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
}

// Fetch Hijri date and update UI
async function fetchHijriDate() {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    const gregorianDate = `${day}-${month}-${year}`;

    try {
        const response = await fetch(`https://api.aladhan.com/v1/gToH?date=${gregorianDate}`);
        const data = await response.json();

        if (data?.data) {
            document.getElementById("hijri-date").innerText = 
                `${data.data.hijri.day} ${data.data.hijri.month.en} ${data.data.hijri.year}H`;
            document.getElementById("gregorian-date").innerText = 
                `${day} ${getMonthName(month)} ${year}`;
        }
    } catch (error) {
        console.error("Error fetching Hijri date:", error);
        document.getElementById("hijri-date").innerText = "❌ Gagal mendapatkan tarikh Hijrah.";
    }
}

// Get Malay month name
function getMonthName(monthNumber) {
    const monthNames = [
        "Januari", "Februari", "Mac", "April", "Mei", "Jun",
        "Julai", "Ogos", "September", "Oktober", "November", "Disember"
    ];
    return monthNames[parseInt(monthNumber, 10) - 1];
}
