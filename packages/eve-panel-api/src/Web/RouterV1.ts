import { NextFunction, Router, Request } from 'express';
import { singleton } from 'tsyringe';
import { Logger } from 'eve-core';
import LoginController from './RoutesV1/LoginController';
import AuthMiddlewares from './Middleware/AuthMiddlewares';
import ServerController from './RoutesV1/Server/ServerController';
import AutoActionsController from './RoutesV1/Server/AutoActions/AutoActionsController';
import { ResponseWithLocals } from '../types';
import RoleMenuController from './RoutesV1/Server/RoleMenu/RoleMenuController';
import UserController from './RoutesV1/User/UserController';
import UserActivityController from './RoutesV1/User/UserActivity/UserActivityController';
import PlaylistController from './RoutesV1/User/Playlist/PlaylistController';
import MusicSearchController from './RoutesV1/User/Playlist/Search/MusicSearchController';
import InviteController from './RoutesV1/InviteController';

@singleton()
export default class RouterV1 {
  constructor(
    private logger: Logger,
    private authMiddlewares: AuthMiddlewares,
    private loginController: LoginController,
    private serverController: ServerController,
    private autoActionsController: AutoActionsController,
    private roleMenuController: RoleMenuController,
    private userController: UserController,
    private userActivityController: UserActivityController,
    private playlistController: PlaylistController,
    private musicSearchController: MusicSearchController,
    private inviteController: InviteController,
  ) { }

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
      '/server/:serverId/basicInfo',
      this.authMiddlewares.authMiddleware(false),
      this.authMiddlewares.canAccessServerMiddleware.bind(this.authMiddlewares),
      this.catchError(this.serverController.basicInfo.bind(this.serverController)),
    );

    router.post(
      '/server/:serverId/auto/save',
      this.authMiddlewares.authMiddleware(false),
      this.authMiddlewares.canAccessServerMiddleware.bind(this.authMiddlewares),
      this.catchError(this.autoActionsController.saveAutoAction.bind(this.autoActionsController)),
    );
    router.post(
      '/server/:serverId/auto/get',
      this.authMiddlewares.authMiddleware(false),
      this.authMiddlewares.canAccessServerMiddleware.bind(this.authMiddlewares),
      this.catchError(this.autoActionsController.getAutoActions.bind(this.autoActionsController)),
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
