import { UseFormReturnType } from '@mantine/form';
import router from 'next/router';
import { useEffect } from 'react';

export default function useConfirmLeave(form: UseFormReturnType<any> ) {
  useEffect(() => {
    // For SSR
    if (window === undefined) {
      return;
    }

    const warningText =
      'You have unsaved changes - are you sure you wish to leave this page?';
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!form.isDirty()) return;
      e.preventDefault();
      return (e.returnValue = warningText);
    };
    const handleBrowseAway = () => {
      if (!form.isDirty()) return;
      if (window.confirm(warningText)) return;
      router.events.emit('routeChangeError');
      throw 'routeChange aborted.';
    };
    window.addEventListener('beforeunload', handleWindowClose);
    router.events.on('routeChangeStart', handleBrowseAway);
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
      router.events.off('routeChangeStart', handleBrowseAway);
    };
  }, [form]);
}
