import { ReducedEmbed } from '@eve/core';
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

  public replaceReducedEmbed(embed: ReducedEmbed, replacer: Record<string, string>): ReducedEmbed {
    embed.title = this.replace(embed.title, replacer);
    embed.description = this.replace(embed.description, replacer);
    embed.footer = this.replace(embed.footer, replacer);

    for (const index in embed.fields) {
      embed.fields[index].name = this.replace(embed.fields[index].name, replacer);
      embed.fields[index].value = this.replace(embed.fields[index].value, replacer);
    }

    return embed;
  }

  private wrapWithRegex(text: string): RegExp {
    return new RegExp('{{ ?' + text + ' ?}}', 'g');
  }
}
