// sendEmail.ts in the /email folder

import axios from "axios";
import { SendEmailInterface} from "@/types";
// Define an interface for the email parameters

// Function to send an email using the provided email service API
// export async function sendEmail({ to, subject, text }: SendEmailInterface): Promise<any> {
export async function sendEmail(emailDetails: SendEmailInterface): Promise<{ data?: any; error?: string }> {
    // console.log('sendEmail!!', to, subject, text)
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000'; // Use your deployment base URL in production
    const sendEmailUrl = `${baseUrl}/api/send-email`;
    try {
        console.log('Sending to', sendEmailUrl);
        const response = await axios.post(sendEmailUrl, emailDetails);
        return { data: response.data };
      } catch (error) {
        console.error('Error sending email:', error);
        return { error: 'Failed to send email' };
      }
//     console.log('Sending to', sendEmailUrl);
//     await axios.post(`${sendEmailUrl}`, emailDetails)
//     const response = await fetch(sendEmailUrl, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(emailDetails),
//     });
// console.log('response', response)
//     if (!response.ok) {
//         throw new Error(`Email sending failed: ${response.statusText}`);
//     }

    // return response.json();
}
