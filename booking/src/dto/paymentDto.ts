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
