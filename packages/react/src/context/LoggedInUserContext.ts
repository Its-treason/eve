import React from 'react';
import { ReducedUser } from '../api/sharedApiTypes';

const LoggedInUserContext = React.createContext<ReducedUser>({ name: '', id: '', icon: '', admin: false, server: [] });

export default LoggedInUserContext;
