import { Ajax } from '@eve/panel/feature/core';
import { showNotification } from '@mantine/notifications';
import { useCallback, useState } from 'react';

type UseUserVoiceActivityCsvExportData = {
  loading: boolean,
  doExport: () => void,
}

export default function useUserVoiceActivityCsvExport(
  userId: string, start: Date, end: Date,
): UseUserVoiceActivityCsvExportData {
  const [loading, setLoading] = useState(false);

  const doExport = useCallback(async () => {
    setLoading(true);

    const body = JSON.stringify({ startDate: start.toISOString(), endDate: end.toISOString() });
    const response = await Ajax.post<string>(`/v1/user/${userId}/activityCsv`, body);
    if (!response.data) {
      showNotification({
        title: 'Failed to export',
        message: `An error occurred while while creating the csv: ${response.error}`,
        color: 'red',
      });
      return;
    }

    const downloadElem = document.createElement('a');
    const url = window.URL.createObjectURL(new Blob([response.data]));
    downloadElem.setAttribute('href', url);
    downloadElem.setAttribute('download', `voice_activity_${userId}.csv`);

    document.body.appendChild(downloadElem);
    downloadElem.click();
    downloadElem.remove();

    setLoading(false);
  }, [start, end, userId]);

  return {
    loading,
    doExport,
  };
}
