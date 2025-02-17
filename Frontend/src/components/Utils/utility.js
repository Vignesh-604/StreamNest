import { formatDistanceToNow } from "date-fns"
import Swal from 'sweetalert2';
import CryptoJS from "crypto-js";
import Cookie from "js-cookie"

export function parseTime(seconds) {
    seconds = Math.round(seconds)
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    let timeString = '';
    let first = true;

    if (hours > 0) {
        timeString += hours
        first = false;
    }
    if (minutes > 0 || !first) {
        if (!first) timeString += ':';
        timeString += minutes
        first = false;
    }
    if (seconds > 0 || !first) {
        if (!first) timeString += ':';
        timeString += seconds 
    }
    return timeString
}

export function parseDate(date) {
    let updatedDate = new Date(date)
    let months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]

    let dateString = (updatedDate.getDate() + " " + months[updatedDate.getMonth()] + " " + updatedDate.getFullYear())
    // console.log(updatedDate.toLocaleDateString());

    return dateString
}
export function timeAgo(date) {
    return (formatDistanceToNow(date, { addSuffix: true }));
}


export function showCustomAlert(title, text) {
    Swal.fire({
        title,
        // text,
        timer: 1000,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#4f46e5', // Button color
        background: '#1a1a2e', // Background color of the modal
        width: '400px', // Custom width
        heightAuto: false, // Disable automatic height adjustment
        color: "white"
    });
}

export function showConfirmAlert(title, text, onConfirm) {
    Swal.fire({
        title,
        text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        confirmButtonColor: "#e63946",
        cancelButtonColor: "#4f46e5",
        background: "#1a1a2e",
        color: "white",
    }).then((result) => {
        if (result.isConfirmed && onConfirm) {
            onConfirm();
        }
    });
}

export function decrypt() {
    const userCrypt = Cookie.get('user')

    if (userCrypt) {
        const bytes = CryptoJS.AES.decrypt(userCrypt, import.meta.env.VITE_KEY);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData
    } else {
        return null
    }
}