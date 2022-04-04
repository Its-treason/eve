import React,{ ReactElement } from 'react';
import { Avatar, Divider, Group, Paper, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import styles from './styles/LinkUserServer.module.css';

interface LinkUserServerProps {
  to?: string,
  href?: string,
  icon: string,
  text: string,
  subtext?: string,
}

export default function KibanaButton({ to, icon, text, subtext, href }: LinkUserServerProps): ReactElement {
  return (
    <Paper
      component={Link}
      to={to || ''}
      p="md"
      withBorder
      className={styles.paper}
      onClick={() => href && window.location.replace(href)}
      sx={() => ({
        backgroundColor: '#1b1c2e',
      })}
    >
      <Group direction="row">
        <Avatar src={icon} size={'lg'} />
        <Divider orientation="vertical" />
        <Group direction='column'>
          <Text className={styles.text}>{text}</Text>
          {subtext && <Text size={'xs'}>{subtext}</Text>}
        </Group>
      </Group>
    </Paper>
  );
}
