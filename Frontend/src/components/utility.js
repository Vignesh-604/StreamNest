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
