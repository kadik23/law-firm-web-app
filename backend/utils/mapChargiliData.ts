export const mapPaymentMethodToChargili = (
  method: "CIB" | "EDAHABIYA"
): "cib" | "edahabia" => {
  switch (method) {
    case "CIB":
      return "cib";
    case "EDAHABIYA":
      return "edahabia";
    default:
      return "edahabia";
  }
};

export const mapChargiliStatus = (chargiliStatus: string): 'COMPLETED' | 'FAILED' | 'CANCELLED' => {
  switch (chargiliStatus) {
    case 'paid':
      return 'COMPLETED';
    case 'failed':
      return 'FAILED';
    case 'canceled':
      return 'CANCELLED';
    default:
      return 'FAILED';
  }
}
