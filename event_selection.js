const firebaseConfig = {
    apiKey: "AIzaSyDKbitwgQax-642jBB3VW221hgtIEBHag4",
    authDomain: "movieticket-93217.firebaseapp.com",
    databaseURL: "https://movieticket-93217-default-rtdb.firebaseio.com",
    projectId: "movieticket-93217",
    storageBucket: "movieticket-93217.firebasestorage.app",
    messagingSenderId: "1089839481398",
    appId: "1:1089839481398:web:d0253f153f6c9b601b0e97"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const seatContainer = document.getElementById("seat-container");
const totalSeats = 20;
let selectedSeats = [];
const pricePerSeat = 20;
const movieSelect = document.getElementById("movie");
const timeSelect = document.getElementById("time");
const dateSelect = document.getElementById("date");

function createSeats () {
    seatContainer.innerHTML = "";
    selectedSeats = [];
    for (let i = 1; i <= totalSeats; i++) {
        const seat = document.createElement("button");
        seat.id = `seat-${i}`;
        seat.innerText = i;
        seat.classList.add("seat");
        seat.addEventListener("click", handleSeatClick);
        seatContainer.appendChild(seat)
    }
}

function loadBookedSeats() {
    const path = `bookings/${movieSelect.value}/${timeSelect.value}/${dateSelect.value}`;
    db.ref(path).once("value", snapshot => {
        const booked = snapshot.val();
        if (booked) {
            Object.keys(booked).forEach(seatId => {
                const seat = document.getElementById(seatId);
                if (seat) {
                    seat.classList.add("booked");
                    seat.disabled = true;
                    seat.removeEventListener("click", handleSeatClick);
                }
            });
        }
    });
}

function handleSeatClick(e) {
    const seat = e.target;
    const seatId = seat.id;
    if (seat.classList.contains("booked")) return;

    if (seat.classList.contains("selected")) {
        seat.classList.remove("selected");
        selectedSeats = selectedSeats.filter(id => id !== seatId);
    } else {
        seat.classList.add("selected");
        selectedSeats.push(seatId);
    }
}

function showBill() {
    if (selectedSeats.length === 0) {
        alert("Please Select At Least 1 Seat");
        return;
    }

    const total = selectedSeats.length * pricePerSeat;
    const movie = movieSelect.value;
    const time = timeSelect.value;
    const date = dateSelect.value;

    document.getElementById("bill-details").innerHTML = `
    <strong>Movie:</strong> ${movie} <br>
    <strong>Show Time:</strong> ${time} <br>
    <strong>Show Date:</strong> ${date} <br>
    <strong>Seats:</strong> ${selectedSeats.join(", ")} <br>
    <strong>Price Per Seat:</strong> USD ${pricePerSeat} <br>
    <strong>Total:</strong> USD ${total}
    `;

    document.getElementById("overlay").style.display = "block";
    document.getElementById("bill-popup").style.display = "block";
}

function closePopup() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("bill-popup").style.display = "none";
}

function makePayment() {
    closePopup();
    setTimeout(() => {
        alert("Payment Successful!");
        const userEmail = localStorage.getItem("email");
        const userName = localStorage.getItem("user_name");
        const total = selectedSeats.length * pricePerSeat;

        const emailParams = {
            user_name: userName,
            email: userEmail,
            movie_name: movieSelect.value,
            show_date: dateSelect.value,
            show_time: timeSelect.value,
            seat_list: selectedSeats.join(", "),
            amount: total
        };

        console.log("Sending With: ", emailParams);

        emailjs.send("service_6gtotny", "template_m9xc8w9", emailParams)
        .then(() => {
            alert("Booking Confirmation Email Sent To Your Email!");
            window.location.href = "thankyou.html";
        })

        .catch((error) => {
            alert("Failed To Send Email: ", error);
        })

        const bookingId = Date.now();
        db.ref("bookings/" + bookingId).set({
            ...emailParams,
            status: "confirmed"
        });

        const movie = movieSelect.value;
        const time = timeSelect.value;
        const date = dateSelect.value;
        const path = `bookings/${movie}/${time}/${date}`;

        selectedSeats.forEach(seatId => {
            db.ref(`${path}/${seatId}`).set(true);
            const seat = document.getElementById(seatId);
            seat.classList.remove("selected");
            seat.classList.add("booked");
            seat.disabled = true;
            seat.removeEventListener("click", handleSeatClick);
        });

        selectedSeats = [];
    }, 1000);
}

movieSelect.addEventListener("change", () => {
    createSeats();
    loadBookedSeats();
});

timeSelect.addEventListener("change", () => {
    createSeats();
    loadBookedSeats();
});

createSeats();
loadBookedSeats();