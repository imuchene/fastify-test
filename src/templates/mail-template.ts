const htmlTemplate = (content: string) => {
  return `
  <html>
    <body>
      ${content}
    </body>
  </html>
  `;
};

export function welcomeMail() {
  const content = `<html>Welcome to Inn Box!</html>`;
  return htmlTemplate(content);
}
