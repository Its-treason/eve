import { Ajax } from '@eve/panel/feature/core';
import { useState } from 'react';
import { showNotification } from '@mantine/notifications';

type UseServerVoiceActivityCsvExportData = {
  loading: boolean,
  doExport: () => void,
}

export default function useServerVoiceActivityCsvExport(
  serverId: string, start: Date, end: Date,
): UseServerVoiceActivityCsvExportData {
  const [loading, setLoading] = useState(false);

  async function doExport() {
    setLoading(true);
    const body = JSON.stringify({ startDate: start.toISOString(), endDate: end.toISOString() });
    const response = await Ajax.post<string>(`/v1/server/${serverId}/activityCsv`, body);

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
    downloadElem.setAttribute('download', `voice_activity_${serverId}.csv`);

    document.body.appendChild(downloadElem);
    downloadElem.click();
    downloadElem.remove();

    setLoading(false);
  }

  return {
    loading,
    doExport,
  };
}
