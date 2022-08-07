import {ReducedChannel, RoleMenu} from "../../../api/sharedApiTypes";
import {Button, Code, Group, Select, Stack, Text, Textarea, TextInput} from "@mantine/core";
import useUpdateRoleMenu from "../hooks/useUpdateRoleMenu";
import deepCopyState from "../../../util/deepCopyState";
import {useState} from "react";
import DeleteRoleMenu from "./DeleteRoleMenu";
import EmojiPicker from '../../../components/EmojiPicker';

interface SelectItem {
  label: string,
  value: string,
}

interface DisplayRoleMenuProps {
  roleMenu: RoleMenu,
  channel: ReducedChannel[],
  formattedRoles: SelectItem[],
  updateMenus: () => void,
  setRoleMenu: (roleMenu: RoleMenu) => void,
  parentLoading: boolean,
  serverId: string,
}

export default function DisplayRoleMenu(
  {roleMenu, setRoleMenu, updateMenus, channel, parentLoading, formattedRoles, serverId}: DisplayRoleMenuProps,
) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { updateRoleMenuError, updateRoleMenu, updateRoleMenuLoading } = useUpdateRoleMenu(serverId);

  const selectedChannel = channel.find(singleChannel => {
    return singleChannel.id === roleMenu.channelId
  });

  const loading = parentLoading || updateRoleMenuLoading;

  return (
    <Stack>
      <DeleteRoleMenu
        opened={deleteDialogOpen}
        roleMenuId={roleMenu.id}
        serverId={serverId}
        close={(shouldUpdateRoleMenus) => {
          setDeleteDialogOpen(false);
          if (shouldUpdateRoleMenus) {
            updateMenus();
          }
        }}
      />
      <TextInput
        readOnly
        label={'Channel'}
        disabled={loading}
        width={'100%'}
        defaultValue={selectedChannel !== undefined ? selectedChannel.name : ''}
        icon={<Code>#</Code>}
        style={{width: '100%'}}
      />
      <Textarea
        disabled={loading}
        label={'Message'}
        value={roleMenu.message}
        maxLength={2000}
        onChange={evt => {
          const copy = deepCopyState(roleMenu);
          copy.message = evt.currentTarget.value;
          setRoleMenu(copy);
        }}
        style={{width: '100%'}}
      />
      <Button
        onClick={() => {
          const copy = deepCopyState(roleMenu);
          copy.entries.push({
            role: '',
            label: '',
            emoji: null,
          });
          setRoleMenu(copy);
        }}
        fullWidth
        disabled={loading || roleMenu.entries.length >= 25}
      >Add Role</Button>
      {roleMenu.entries.map((entry, index) => {
        return (
          <Group align={'flex-end'} key={index}>
            <Select
              data={formattedRoles}
              value={entry.role}
              label={'Role'}
              disabled={loading}
              onChange={value => {
                const copy = deepCopyState(roleMenu);
                copy.entries[index].role = value;
                setRoleMenu(copy);
              }}
              style={{width: 'clamp(100px, 20%, 250px)'}}
            />
            <EmojiPicker
              emoji={entry.emoji}
              onChange={(value) => {
                const copy = deepCopyState(roleMenu);
                copy.entries[index].emoji = value;
                setRoleMenu(copy);
              }}
              clearable={true}
            />
            <TextInput
              maxLength={24}
              label={'Button label'}
              value={entry.label}
              disabled={loading}
              onChange={evt => {
                const copy = deepCopyState(roleMenu);
                copy.entries[index].label = evt.currentTarget.value;
                setRoleMenu(copy);
              }}
              style={{flexGrow: '1'}}
            />
            <Button
              color={'red'}
              disabled={loading}
              onClick={() => {
                const copy = deepCopyState(roleMenu);
                copy.entries.splice(index, 1);
                setRoleMenu(copy);
              }}
              style={{width: 100}}
            >Remove</Button>
          </Group>
        );
      })}
      <Button
        disabled={loading}
        onClick={() => {
          updateRoleMenu(roleMenu.id, roleMenu.message, roleMenu.entries).then((result) => {
            if (result) {
              updateMenus();
            }
          })
        }}
        fullWidth
      >Save role menu</Button>
      <Button
        disabled={loading}
        color={'red'}
        onClick={() => {
          setDeleteDialogOpen(true);
        }}
        fullWidth
      >Delete role menu</Button>
      <Text color={'red'}>{updateRoleMenuError}</Text>
    </Stack>
  )
}
