// Shared by the contact form (client) and /api/contact (server), so both
// apply exactly the same rules and the browser never disagrees with the server.

export const NAME_MAX = 100;
export const EMAIL_MAX = 200;
export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 3000;

export type ContactField = "name" | "email" | "message";
export type ContactErrors = Partial<Record<ContactField, string>>;

const EMAIL_RE = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/;

export function validateContact(v: { name: string; email: string; message: string }): ContactErrors {
  const errors: ContactErrors = {};

  if (!v.name) errors.name = "Please add your name.";
  else if (v.name.length > NAME_MAX) errors.name = `Keep your name under ${NAME_MAX} characters.`;

  if (!v.email) errors.email = "Please add your email so I can reply.";
  else if (v.email.length > EMAIL_MAX || !EMAIL_RE.test(v.email)) {
    errors.email = "That email address doesn't look right.";
  }

  if (v.message.length < MESSAGE_MIN) errors.message = "Write a little more so I know what you need.";
  else if (v.message.length > MESSAGE_MAX) errors.message = `Please keep it under ${MESSAGE_MAX} characters.`;

  return errors;
}
