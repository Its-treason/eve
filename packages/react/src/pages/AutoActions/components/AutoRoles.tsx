import {useMemo} from "react";
import {Button, Checkbox, Group, Text, Code, MultiSelect} from "@mantine/core";
import useAutoActions from "../hooks/useAutoActions";
import produce from "immer";
import {showNotification} from "@mantine/notifications";
import useServerRoles from "../../../hooks/useServerRoles";

interface AutoRolesPayload {
  roles: string[],
  enabled: boolean,
}

interface AutoRolesProps {
  serverId: string,
}

function JoinMessage({serverId}: AutoRolesProps) {
  const { payload, loading: actionLoading, error, save, setPayload } = useAutoActions<AutoRolesPayload>('auto-roles', serverId);
  const { roles, rolesLoading } = useServerRoles(serverId);

  const roleData = useMemo(() => {
    return roles.map(role => {
      return {
        value: role.id,
        label: `${role.name} ${role.isModerator ? '[M]' : ''} ${role.isAdmin ? '[A]' : ''}`,
      }
    });
  }, [roles]);

  const loading = actionLoading || rolesLoading;

  return (
    <Group>
      <Text>Automatically give new members roles when they join!</Text>
      <MultiSelect
        data={roleData}
        label="Roles"
        disabled={loading}
        value={payload.roles}
        style={{width: '100%'}}
        onChange={value => {
          setPayload(produce(draft => {
            draft.roles = value;
          }))
        }}
      />
      <Text color={'dimmed'}>
        Note roles with <Code>[M]</Code> have moderation permissions and roles with <Code>[A]</Code> have
        administrator permission. Please be careful when using this roles. Also be make sure that the bot
        has permission to manage roles.
      </Text>
      <Checkbox
        label="Enabled"
        checked={payload.enabled || false}
        disabled={loading}
        style={{width: '100%'}}
        onChange={evt => {
          setPayload(produce(draft => {
            draft.enabled = evt.target.checked;
          }))
        }}
      />
      <Text color={'dimmed'}>
        Note that the action will also be disabled if no roles are selected.
      </Text>
      <Button
        fullWidth
        disabled={loading}
        onClick={() => {
          save().then(() => {
            showNotification({
              message: 'Auto roles saved',
              title: 'Saved',
            })
          })
        }}
      >Save auto roles</Button>
      <Text color={'red'}>{error}</Text>
    </Group>
  )
}

export default JoinMessage;
