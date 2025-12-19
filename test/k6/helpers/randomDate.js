export function dateFormat() {
    const today = new Date();
    const daysAhead = Math.floor(Math.random() * 30) + 1; // 1 a 30 dias no futuro
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + daysAhead);

    const day = String(futureDate.getDate()).padStart(2, '0');
    const month = String(futureDate.getMonth() + 1).padStart(2, '0');
    const year = futureDate.getFullYear();

    return `${day}/${month}/${year}`;
}
