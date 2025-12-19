export function timeFormat() {
    const hour = String(Math.floor(Math.random() * 9) + 8).padStart(2, '0'); // 08 a 16h
    const minute = String(Math.floor(Math.random() * 60)).padStart(2, '0');
    return `${hour}:${minute}`;
}