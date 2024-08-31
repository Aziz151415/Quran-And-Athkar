// Function to get the user's location and then update prayer times
function getLocationAndPrayerTimes() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById("city-name").textContent = "Geolocation is not supported by this browser.";
    }
}

// Function to display position and update prayer times
function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Use a reverse geocoding API to get the city name from latitude and longitude
    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
        .then(response => response.json())
        .then(data => {
            const city = data.address.city || data.address.town || data.address.village;
            document.getElementById("city-name").textContent = `المدينة: ${city}`;
            updatePrayerTimes(latitude, longitude);
        })
        .catch(error => {
            document.getElementById("city-name").textContent = "City not found";
            console.error("Error fetching city name:", error);
        });
}

// Function to show error if geolocation fails
function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById("city-name").textContent = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById("city-name").textContent = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            document.getElementById("city-name").textContent = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById("city-name").textContent = "An unknown error occurred.";
            break;
    }
}

// Function to fetch and update prayer times
function updatePrayerTimes(latitude, longitude) {
    const dateElement = document.getElementById('current-date');
    const fajrElement = document.getElementById('fajr-time');
    const dhuhrElement = document.getElementById('dhuhr-time');
    const asrElement = document.getElementById('asr-time');
    const maghribElement = document.getElementById('maghrib-time');
    const ishaElement = document.getElementById('isha-time');
    const sunriseElement = document.getElementById('sunrise-time');
    const sunsetElement = document.getElementById('sunset-time');

    // Fetch prayer times from Aladhan API
    fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`)
        .then(response => response.json())
        .then(data => {
            const timings = data.data.timings;

            // Update the prayer times in the HTML
            fajrElement.textContent = timings.Fajr;
            dhuhrElement.textContent = timings.Dhuhr;
            asrElement.textContent = timings.Asr;
            maghribElement.textContent = timings.Maghrib;
            ishaElement.textContent = timings.Isha;
            sunriseElement.textContent = timings.Sunrise;
            sunsetElement.textContent = timings.Sunset;

            // Update the date in both Arabic and English
            const optionsArabic = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', numberingSystem: 'arab' };
            const optionsEnglish = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const gregorianDateArabic = new Date().toLocaleDateString('ar-EG', optionsArabic);
            const gregorianDateEnglish = new Date().toLocaleDateString('en-US', optionsEnglish);
            const hijriDate = data.data.date.hijri.date;

            dateElement.textContent = `التاريخ الميلادي: ${gregorianDateArabic} | ${gregorianDateEnglish} | التاريخ الهجري: ${hijriDate}`;
        })
        .catch(error => {
            console.error("Error fetching prayer times:", error);
        });
}

// Start by getting the user's location and prayer times
getLocationAndPrayerTimes();

// Function to navigate between Athkar pages
function navigateAthkar(currentIndex) {
    const totalAthkar = 14;
    const nextIndex = currentIndex < totalAthkar ? currentIndex + 1 : 1;
    const prevIndex = currentIndex > 1 ? currentIndex - 1 : totalAthkar;

    document.getElementById('next-button').onclick = () => {
        window.location.href = `athkar_salat_${nextIndex}.html`;
    };

    document.getElementById('prev-button').onclick = () => {
        window.location.href = `athkar_salat_${prevIndex}.html`;
    };
}
