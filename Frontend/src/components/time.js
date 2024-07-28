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

// // Example usage:

// const seconds = 4755

// console.log(parseTime(seconds))
