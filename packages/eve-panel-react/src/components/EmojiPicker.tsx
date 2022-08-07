import { createStyles, Popover, UnstyledButton, Text, Tabs, ActionIcon, Group, SimpleGrid } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { ReactElement, useContext, useState } from 'react';
import { X } from 'tabler-icons-react';
import { ReducedEmoji } from '../api/sharedApiTypes';
import EmojiContext from '../context/EmojiContext';
import DisplayEmoji from './DisplayEmoji';

const useStyles = createStyles((theme) => {
  return {
    controlWrapper: {
      display: 'grid',
      gridTemplate: '"tooltip" "input"',
      gridTemplateColumns: '100%',
      gridTemplateRows: '21px 36px',
      width: '80px',
    },

    input: {
      width: '80px',
      gridArea: 'input',
      gridTemplateRows: '100%',
      gridTemplateColumns: '100% 32px',
      position: 'relative',

      border: '1px solid #4d4f66',
      borderRadius: 4,
      backgroundColor: '#2b2c3d',
    },

    tooltip: {
      gridArea: 'tooltip',
    },

    select: {
      width: '100%',
      height: '100%',
      paddingLeft: 10,
    },

    clear: {
      position: 'absolute',
      height: '100%',
      right: 0,
      top: 0,
    },

    popover: {
      width: 300,
    },

    emojiList: {
      maxHeight: 300,
      overflowY: 'auto',
      padding: 8,
      gap: 4,
    }
  }
})

type EmojiPickerProps = {
  emoji?: ReducedEmoji,
  onChange: (emoji?: ReducedEmoji) => void,
  clearable: boolean,
}

export default function EmojiPicker({emoji, onChange, clearable}: EmojiPickerProps): ReactElement {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const emojis = useContext(EmojiContext);
  const { classes } = useStyles();

  return (
    <Popover trapFocus opened={popoverOpened} onChange={setPopoverOpened}>
      <Popover.Target>
          <div className={classes.controlWrapper}>
            <Text className={classes.tooltip} size={'xs'}>Emoji</Text>
            <div className={classes.input}>
              <UnstyledButton
                className={classes.select}
                onClick={() => setPopoverOpened(true)}
              >
                {emoji && <DisplayEmoji emoji={emoji} />}
              </UnstyledButton>
              {(clearable && emoji) && (
                <ActionIcon size={'lg'} onClick={() => onChange()} className={classes.clear}><X size={26} /></ActionIcon>
              )}
            </div>
          </div>
        </Popover.Target>
        <Popover.Dropdown>
          <Tabs defaultValue={emoji?.id !== null ? 'server' : 'general'}>
            <Tabs.List>
              <Tabs.Tab value={'server'}>Server</Tabs.Tab>
              <Tabs.Tab value={'general'}>General</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value={'server'}>
              <SimpleGrid cols={5} className={classes.emojiList}>
                {emojis.guildEmojis.map((guildEmoji) => {
                  return (
                    <ActionIcon
                      variant={guildEmoji.id === emoji?.id ? 'filled' : 'subtle'}
                      key={guildEmoji.id} 
                      onClick={() => {
                        onChange(guildEmoji);
                        setPopoverOpened(false);
                      }}
                      size={'xl'}
                    >
                      <DisplayEmoji emoji={guildEmoji} />
                    </ActionIcon>
                  );
                })}
              </SimpleGrid>
            </Tabs.Panel>
            <Tabs.Panel value={'general'}>
              <SimpleGrid spacing={'xs'} cols={5} className={classes.emojiList}>
                {emojis.generalEmojis.map((generalEmoji) => {
                  return (
                    <ActionIcon
                      variant={generalEmoji.name === emoji?.name ? 'filled' : 'subtle'}
                      key={generalEmoji.name} 
                      onClick={() => {
                        onChange(generalEmoji);
                        setPopoverOpened(false);
                      }}
                      size={'xl'}
                    >
                      <DisplayEmoji emoji={generalEmoji} />
                    </ActionIcon>
                  );
                })}
              </SimpleGrid>
            </Tabs.Panel>
          </Tabs>
        </Popover.Dropdown>
    </Popover>
  )
}
