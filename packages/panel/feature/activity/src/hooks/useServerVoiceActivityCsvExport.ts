import { getServerActivityCsv } from '@eve/panel/feature/core';
import { getCookie } from 'cookies-next';
import { useState } from 'react';

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
    const apiKey = String(getCookie('apiKey'));

    const csvData = await getServerActivityCsv(serverId, start, end, apiKey);

    const downloadElem = document.createElement('a');
    const url = window.URL.createObjectURL(new Blob([csvData]));
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
