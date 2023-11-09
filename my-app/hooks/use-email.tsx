// sendEmail.ts in the /email folder

// Define an interface for the email parameters
export interface SendEmailInterface {
    to: string;
    subject: string;
    text: string;
}

// Function to send an email using the provided email service API
export async function sendEmail({ to, subject, text }: SendEmailInterface): Promise<any> {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000'; // Use your deployment base URL in production
    const sendEmailUrl = `${baseUrl}/api/send-email`;
    console.log('Sending to', sendEmailUrl);
    const response = await fetch(sendEmailUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, text }),
    });
console.log('response', response)
    if (!response.ok) {
        throw new Error(`Email sending failed: ${response.statusText}`);
    }

    return response.json();
}
