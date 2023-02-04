import {useMemo} from "react";
import {Button, Checkbox, Group, Text, Code, MultiSelect} from "@mantine/core";
import { useServerRoles } from '@eve/panel/feature/core';
import { z } from 'zod';
import useAutoActionsForm from '../hooks/useAutoActionsForm';
import { DeviceFloppy } from 'tabler-icons-react';

interface AutoRolesPayload {
  roles: string[],
  enabled: boolean,
}

interface AutoRolesProps {
  serverId: string,
}

const schema = z.object({
  roles: z.array(z.string()).min(1),
  enabled: z.boolean(),
});

function JoinMessage({serverId}: AutoRolesProps) {
  const { loading: actionLoading, error, save, form } = useAutoActionsForm<AutoRolesPayload, typeof schema>('auto-roles', serverId, schema);
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
        sx={{ width: '100%' }}
        {...form.getInputProps('roles', { type: 'checkbox' })}
      />
      <Text color={'dimmed'}>
        Note roles with <Code>[M]</Code> have moderation permissions and roles with <Code>[A]</Code> have
        administrator permission. Please be careful when using this roles. Also be make sure that the bot
        has permission to manage roles.
      </Text>
      <Checkbox
        label="Enabled"
        disabled={loading}
        style={{width: '100%'}}
        {...form.getInputProps('enabled', { type: 'checkbox' })}
      />
      <Button
        fullWidth
        disabled={!form.isValid()}
        leftIcon={<DeviceFloppy />}
        onClick={save}
      >Save auto roles</Button>
      <Text color={'red'}>{error}</Text>
    </Group>
  )
}

export default JoinMessage;
