import { injectable } from 'tsyringe';

@injectable()
export default class FormattingHelper {
  formatSeconds(seconds: number, maxSegments = 5): string {
    if (seconds === 0) {
      return '0 seconds';
    }

    const y = Math.floor(seconds / (3600 * 24 * 365));
    const d = Math.floor(seconds / (3600 * 24) % 365);
    const h = Math.floor(seconds % (3600 * 24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);

    const yDisplay = y > 0 && d > 0 ? y + (y === 1 ? ' year' : ' years') : undefined;
    const dDisplay = d > 0 ? d + (d === 1 ? ' day' : ' days') : undefined;
    const hDisplay = h > 0 ? h + (h === 1 ? ' hour' : ' hours') : undefined;
    const mDisplay = m > 0 ? m + (m === 1 ? ' minute' : ' minutes') : undefined;
    const sDisplay = s > 0 ? s + (s === 1 ? ' second' : ' seconds') : undefined;

    const valueArray = [yDisplay, dDisplay, hDisplay, mDisplay, sDisplay].filter(item => !!item);

    return valueArray.splice(0, maxSegments).join(', ');
  };

  dateToDatetime(date?: Date): string {
    return (date || new Date()).toISOString().slice(0, 19).replace('T', ' ');
  }
}
