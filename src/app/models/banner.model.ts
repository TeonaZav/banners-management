export interface Banner {
  id: string;
  name: string;
  channelId: string;
  fileId: string;
  language: string;
  zoneId: string;
  startDate: Date;
  endDate: Date;
  url: string;
  active: boolean;
  priority: number;
  labels: string[];
}
