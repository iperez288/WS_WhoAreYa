export function match(query, name) {
    const index = name.toLowerCase().indexOf(query.toLowerCase());
    return index >= 0 ? { start: index, end: index + query.length } : null;
    
}