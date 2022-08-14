import { useState } from 'react'
import ActivityApi from '../../../api/ActivityApi';

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

    const csvData = await ActivityApi.getServerActivityCsv(serverId, start, end);

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
  }
}
