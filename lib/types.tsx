export type Bill = {
  relevance: number;
  state: string;
  bill_number: string;
  bill_id: number;
  change_hash: string;
  url: string;
  text_url: string;
  research_url: string;
  last_action_date: string;
  last_action: string;
  title: string;
  created_at: Date;
  last_updated?: Date;
};

export type UpdatedBillFields = {
  bill_id: number;
  bill_number: string;
  relevance?: string;
  state?: string;
  change_hash: string;
  url: string;
  text_url?: string;
  research_url?: string;
  last_action_date?: string;
  last_action?: string;
  title?: string;
  updatedDate: Date;
};

export type NewBill = [bill_number: string, url: string];
