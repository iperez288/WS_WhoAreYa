async function fetchJSON(what) {
    try {
        const response = await fetch(`./json/${what}.json`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Errorea JSON kargatzean:", error);
        throw error;
    }
}


export { fetchJSON };