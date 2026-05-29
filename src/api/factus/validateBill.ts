import apiFetch from "../client";
export interface FactusPaymentDetail {
  payment_form: number;
  payment_method_code: string;
  reference_code: string;
  amount: string;
  due_date: string;
}
/** Persona jurídica: `company`. Persona natural: `names` (no enviar ambos). */
export interface FactusCustomer {
  identification_document_code?: string;
  identification?: string;
  company?: string;
  names?: string;
  trade_name?: string;
  address?: string;
  email?: string;
  phone?: string;
  legal_organization_code?: string;
  tribute_code?: string;
  municipality_code?: string;
}
export interface FactusItemTax {
  code?: string;
  rate?: string;
  is_excluded?: boolean,
}
export interface FactusItem {
  code_reference: string;
  name: string;
  quantity: string;
  discount_rate: string;
  price: string;
  unit_measure_code: string;
  standard_code: string;
  taxes: FactusItemTax[];
}
export interface ValidateFactusBillBody {
  companyId: number;
  reference_code: string;
  document: string;
  numbering_range_id?: number;
  operation_type: string;
  send_email: boolean;
  payment_details: FactusPaymentDetail[];
  cash_rounding_amount: string;
  observation: string;
  customer: FactusCustomer;
  items: FactusItem[];
}
export const validateFactusBill = async (body: ValidateFactusBillBody) => {
  const response = await apiFetch<any>("factus/bills/validate", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!response) {
    throw new Error("No response from server");
  }
  return response;
};