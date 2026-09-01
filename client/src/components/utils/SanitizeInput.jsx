export const sanitizeInput = {
  // Sanitize
  sanitize: {
    text: (value = "") =>
      value
        .replace(/<[^>]*>/g, "")
        .trim()
        .replace(/\s+/g, " "),

    username: (value = "") => value.trim().toLowerCase().replace(/<[^>]*>/g, "").replace(/\s+/g, ""),

    email: (value = "") => value.trim().replace(/<[^>]*>/g, ""),

    number: (value = "") => value.replace(/\D/g, ""),

    decimal: (value = "") => {
      const cleaned = value.replace(/[^\d.]/g, "");
      const [whole, ...fraction] = cleaned.split(".");
      return fraction.length ? `${whole}.${fraction.join("")}` : whole;
    },

    phone: (value = "") => value.replace(/[^\d+]/g, ""),

    equipment: (value = "") => value.trim().replace(/\s+/g, " "),

    category: (value = "") => value.trim().replace(/\s+/g, " "),
  },

  // Validation Regex
  regex: {
    TEXT: /^[A-Za-z0-9\s.,!?()\-]+$/,
    CLEAN_TEXT: /^[^<>&"'`]*$/,
    USERNAME: /^[A-Za-z][A-Za-z0-9_-]{3,23}$/,
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%]).{8,24}$/,
    NUMBER: /^\d+$/,
    DECIMAL: /^\d+(\.\d{1,2})?$/,
    PHONE: /^(09|\+639)\d{9}$/,
    EQUIPMENT: /^[A-Za-z0-9\s\-().]{3,100}$/,
    CATEGORY: /^[A-Za-z\s]{3,50}$/,
    COMPANY_ID: /^\d{4,10}$/,
    OBJECT_ID: /^[a-f\d]{24}$/i,
    UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  },

  // Validation Helpers
  isValid: {
    text: (value) => sanitizeInput.regex.TEXT.test(value),
    cleanText: (value) => sanitizeInput.regex.CLEAN_TEXT.test(value),
    username: (value) => sanitizeInput.regex.USERNAME.test(value),
    email: (value) => sanitizeInput.regex.EMAIL.test(value),
    password: (value) => sanitizeInput.regex.PASSWORD.test(value),
    number: (value) => sanitizeInput.regex.NUMBER.test(value),
    decimal: (value) => sanitizeInput.regex.DECIMAL.test(value),
    phone: (value) => sanitizeInput.regex.PHONE.test(value),
    equipment: (value) => sanitizeInput.regex.EQUIPMENT.test(value),
    category: (value) => sanitizeInput.regex.CATEGORY.test(value),
    companyId: (value) => sanitizeInput.regex.COMPANY_ID.test(value),
    objectId: (value) => sanitizeInput.regex.OBJECT_ID.test(value),
    uuid: (value) => sanitizeInput.regex.UUID.test(value),
  },
};
