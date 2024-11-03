export interface Project {
  _id: string;
  name: string;
  customer_id: string;
  description: string;
  timeTracking: Array<TimeTracking>;
  created_on: Date;
  billed: boolean;
}

export interface TimeTracking {
  _id: string;
  name: string;
  start: Date;
  stop: Date;
}

export interface ProjectExtraData extends Project {
  customer_name: string;
  total_time: string;
}
