export interface PasswordRequirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { id: 'min-length', label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { id: 'uppercase', label: 'At least 1 uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { id: 'lowercase', label: 'At least 1 lowercase letter', test: (pw) => /[a-z]/.test(pw) },
  { id: 'number', label: 'At least 1 number', test: (pw) => /\d/.test(pw) },
  { id: 'special', label: 'At least 1 special character', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];
