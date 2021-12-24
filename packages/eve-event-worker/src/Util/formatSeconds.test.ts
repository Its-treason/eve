import formatSeconds from './formatSeconds';

describe('formatSeconds()', () => {
  test('Can Format Seconds', () => {
    const seconds = 8790432;

    const actual = formatSeconds(seconds);

    expect(actual).toEqual('101 days, 17 hours, 47 minutes, 12 seconds');
  });
});
