import AbstractInteraction from '../Interactions/AbstractInteraction';
import BanInteraction from '../Interactions/BanInteraction';
import KickInteraction from '../Interactions/KickInteraction';
import MenuInteraction from '../Interactions/MenuInteraction';
import PardonInteraction from '../Interactions/PardonInteraction';

export default function interactionArrayFactory(): AbstractInteraction[] {
  const interactions = [];

  interactions.push(new BanInteraction());
  interactions.push(new KickInteraction());
  interactions.push(new MenuInteraction());
  interactions.push(new PardonInteraction());
  return interactions;
}
