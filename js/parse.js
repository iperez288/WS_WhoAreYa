export function parse(name, matchResult) {
    
    if (!matchResult) return [{ text: name, highlight: false }];
    
    return [
        { text: name.slice(0, matchResult.start), highlight: false },
        { text: name.slice(matchResult.start, matchResult.end), highlight: true },
        { text: name.slice(matchResult.end), highlight: false }
    ];
}