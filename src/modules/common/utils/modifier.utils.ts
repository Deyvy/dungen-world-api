export function calculateModifier(stat: number): number {
    // Modificadores: 1-3: -3 || 4-5: -2 || 6-8: -1 || 9-12: 0 || 13-15: +1 || 16-17: +2 || 18: +3
    if (stat <= 3) return -3;
    if (stat <= 5) return -2;
    if (stat <= 8) return -1;
    if (stat <= 12) return 0;
    if (stat <= 15) return 1;
    if (stat <= 17) return 2;

    return 3;
}