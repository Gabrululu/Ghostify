export function chaosCasing(text: string): string {
  let idx = 0;
  return text
    .split('')
    .map((char) => {
      if (char === ' ' || char === '\n') return char;
      const result = idx % 2 === 0 ? char.toUpperCase() : char.toLowerCase();
      idx++;
      return result;
    })
    .join('');
}
