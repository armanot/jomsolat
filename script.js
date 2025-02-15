document.addEventListener("DOMContentLoaded", async () => {
    loadThemePreference();
    fetchHijriDate();
    startClock(); // Start updating the clock
    // fetchRandomHadith();

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
// Function to fetch and display a random Hadith
// Function to fetch and display a random Hadith using AlQuran Cloud API
// async function fetchRandomHadith() {
//     try {
//         // Use AlQuran Cloud API for random Hadith
//         const response = await fetch(`https://api.alquran.cloud/v1/hadith/bukhari/en`);
//         if (!response.ok) throw new Error("Failed to fetch Hadith.");

//         const data = await response.json();

//         // Extract a random Hadith from the data
//         if (data?.data?.hadiths?.length > 0) {
//             const randomIndex = Math.floor(Math.random() * data.data.hadiths.length);
//             const randomHadith = data.data.hadiths[randomIndex];

//             // Display the Hadith
//             document.getElementById("hadith-text").innerText = `"${randomHadith.body}"`;
//             document.getElementById("hadith-source").innerText = `📖 Sahih Bukhari - Hadith ${randomHadith.number}`;
//         } else {
//             throw new Error("No Hadith found.");
//         }
//     } catch (error) {
//         console.error("Error fetching Hadith:", error);
//         document.getElementById("hadith-text").innerText = "❌ Gagal mendapatkan hadith.";
//         document.getElementById("hadith-source").innerText = "";
//     }
// }

// Call function when page loads
document.addEventListener("DOMContentLoaded", () => {
    loadThemePreference();
    fetchHijriDate();
    // fetchRandomHadith(); // Fetch a random Hadith
    startClock(); // Start updating the clock

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude = position.coords.latitude.toFixed(4);
                const longitude = position.coords.longitude.toFixed(4);

                document.getElementById("location-coordinates").innerText = 
                    `📍 Latitude: ${latitude}, Longitude: ${longitude}`;

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


// Call function when page loads
// document.addEventListener("DOMContentLoaded", fetchRandomHadith);


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
            highlightNearestPrayer(prayerTimes);
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
    const todayIndex = today.getDate() - 1;

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
        prayerElement.classList.add("prayer-time");
        prayerElement.innerHTML = `<strong>${name}</strong><br>${time}`;
        prayerTimesContainer.appendChild(prayerElement);
    });

    highlightNearestPrayer(prayerTimes); // Highlight nearest prayer
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

// Function to highlight the nearest upcoming prayer
function highlightNearestPrayer(prayerTimes) {
    const now = new Date();
    let currentTimeMinutes = now.getHours() * 60 + now.getMinutes(); // Current time in total minutes
    let nearestPrayer = null;
    let minDifference = Number.MAX_VALUE;
    let isNextDayPrayer = false;

    console.log("🔍 Checking nearest prayer...");

    prayerTimes.forEach((prayer) => {
        let prayerTimeFormatted = prayer.time
            .replace("PG", "AM")
            .replace("PTG", "PM")
            .replace("MLM", "PM"); // Convert Malay time format to English

        let timeParts = prayerTimeFormatted.match(/(\d+):(\d+) (AM|PM)/);
        if (!timeParts) {
            console.error(`⛔ Error parsing prayer time: ${prayer.time}`);
            return;
        }

        let hour = parseInt(timeParts[1], 10);
        let minute = parseInt(timeParts[2], 10);
        const period = timeParts[3];

        // Convert to 24-hour format
        if (period === "PM" && hour !== 12) {
            hour += 12;
        } else if (period === "AM" && hour === 12) {
            hour = 0; // Midnight case
        }

        let prayerTimeMinutes = hour * 60 + minute;

        console.log(`🕒 ${prayer.name}: ${hour}:${minute} (${prayerTimeMinutes} min) | Current: ${currentTimeMinutes} min`);

        // If current time is past Isyak, consider the next Subuh as the next prayer
        if (prayerTimeMinutes < currentTimeMinutes) {
            isNextDayPrayer = true; // Mark that we're looking for next-day prayers
            return;
        }

        // Find the nearest upcoming prayer
        if (prayerTimeMinutes > currentTimeMinutes && (prayerTimeMinutes - currentTimeMinutes < minDifference)) {
            minDifference = prayerTimeMinutes - currentTimeMinutes;
            nearestPrayer = prayer;
        }
    });

    // If no upcoming prayer was found, highlight next day's Subuh
    if (!nearestPrayer && isNextDayPrayer) {
        nearestPrayer = prayerTimes[0]; // First prayer (Subuh)
        console.log(`🌙 Switching to next day's Subuh: ${nearestPrayer.name} at ${nearestPrayer.time}`);
    }

    // Remove previous highlights
    document.querySelectorAll(".prayer-time").forEach((element) => {
        element.classList.remove("highlight");
        element.querySelector(".now-badge")?.remove();
    });

    if (nearestPrayer) {
        console.log(`✨ Nearest prayer: ${nearestPrayer.name} (${nearestPrayer.time})`);

        document.querySelectorAll(".prayer-time").forEach((element) => {
            if (element.innerText.includes(nearestPrayer.name)) {
                element.classList.add("highlight");
                if (minDifference <= 15) {
                    const nowBadge = document.createElement("span");
                    nowBadge.classList.add("now-badge");
                    nowBadge.innerText = "🕌 Sekarang";
                    element.appendChild(nowBadge);
                }
            }
        });
    } else {
        console.log("⚠️ No upcoming prayer found.");
    }
}
