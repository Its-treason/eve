import { ReducedServer, ReducedUser } from '@eve/types/api';
import { Button, Container, Group, Image, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import { ArrowBack } from 'tabler-icons-react';

type SubHeadingProps = {
  backTo?: string,
  context?: ReducedServer|ReducedUser,
}

export default function SubHeading({ backTo, context }: SubHeadingProps) {
  const router = useRouter();

  return (
    <Container
      sx={(theme) => ({
        backgroundColor: theme.colors.dark[8],
        padding: '8px 0',
        width: '100 hw',
        maxWidth: 'unset',
        boxShadow: theme.shadows.sm,
      })}
    >
      <Group 
        position={'apart'}
        spacing={'xl'}
        sx={(theme) => ({
          maxWidth: 1320,
          width: '100%',
          margin: '0 auto',
          padding: '0 16px',
        })}
      >
        {backTo ? (
          <Button
            variant={'subtle'}
            leftIcon={<ArrowBack />}
            onClick={() => router.push(backTo)}
          >
            Back
          </Button>
        ) : <div />}
        {context ? (
          <Group sx={{ marginRight: 16 }}>
            <Image src={context.icon} height={30} width={30} radius={4} />
            <Text>{context.name}</Text>
          </Group>
        ) : <div />}
      </Group>
    </Container>
  )
}
