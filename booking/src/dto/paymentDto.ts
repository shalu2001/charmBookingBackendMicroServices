export interface PayHereNotifyDTO {
  merchant_id: string;
  order_id: string;
  payment_id: string;
  payhere_amount: string;
  payhere_currency: string;
  status_code: string;
  md5sig: string;
  method: string;
}

export type PayHereOAuthResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
};

export type PayHereRefundResponse = {
  status: number;
  msg: string;
  data: number;
};
