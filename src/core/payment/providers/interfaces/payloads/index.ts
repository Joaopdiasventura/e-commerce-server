export type IdentificationType = "CPF" | "CNPJ";

export interface PayerIdentification {
  type: IdentificationType;
  number: string;
}

export interface Payer {
  email: string;
  first_name?: string;
  last_name?: string;
  identification?: PayerIdentification;
}

export interface BoletoAddress {
  zip_code: string;
  federal_unit: string;
  city: string;
  neighborhood: string;
  street_name: string;
  street_number: string;
}

export interface BasePaymentPayload {
  transaction_amount: number;
  description: string;
  payer: Payer;
  external_reference?: string;
  notification_url?: string;
}

export interface PixPaymentPayload extends BasePaymentPayload {
  payment_method_id: "pix";
  date_of_expiration?: string;
}

export interface CardPaymentPayload extends BasePaymentPayload {
  payment_method_id: string;
  token: string;
  installments: number;
  issuer_id?: number;
}

export interface BoletoPaymentPayload extends BasePaymentPayload {
  payment_method_id: "bolbradesco";
  cpf?: string;
  payer: Payer & {
    identification: PayerIdentification;
    first_name: string;
    last_name: string;
    address: BoletoAddress;
  };
  installments: number;
  date_of_expiration?: string;
}

export type MercadoPagoPaymentPayload =
  | PixPaymentPayload
  | CardPaymentPayload
  | BoletoPaymentPayload;
