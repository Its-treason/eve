import { ReducedServer, ReducedUser } from '../api/sharedApiTypes';
import { useEffect, useState } from 'react';
import ServerApi from '../api/ServerApi';
import UserApi from '../api/UserApi';

interface Params {
  userId?: string,
  serverId?: string,
}

interface UserServer {
  user: ReducedUser,
  server: ReducedServer,
}

export default function useUserServerFromParams(params: Params, loggedInUser: ReducedUser): UserServer {
  const { userId, serverId } = params;
  const [user, setUser] = useState<ReducedUser>({ name: '', id: '', icon: '', admin: false, server: [] });
  const [server, setServer] = useState<ReducedServer>({ name: '', id: '', icon: '' });

  useEffect(() => {
    (async () => {
      if (typeof serverId === 'string') {
        const serverInfo = await ServerApi.getBasicInfo(serverId);
        if (serverInfo !== false) {
          const doServerOverlap = loggedInUser.server.filter(server => server.id === serverInfo.id).length === 0;
          if (doServerOverlap && !loggedInUser.admin) {
            return;
          }

          setServer(serverInfo);
        }
      }

      if (typeof userId === 'string') {
        const userInfo = await UserApi.getBasicInfo(userId);

        if (userInfo !== false) {
          if (userInfo.id !== loggedInUser.id && !loggedInUser.admin) {
            return;
          }

          setUser(userInfo);
        }
      }
    })();
  }, [userId, serverId, loggedInUser]);

  return { user, server };
}
