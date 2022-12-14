export default (seconds: number): string => {
  seconds = Number(seconds);
  const y = Math.floor(seconds / (3600*24*365));
  const d = Math.floor(seconds / (3600*24) % 365);
  const h = Math.floor(seconds % (3600*24) / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);

  const yDisplay = y > 0 && d > 0 ? y + (y === 1 ? ' year, ' : ' years, ') : '';
  const dDisplay = d > 0 ? d + (d === 1 ? ' day, ' : ' days, ') : '';
  const hDisplay = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : '';
  const mDisplay = m > 0 ? m + (m === 1 ? ' minute, ' : ' minutes, ') : '';
  const sDisplay = s > 0 ? s + (s === 1 ? ' second' : ' seconds') : '0 seconds';
  return yDisplay + dDisplay + hDisplay + mDisplay + sDisplay;
};
