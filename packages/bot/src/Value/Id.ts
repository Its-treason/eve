import generateRandomString from '../Util/generateRandomString';

export class Id {
  private readonly id: string;

  private constructor(id: string) {
    if (id.length !== 64) {
      throw new Error('Invalid length of Id!');
    }

    this.id = id;
  }

  public toString(): string {
    return this.id;
  }

  public static generate(): Id {
    return new Id(generateRandomString(64));
  }

  public static fromString(id: string): Id {
    return new Id(id);
  }
}
