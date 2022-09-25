import {Button, Code, Group, Select, Stack, Text, Textarea, TextInput} from "@mantine/core";
import useUpdateRoleMenu from "../hooks/useUpdateRoleMenu";
import {useState} from "react";
import DeleteRoleMenu from "./DeleteRoleMenu";
import { ReducedChannel, RoleMenu } from '@eve/types/api';
import produce from 'immer';
import { EmbedBuilderOrNull, EmojiPicker } from '@eve/panel/feature/core';
import { DeviceFloppy, Plus, TrashX } from 'tabler-icons-react';

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
  serverId: string,
}

export default function DisplayRoleMenu(
  {roleMenu, setRoleMenu, updateMenus, channel, formattedRoles, serverId}: DisplayRoleMenuProps,
) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { updateRoleMenuError, updateRoleMenu, updateRoleMenuLoading: loading } = useUpdateRoleMenu(serverId);

  const selectedChannel = channel.find(singleChannel => {
    return singleChannel.id === roleMenu.channelId
  });

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
        disabled
        width={'100%'}
        defaultValue={selectedChannel !== undefined ? selectedChannel.name : ''}
        icon={<Code>#</Code>}
        style={{width: '100%'}}
      />
      <Textarea
        label={'Message'}
        required
        maxLength={1900}
        value={roleMenu.message}
        onChange={(evt) => {
          setRoleMenu(produce(roleMenu, (roleMenuDraft) => {
            roleMenuDraft.message = evt.target.value;
          }));
        }}
      />
      <EmbedBuilderOrNull
        value={roleMenu.embed}
        onChange={(value) => {
          setRoleMenu(produce(roleMenu, (roleMenuDraft) => {
            roleMenuDraft.embed = value;
          }));
        }}
      />
      <Button
        onClick={() => {
          setRoleMenu(produce(roleMenu, (roleMenuDraft) => {
            roleMenuDraft.entries.push({
              role: '',
              label: '',
              emoji: undefined,
              color: 1,
            });
          }));
        }}
        leftIcon={<Plus />}
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
              required
              onChange={value => {
                setRoleMenu(produce(roleMenu, (roleMenuDraft) => {
                  roleMenuDraft.entries[index].role = String(value);
                }));
              }}
              style={{width: 'clamp(100px, 20%, 250px)'}}
            />
            <EmojiPicker
              emoji={entry.emoji}
              onChange={(value) => {
                setRoleMenu(produce(roleMenu, (roleMenuDraft) => {
                  roleMenuDraft.entries[index].emoji = value;
                }));
              }}
              clearable={true}
            />
            <TextInput
              required
              maxLength={24}
              label={'Button label'}
              value={entry.label}
              disabled={loading}
              onChange={evt => {
                setRoleMenu(produce(roleMenu, (roleMenuDraft) => {
                  roleMenuDraft.entries[index].label = evt.target.value;
                }));
              }}
              style={{flexGrow: '1'}}
            />
            <Select
              data={[
                { value: '1', label: 'Primary' },
                { value: '2', label: 'Secondary' },
                { value: '3', label: 'Success' },
                { value: '4', label: 'Danger' },
              ]}
              value={entry.color.toString()}
              label={'Button Color'}
              disabled={loading}
              onChange={value => {
                setRoleMenu(produce(roleMenu, (roleMenuDraft) => {
                  roleMenuDraft.entries[index].color = Number(value);
                }));
              }}
              style={{width: '110px'}}
            />
            <Button
              color={'red'}
              disabled={loading}
              onClick={() => {
                setRoleMenu(produce(roleMenu, (roleMenuDraft) => {
                  roleMenuDraft.entries.splice(index, 1);
                }));
              }}
              style={{width: 100}}
            >Remove</Button>
          </Group>
        );
      })}
      <Button
        disabled={loading}
        onClick={() => {
          updateRoleMenu(roleMenu.id, roleMenu.message, roleMenu.embed, roleMenu.entries).then((result) => {
            if (result) {
              updateMenus();
            }
          })
        }}
        fullWidth
        leftIcon={<DeviceFloppy />}
      >Save role menu</Button>
      <Button
        disabled={loading}
        color={'red'}
        onClick={() => {
          setDeleteDialogOpen(true);
        }}
        fullWidth
        variant={'outline'}
        leftIcon={<TrashX />}
      >Delete role menu</Button>
      <Text color={'red'}>{updateRoleMenuError}</Text>
    </Stack>
  )
}
