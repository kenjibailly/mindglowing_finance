import { Invoice } from "./Invoices";
import { CustomizationSettings } from "./CustomizationSettings";

export interface Project {
  _id: string;
  name: string;
  customer_id: string;
  description: string;
  created_on: string;
  billed: boolean;
}

export interface TimeTracking {
  _id: string;
  name: string;
  start: Date;
  stop?: Date;
}

export interface ProjectExtraData extends Project {
  customer_name: string;
  total_time: string;
  invoice_number?: number;
  running: boolean;
}

// Override fields in TimeTracking for ProjectFetch
export interface TimeTrackingFetch
  extends Omit<TimeTracking, "start" | "stop"> {
  start: string;
  stop: string;
  totalTime: string;
}

// Extend Project and use TimeTrackingFetch in place of TimeTracking
export interface ProjectFetch extends Project {
  invoice: Invoice;
  project: Project;
  customizationSettings: CustomizationSettings;
  customer_name: string;
  total_time: string;
  invoice_number?: number;
}
