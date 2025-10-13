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

export function confirmationMail(url: string) {
  const content = `<a href="${url}"><h1>Confirm your email</h1></a>`;
  return htmlTemplate(content);
}

export function campaignMail(
  campaignText: string,
  campaignKey: string,
  email: string,
) {
  const content = `
  <h1>${campaignText}</h1>
    <img src="http://localhost:3000/campaign/${campaignKey}/user/${email}/image.png" style="display:none" />
    <a href="http://localhost:3000/click/${campaignKey}/user/${email}">Testing</a>
  `;
  return htmlTemplate(content);
}
