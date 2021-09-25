import AbstractButtonInteraction from '../ButtonInteractions/AbstractInteraction';
import BanInteraction from '../ButtonInteractions/BanInteraction';
import KickInteraction from '../ButtonInteractions/KickInteraction';
import MenuInteraction from '../ButtonInteractions/MenuInteraction';
import PardonInteraction from '../ButtonInteractions/PardonInteraction';
import { Container } from 'treason-di';

export default async function buttonInteractionArrayFactory(container: Container): Promise<AbstractButtonInteraction[]> {
  const interactions = [];

  interactions.push(await container.get<BanInteraction>(BanInteraction));
  interactions.push(await container.get<KickInteraction>(KickInteraction));
  interactions.push(await container.get<MenuInteraction>(MenuInteraction));
  interactions.push(await container.get<PardonInteraction>(PardonInteraction));

  return interactions;
}
