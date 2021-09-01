import AbstractInteraction from '../interactions/AbstractInteraction';
import BanInteraction from '../interactions/BanInteraction';
import KickInteraction from '../interactions/KickInteraction';
import MenuInteraction from '../interactions/MenuInteraction';
import PardonInteraction from '../interactions/PardonInteraction';

export default function interactionArrayFactory(): AbstractInteraction[] {
  const interactions = [];

  interactions.push(new BanInteraction());
  interactions.push(new KickInteraction());
  interactions.push(new MenuInteraction());
  interactions.push(new PardonInteraction());
  return interactions;
}
