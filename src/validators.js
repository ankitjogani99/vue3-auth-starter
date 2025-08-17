function isEmail(v='') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function req(v) {
  return v !== undefined && v !== null && String(v).trim() !== '';
}
function minLen(v, n) {
  return String(v || '').trim().length >= n;
}
function isDigits(v) {
  return /^\d+$/.test(String(v || ''));
}

export function validateLogin({ email, password }) {
  const e = {};
  if (!req(email)) e.email = 'Email is required';
  else if (!isEmail(email)) e.email = 'Invalid email';
  if (!req(password)) e.password = 'Password is required';
  else if (!minLen(password, 6)) e.password = 'Password must be at least 6 characters';
  return e;
}

export function validateRegister(payload) {
  const e = {};
  if (!req(payload.usdot_number)) e.usdot_number = 'USDOT is required';
  if (!req(payload.timezone)) e.timezone = 'Timezone is required';
  if (!req(payload.business_name)) e.business_name = 'Business name is required';
  if (!req(payload.companyType)) e.companyType = 'Company type is required';
  if (!req(payload.first_name)) e.first_name = 'First name is required';
  if (!req(payload.last_name)) e.last_name = 'Last name is required';
  if (!req(payload.address)) e.address = 'Address is required';
  if (!req(payload.email)) e.email = 'Email is required';
  else if (!isEmail(payload.email)) e.email = 'Invalid email';
  if (!req(payload.phone_number)) e.phone_number = 'Phone is required';
  else if (!isDigits(payload.phone_number)) e.phone_number = 'Phone must be digits only';
  if (!payload.product || !Array.isArray(payload.product) || payload.product.length === 0) e.product = 'At least one product is required';
  return e;
}