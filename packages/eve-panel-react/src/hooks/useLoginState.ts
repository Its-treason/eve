import { useEffect, useState } from 'react';
import LoginApi from '../api/LoginApi';
import { ReducedUser } from '../api/sharedApiTypes';

type LoginStateString = 'loading'|'loginFirst'|'loggedInUser'|'loggedInAdmin';

interface LoginState {
  state: LoginStateString,
  user: ReducedUser,
}

export default function useLoginState(): LoginState {
  const [loginState, setLoginState] = useState<LoginStateString>('loading');
  const [user, setUser] = useState<ReducedUser>({ name: '', icon: '', id: '', admin: false, server: [] });

  useEffect(() => {
    (async () => {
      const parsedUrl = new URL(window.location.href);
      const code = parsedUrl.searchParams.get('code');
      const pathName = parsedUrl.pathname;
      if (typeof code === 'string' && pathName === '/doLogin') {
        const response = await LoginApi.login(code);

        if (response === false) {
          window.history.replaceState(null, '', '/loginFirst?failed=true');
          setLoginState('loginFirst');
          return;
        }

        localStorage.setItem('apiKey', response.apiKey);
        setUser(response.user);
        setLoginState(response.user.admin ? 'loggedInAdmin' : 'loggedInUser');
        window.history.replaceState(null, '', '/');
        return;
      }

      const apiKey = localStorage.getItem('apiKey');
      if (apiKey === null) {
        window.history.replaceState(null, '', '/loginFirst');
        setLoginState('loginFirst');
        return;
      }

      const verifyRes = await LoginApi.verify();

      if (verifyRes === false) {
        window.history.replaceState(null, '', '/loginFirst');
        localStorage.removeItem('apiKey');
        setLoginState('loginFirst');
        return;
      }

      setUser(verifyRes);
      setLoginState(verifyRes.admin ? 'loggedInAdmin' : 'loggedInUser');
    })();
  }, []);

  return {
    state: loginState,
    user,
  };
}
