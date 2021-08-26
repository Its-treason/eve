import embedFactory from '../Factory/messageEmbedFactory';
import {EveSlashCommand} from '../types';

const inviteCommand: EveSlashCommand = {
  data: {
    name: 'invite',
    description: 'Create an invite to invite the bot to your server',
    options: [],
  },
  async execute(interaction) {
    const invite = interaction.client.generateInvite(
      {scopes: ['applications.commands'], permissions: 'ADMINISTRATOR'},
    );

    const answer = embedFactory();
    answer.setTitle('Invite Link');
    answer.setDescription(invite);
  },
};

export default inviteCommand;
