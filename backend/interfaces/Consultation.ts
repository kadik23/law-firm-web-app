export interface IConsultation {
  id?: number;
  problem_id: number;
  client_id: number;
  problem_description: string;
  problem_name: string;
  time: string;
  date: string;
  status: 'Accepted' | 'Pending' | 'Canceled';
  mode: 'online' | 'onsite';
  meeting_link?: string;
} 