import React, {ReactElement} from "react";
import LoginApi from "../api/LoginApi";
import {Button} from "@mantine/core";

export function LogoutButton(): ReactElement {
  return (
    <Button
      color={'red'}
      onClick={() => LoginApi.logout().then(() => window.location.href = '/loginFirst')}
    >Logout</Button>
  )
}
