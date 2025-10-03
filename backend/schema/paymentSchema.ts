import { body, param, ValidationChain } from "express-validator";

const createPayment: ValidationChain[] = [
  body("request_service_id")
    .isInt({ min: 1 })
    .withMessage("Request service ID must be a positive integer"),

  body("payment_method")
    .isIn(["CIB", "EDAHABIYA", "FREE_CONSULTATION"])
    .withMessage("Payment method must be CIB, EDAHABIYA, or FREE_CONSULTATION"),

  body("payment_type")
    .isIn(["FULL", "PARTIAL"])
    .withMessage("Payment type must be FULL or PARTIAL"),

  body("amount")
    .isFloat({ min: 0 })
    .withMessage("Amount must be a positive number"),
];

const getPaymentById: ValidationChain[] = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Payment ID must be a positive integer"),
];

const getClientPayments: ValidationChain[] = [
  param("clientId")
    .isInt({ min: 1 })
    .withMessage("Client ID must be a positive integer"),
];

export { createPayment, getPaymentById, getClientPayments };

