import { NextFunction, Router, Request } from 'express';
import { singleton } from 'tsyringe';
import { Logger } from '@eve/core';
import LoginController from './RoutesV1/LoginController';
import AuthMiddlewares from './Middleware/AuthMiddlewares';
import ServerController from './RoutesV1/Server/ServerController';
import ServerSettingsController from './RoutesV1/Server/ServerSettings/ServerSettingsController';
import { ResponseWithLocals } from '../types';
import RoleMenuController from './RoutesV1/Server/RoleMenu/RoleMenuController';
import UserController from './RoutesV1/User/UserController';
import UserActivityController from './RoutesV1/User/VoiceActivity/UserActivityController';
import PlaylistController from './RoutesV1/User/Playlist/PlaylistController';
import MusicSearchController from './RoutesV1/User/Playlist/Search/MusicSearchController';
import InviteController from './RoutesV1/InviteController';
import ServerActivityController from './RoutesV1/Server/VoiceActivity/ServerActivityController';
import PublicLogsController from './RoutesV1/Server/PublicLogs/PublicLogsController';

@singleton()
export default class RouterV1 {
  constructor(
    private logger: Logger,
    private authMiddlewares: AuthMiddlewares,
    private loginController: LoginController,
    private serverController: ServerController,
    private serverSettingsController: ServerSettingsController,
    private roleMenuController: RoleMenuController,
    private serverActivityController: ServerActivityController,
    private userController: UserController,
    private userActivityController: UserActivityController,
    private playlistController: PlaylistController,
    private musicSearchController: MusicSearchController,
    private inviteController: InviteController,
    private logsController: PublicLogsController,
  ) {}

