import { Router } from 'express';
import authMiddleware from './middleware/authMiddleware';
import canAccessServerMiddleware from './middleware/canAccessServerMiddleware';
import canAccessUserMiddleware from './middleware/canAccessUserMiddleware';
import loginHandler from './routesV1/login/loginHandler';
import logoutHandler from './routesV1/login/logoutHandler';
import verifyHandler from './routesV1/login/verifyHandler';
import channelListHandler from './routesV1/server/channelListHandler';
import roleListHandler from './routesV1/server/roleListHandler';
import catchError from './util/catchErrors';
import basicServerInfoHandler from './routesV1/server/basicServerInfoHandler';
import basicUserInfoHandler from './routesV1/user/basicUserInfoHandler';
import createInviteHandler from './routesV1/createInviteHandler';
import playlistViewHandler from './routesV1/user/playlist/playlistViewHandler';
import playlistDeleteHandler from './routesV1/user/playlist/playlistDeleteHandler';
import playlistListHandler from './routesV1/user/playlist/playlistListHandler';
import playlistSaveHandler from './routesV1/user/playlist/playlistSaveHandler';
import importSpotifyPlaylistHandler from './routesV1/user/playlist/search/importSpotifyPlaylistHandler';
import searchHandler from './routesV1/user/playlist/search/searchHandler';
import spotifyPreviewHandler from './routesV1/user/playlist/search/spotifyPreviewHandler';
import activityHandler from './routesV1/user/activityHandler';
import saveActionsHandler from './routesV1/server/auto/saveActionsHandler';
import getActionsHandler from './routesV1/server/auto/getActionsHandler';
import getRoleMenusHandler from './routesV1/server/roleMenu/getRoleMenusHandler';
import createRoleMenuHandler from './routesV1/server/roleMenu/createRoleMenuHandler/createRoleMenuHandler';
import updateRoleMenuHandler from './routesV1/server/roleMenu/updateRoleMenuHandler/updateRoleMenuHandler';
import deleteRoleMenuHandler from './routesV1/server/roleMenu/deleteRoleMenuHandler/deleteRoleMenuHandler';

const router = Router();
router.use('/login/login', catchError(loginHandler));
router.use('/login/logout', authMiddleware(false), catchError(logoutHandler));
router.use('/login/verify', authMiddleware(false), catchError(verifyHandler));

router.get('/server/:serverId/channelList', authMiddleware(false), canAccessServerMiddleware, catchError(channelListHandler));
router.get('/server/:serverId/roleList', authMiddleware(false), canAccessServerMiddleware, catchError(roleListHandler));
router.get('/server/:serverId/basicInfo', authMiddleware(false), canAccessServerMiddleware, catchError(basicServerInfoHandler));

router.post('/server/:serverId/auto/save', authMiddleware(false), canAccessServerMiddleware, catchError(saveActionsHandler));
router.post('/server/:serverId/auto/get', authMiddleware(false), canAccessServerMiddleware, catchError(getActionsHandler));

router.get('/server/:serverId/roleMenu/getAll', authMiddleware(false), canAccessServerMiddleware, catchError(getRoleMenusHandler));
router.post('/server/:serverId/roleMenu/create', authMiddleware(false), canAccessServerMiddleware, catchError(createRoleMenuHandler));
router.post('/server/:serverId/roleMenu/update', authMiddleware(false), canAccessServerMiddleware, catchError(updateRoleMenuHandler));
router.post('/server/:serverId/roleMenu/delete', authMiddleware(false), canAccessServerMiddleware, catchError(deleteRoleMenuHandler));

router.get('/user/:userId/basicInfo', authMiddleware(false), canAccessUserMiddleware, catchError(basicUserInfoHandler));
router.post('/user/:userId/activity', authMiddleware(false), canAccessUserMiddleware, catchError(activityHandler));

router.post('/user/:userId/playlist/delete', authMiddleware(false), canAccessUserMiddleware, catchError(playlistDeleteHandler));
router.get('/user/:userId/playlist/list', authMiddleware(false), canAccessUserMiddleware, catchError(playlistListHandler));
router.post('/user/:userId/playlist/save', authMiddleware(false), canAccessUserMiddleware, catchError(playlistSaveHandler));
router.post('/user/:userId/playlist/view', authMiddleware(false), canAccessUserMiddleware, catchError(playlistViewHandler));

router.post('/user/:userId/playlist/search/importSpotify', authMiddleware(false), canAccessUserMiddleware, catchError(importSpotifyPlaylistHandler));
router.post('/user/:userId/playlist/search/search', authMiddleware(false), canAccessUserMiddleware, catchError(searchHandler));
router.post('/user/:userId/playlist/search/previewSpotify', authMiddleware(false), canAccessUserMiddleware, catchError(spotifyPreviewHandler));

router.get('/invite', authMiddleware(false), catchError(createInviteHandler));

export default router;
