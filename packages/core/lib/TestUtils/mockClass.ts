// This function must only be used withing tests
export default function mockClass<T>(className: { new(...args: never[]): T }): T {
  if (process.env.JEST_WORKER_ID === undefined) {
    throw new Error('This function must be only used withing tests');
  }

  const methods = Reflect.ownKeys(className.prototype);

  const classMock = {
    _original: className,
    _customId: (Math.random() + 1).toString(36),
  };

  for (const method of methods) {
    if (method === 'constructor') {
      continue;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    classMock[method] = jest.fn();
  }

  return classMock as T;
}
