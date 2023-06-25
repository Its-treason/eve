import { Layout } from '@eve/panel/feature/core';
import LoginFirstComponent from '@eve/panel/feature/login-first';

type LoginFirstProps = {
  searchParams: {
    error?: string,
  }
}

export const metadata = {
  title: 'Login - EVE',
};

export const dynamic = 'force-dynamic'

export default function LoginFirst({ searchParams }: LoginFirstProps) {
  return (
    <Layout showLogoutBtn={false}>
      <LoginFirstComponent error={searchParams.error} />
    </Layout>
  );
}