  public createRouter(): Router {
    const router = Router();

    router.post(
      '/login/login',
      this.catchError(this.loginController.login.bind(this.loginController)),
    );
    router.get(
      '/login/logout',
      this.authMiddlewares.authMiddleware(false),
      this.catchError(this.loginController.logout.bind(this.loginController)),
    );
    router.get(
      '/login/verify',
      this.authMiddlewares.authMiddleware(false),
      this.catchError(this.loginController.verify.bind(this.loginController)),
    );

    router.get(
      '/server/:serverId/channelList',
      this.authMiddlewares.authMiddleware(false),
      this.authMiddlewares.canAccessServerMiddleware.bind(this.authMiddlewares),
      this.catchError(this.serverController.channelList.bind(this.serverController)),
    );
    router.get(
      '/server/:serverId/roleList',
      this.authMiddlewares.authMiddleware(false),
      this.authMiddlewares.canAccessServerMiddleware.bind(this.authMiddlewares),
      this.catchError(this.serverController.roleList.bind(this.serverController)),
    );
    router.get(
      '/server/:serverId/emojiList',
      this.authMiddlewares.authMiddleware(false),
      this.authMiddlewares.canAccessServerMiddleware.bind(this.authMiddlewares),
      this.catchError(this.serverController.emojiList.bind(this.serverController)),
    );
    router.get(
      '/server/:serverId/basicInfo',
      this.authMiddlewares.authMiddleware(false),
      this.authMiddlewares.canAccessServerMiddleware.bind(this.authMiddlewares),
      this.catchError(this.serverController.basicInfo.bind(this.serverController)),
    );

    router.put(
      '/server/:serverId/setting',
      this.authMiddlewares.authMiddleware(false),
      this.authMiddlewares.canAccessServerMiddleware.bind(this.authMiddlewares),
      this.catchError(this.serverSettingsController.saveSetting.bind(this.serverSettingsController)),
    );
    router.get(
      '/server/:serverId/setting',
      this.authMiddlewares.authMiddleware(false),
      this.authMiddlewares.canAccessServerMiddleware.bind(this.authMiddlewares),
      this.catchError(this.serverSettingsController.getSetting.bind(this.serverSettingsController)),
    );

    router.get(
      '/server/:serverId/roleMenu/getAll',
      this.authMiddlewares.authMiddleware(false),
      this.authMiddlewares.canAccessServerMiddleware.bind(this.authMiddlewares),
      this.catchError(this.roleMenuController.getRoleMenusHandler.bind(this.roleMenuController)),
    );
    router.post(
      '/server/:serverId/roleMenu/create',
      this.authMiddlewares.authMiddleware(false),
      this.authMiddlewares.canAccessServerMiddleware.bind(this.authMiddlewares),
      this.catchError(this.roleMenuController.createRoleMenu.bind(this.roleMenuController)),
    );
    router.post(
      '/server/:serverId/roleMenu/update',
      this.authMiddlewares.authMiddleware(false),
      this.authMiddlewares.canAccessServerMiddleware.bind(this.authMiddlewares),
      this.catchError(this.roleMenuController.updateRoleMenu.bind(this.roleMenuController)),
    );
    router.post(
      '/server/:serverId/roleMenu/delete',
      this.authMiddlewares.authMiddleware(false),
      this.authMiddlewares.canAccessServerMiddleware.bind(this.authMiddlewares),
      this.catchError(this.roleMenuController.deleteRoleMenu.bind(this.roleMenuController)),
    );

    router.post(
      '/server/:serverId/activity',
      this.authMiddlewares.authMiddleware(false),
      this.authMiddlewares.canAccessServerMiddleware.bind(this.authMiddlewares),
      this.catchError(this.serverActivityController.getServerActivity.bind(this.serverActivityController)),
    );
    router.post(
      '/server/:serverId/activityCsv',
      this.authMiddlewares.authMiddleware(false),
      this.authMiddlewares.canAccessServerMiddleware.bind(this.authMiddlewares),
      this.catchError(this.serverActivityController.getServerActivityAsCsv.bind(this.serverActivityController)),
    );

    router.get(
      '/server/:serverId/logs',
      this.authMiddlewares.authMiddleware(false),
      this.authMiddlewares.canAccessServerMiddleware.bind(this.authMiddlewares),
      this.catchError(this.logsController.getAllLogs.bind(this.logsController)),
    );

    router.get(
      '/user/:userId/basicInfo',
      this.authMiddlewares.authMiddleware(false),
      this.authMiddlewares.canAccessUserMiddleware.bind(this.authMiddlewares),
      this.catchError(this.userController.getUserInfo.bind(this.userController)),
    );

    router.post(
      '/user/:userId/activity',
      this.authMiddlewares.authMiddleware(false),
      this.authMiddlewares.canAccessUserMiddleware.bind(this.authMiddlewares),
      this.catchError(this.userActivityController.getUserActivity.bind(this.userActivityController)),
    );
    router.post(
      '/user/:userId/activityCsv',
      this.authMiddlewares.authMiddleware(false),
      this.authMiddlewares.canAccessUserMiddleware.bind(this.authMiddlewares),
      this.catchError(this.userActivityController.getUserActivityAsCsv.bind(this.userActivityController)),
    );

    router.post(
      '/user/:userId/playlist/delete',
      this.authMiddlewares.authMiddleware(false),
      this.authMiddlewares.canAccessUserMiddleware.bind(this.authMiddlewares),
      this.catchError(this.playlistController.deletePlaylist.bind(this.playlistController)),
    );
    router.get(
      '/user/:userId/playlist/list',
      this.authMiddlewares.authMiddleware(false),
      this.authMiddlewares.canAccessUserMiddleware.bind(this.authMiddlewares),
      this.catchError(this.playlistController.listPlaylists.bind(this.playlistController)),
    );
    router.post(
      '/user/:userId/playlist/save',
      this.authMiddlewares.authMiddleware(false),
      this.authMiddlewares.canAccessUserMiddleware.bind(this.authMiddlewares),
      this.catchError(this.playlistController.savePlaylist.bind(this.playlistController)),
    );
    router.post(
      '/user/:userId/playlist/view',
      this.authMiddlewares.authMiddleware(false),
      this.authMiddlewares.canAccessUserMiddleware.bind(this.authMiddlewares),
      this.catchError(this.playlistController.viewPlaylist.bind(this.playlistController)),
    );

    router.post(
      '/user/:userId/playlist/search/importSpotify',
      this.authMiddlewares.authMiddleware(false),
      this.authMiddlewares.canAccessUserMiddleware.bind(this.authMiddlewares),
      this.catchError(this.musicSearchController.importSpotifyPlaylist.bind(this.musicSearchController)),
    );
    router.post(
      '/user/:userId/playlist/search/search',
      this.authMiddlewares.authMiddleware(false),
      this.authMiddlewares.canAccessUserMiddleware.bind(this.authMiddlewares),
      this.catchError(this.musicSearchController.search.bind(this.musicSearchController)),
    );
    router.post(
      '/user/:userId/playlist/search/previewSpotify',
      this.authMiddlewares.authMiddleware(false),
      this.authMiddlewares.canAccessUserMiddleware.bind(this.authMiddlewares),
      this.catchError(this.musicSearchController.createSpotifyPreview.bind(this.musicSearchController)),
    );

    router.get(
      '/invite',
      this.authMiddlewares.authMiddleware(false),
      this.catchError(this.inviteController.create.bind(this.inviteController)),
    );

    return router;
  }

  private catchError(
    fn: (req: Request, res: ResponseWithLocals, next: NextFunction) => void,
  ) {
    return async (req: Request, res: ResponseWithLocals, next: NextFunction): Promise<void> => {
      try {
        await fn(req, res, next);
      } catch (error) {
        this.logger.error('An error Occurred in a handler!', { error: (error as Error) });
        res.status(500);
      }
      next();
    };
  }
}
