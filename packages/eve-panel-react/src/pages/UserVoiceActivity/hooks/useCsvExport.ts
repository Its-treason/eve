import { useState } from 'react'
import ActivityApi from '../../../api/ActivityApi';

type UseCsvExportData = {
  loading: boolean,
  doExport: () => void,
}

export default function useCsvExport(userId: string, start: Date, end: Date): UseCsvExportData {
  const [loading, setLoading] = useState(false);

  async function doExport() {
    setLoading(true);

    const csvData = await ActivityApi.getUserActivityCsv(userId, start, end);

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
  }
}
