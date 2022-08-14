import { injectable } from 'tsyringe';

@injectable()
export default class MustacheReplace {
  public replace(text: string, replacer: Record<string, string>): string {
    for (const [searchValue, replaceValue] of Object.entries(replacer)) {
      const searchValueRegex = this.wrapWithRegex(searchValue);
      text = text.replace(searchValueRegex, replaceValue);
    }
    return text;
  }

  private wrapWithRegex(text: string): RegExp {
    return new RegExp('{{ ?' + text + ' ?}}', 'g');
  }
}
