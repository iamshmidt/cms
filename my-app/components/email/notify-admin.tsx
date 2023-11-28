import * as React from 'react';
import { SendEmailInterface} from "@/types";
import {
  Html,
  Body,
  Head,
  Heading,
  Hr,
  Container,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export const EmailTemplate: React.FC<Readonly<SendEmailInterface>> = ({
  order_id,
  amount,
  address,
  date,
  from,
  cust_name,
  cust_lname,
  to,
  subject,
  text
}) => (
  <Html>
  <Head />
  <Preview>New message from your portfolio site</Preview>
  <Body  style={main}>
    <Container  style={container}>
      <Section className="max-w-xl mx-auto mt-10 p-8 bg-white shadow-md rounded-lg">
        <Heading style={h1}>
        Thanks for your order! We'll send you more details as soon as it's processed. Get ready for something great
        </Heading>
        {/* <Text  style={text}> */}
          {subject}
        {/* </Text> */}
        <Hr style={{ borderTop: '1px solid #CBD5E0', margin: '24px 0' }} />
        <Text className="text-sm text-gray-500">
        Sent by: <span style={{ fontWeight: '500', color: '#2D3748' }}>{cust_name} {cust_lname}</span>
       </Text>
      </Section>
    </Container>
  </Body>
</Html>
);

const main = {
  backgroundColor: '#E2E8F0', color: '#000', fontFamily: 'Arial, sans-serif'};

const container = {
  maxWidth: '600px',
  margin: '40px auto',
  padding: '20px',
  backgroundColor: '#FFF',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px'
};

const h1 = {
  fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' 
};

const text = {
  color: '#aaaaaa',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 40px',
};