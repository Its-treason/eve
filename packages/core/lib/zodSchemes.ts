import { z } from "zod";

export const reducedEmbedScheme = z.object({
  title: z.string().max(256),

  description: z.string().max(4096),

  color: z.string().refine((value) => /^#([0-9a-fA-F]{3}){1,2}$/i.test(value)),

  footer: z.string().max(2048),

  fields: z.array(z.object({
    name: z.string().max(256),

    value: z.string().max(1024),

    inline: z.boolean(),
  })),
}).superRefine((embed, ctx) => {
  let characterCount = 0;

  characterCount += embed.description.length;
  characterCount += embed.title.length;
  characterCount += embed.footer.length;
  for (const field of embed.fields) {
    characterCount += field.name.length;
    characterCount += field.value.length;
  }

  if (characterCount === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      minimum: 1,
      type: 'string',
      inclusive: true,
      message: 'Embed must not be empty',
      fatal: true,
    });
  } else if (characterCount > 5900) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      maximum: 5900,
      type: 'string',
      inclusive: true,
      message: 'Length of all Embed fields must not be greater then 5900 characters',
      fatal: true,
    });
  }
});
