import { getUserActivityCsv } from '@eve/panel/feature/core';
import { getCookie } from 'cookies-next';
import { useState } from 'react';

type UseUserVoiceActivityCsvExportData = {
  loading: boolean,
  doExport: () => void,
}

export default function useUserVoiceActivityCsvExport(
  userId: string, start: Date, end: Date,
): UseUserVoiceActivityCsvExportData {
  const [loading, setLoading] = useState(false);

  async function doExport() {
    setLoading(true);
    const apiKey = String(getCookie('apiKey'));

    const csvData = await getUserActivityCsv(userId, start, end, apiKey);

    const downloadElem = document.createElement('a');
    const url = window.URL.createObjectURL(new Blob([csvData]));
    downloadElem.setAttribute('href', url);
    downloadElem.setAttribute('download', `voice_activity_${userId}.csv`);

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
