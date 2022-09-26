import { container, instanceCachingFactory } from 'tsyringe';
import PlaylistDeleteCommand from './SlashCommands/Music/Playlist/PlaylistDeleteCommand';
import PlaylistListCommand from './SlashCommands/Music/Playlist/PlaylistListCommand';
import PlaylistLoadCommand from './SlashCommands/Music/Playlist/PlaylistLoadCommand';
import PlaylistSaveCommand from './SlashCommands/Music/Playlist/PlaylistSaveCommand';
import PlaylistCommand from './SlashCommands/Music/Playlist/PlaylistCommand';
import AvatarCommand from './SlashCommands/AvatarCommand';
import ClearCommand from './SlashCommands/Music/ClearCommand';
import DeleteCommand from './SlashCommands/Music/DeleteCommand';
import GotoCommand from './SlashCommands/Music/GotoCommand';
import LeaveCommand from './SlashCommands/Music/LeaveCommand';
import MoveCommand from './SlashCommands/Music/MoveCommand';
import LoopCommand from './SlashCommands/Music/LoopCommand';
import NowPlayingCommand from './SlashCommands/Music/NowPlayingCommand';
import PauseCommand from './SlashCommands/Music/PauseCommand';
import PlayCommand from './SlashCommands/Music/PlayCommand';
import QueueCommand from './SlashCommands/Music/QueueCommand';
import ShuffleCommand from './SlashCommands/Music/ShuffleCommand';
import SkipCommand from './SlashCommands/Music/SkipCommand';
import BanCommand from './SlashCommands/BanCommand';
import BonkCommand from './SlashCommands/BonkCommand';
import InviteCommand from './SlashCommands/InviteCommand';
import KickCommand from './SlashCommands/KickCommand';
import PardonCommand from './SlashCommands/PardonCommand';
import WhoisCommand from './SlashCommands/WhoisCommand';
import MenuInteraction from './ButtonInteractions/MenuInteraction';
import GuildCreateEventHandler from "./EventHandler/GuildCreateEventHandler";
import GuildDeleteEventHandler from "./EventHandler/GuildDeleteEventHandler";
import RateLimitEventHandler from "./EventHandler/RateLimitEventHandler";
import VoiceStateUpdateHandler from "./EventHandler/VoiceStateUpdateHandler";
import WarnEventHandler from "./EventHandler/WarnEventHandler";
import GuildMemberAddEventHandler from "./EventHandler/GuildMemberAddEventHandler";
import GuildMemberRemoveEventHandler from "./EventHandler/GuildMemberRemoveEventHandler";
import InteractionCreateEventHandler from "./EventHandler/InteractionCreateEventHandler";
import AddRoleCommand from './SlashCommands/AddRoleCommand';

container.register('EventHandler', { useClass: GuildCreateEventHandler });
container.register('EventHandler', { useClass: GuildDeleteEventHandler });
container.register('EventHandler', { useClass: RateLimitEventHandler });
container.register('EventHandler', { useClass: VoiceStateUpdateHandler });
container.register('EventHandler', { useClass: WarnEventHandler });
container.register('EventHandler', { useClass: GuildMemberAddEventHandler });
container.register('EventHandler', { useClass: GuildMemberRemoveEventHandler });
container.register('EventHandler', { useClass: InteractionCreateEventHandler });

container.register('SlashCommands', AddRoleCommand);
container.register('SlashCommands', PlaylistCommand);
container.register('SlashCommands', AvatarCommand);
container.register('SlashCommands', ClearCommand);
container.register('SlashCommands', DeleteCommand);
container.register('SlashCommands', GotoCommand);
container.register('SlashCommands', LeaveCommand);
container.register('SlashCommands', LoopCommand);
container.register('SlashCommands', MoveCommand);
container.register('SlashCommands', NowPlayingCommand);
container.register('SlashCommands', PauseCommand);
container.register('SlashCommands', PlayCommand);
container.register('SlashCommands', QueueCommand);
container.register('SlashCommands', ShuffleCommand);
container.register('SlashCommands', SkipCommand);
container.register('SlashCommands', BanCommand);
container.register('SlashCommands', BonkCommand);
container.register('SlashCommands', InviteCommand);
container.register('SlashCommands', KickCommand);
container.register('SlashCommands', PardonCommand);
container.register('SlashCommands', WhoisCommand);

container.register('PlaylistSubCommands', PlaylistDeleteCommand);
container.register('PlaylistSubCommands', PlaylistListCommand);
container.register('PlaylistSubCommands', PlaylistLoadCommand);
container.register('PlaylistSubCommands', PlaylistSaveCommand);

container.register('ButtonInteractions', MenuInteraction);
