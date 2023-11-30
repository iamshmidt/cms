
import { SendEmailInterface} from "@/types";
import logoImage from '@/public/4.png';
export const EmailTemplate: React.FC<Readonly<SendEmailInterface>> = ({
  order_id,
  amount,
  address,
  date_,
  from,
  cust_name,
  cust_lname,
  to,
  subject,
  text,
  product
}) => {
  // Calculate the total
  const total = product ? product.reduce((acc, item) => acc + item.price, 0) : 0;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#374151', padding: '20px' }}>
      {/* Ensure the correct path for the image or host it online */}
      <img src={logoImage.src} alt="OxxyKnits" style={{ maxWidth: '100%', marginBottom: '20px' }} />
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: '#111827' }}>Order Confirmation</h1>
        <p style={{ marginBottom: '16px', fontSize: '16px', color: '#4B5563' }}>Hello {cust_name},</p>
        <p style={{ marginBottom: '16px', fontSize: '16px', color: '#4B5563' }}>You got a new order! Here are the order details:</p>
        <ul style={{ listStyleType: 'none', padding: '0', marginBottom: '20px' }}>
          <li style={{ marginBottom: '8px' }}><strong>Order ID:</strong> {order_id}</li>
          <li style={{ marginBottom: '8px' }}><strong>Amount:</strong> {amount}</li>
          <li style={{ marginBottom: '8px' }}><strong>Address:</strong> {address}</li>
          <li style={{ marginBottom: '8px' }}><strong>Date:</strong> {date_}</li>
          <li style={{ marginBottom: '8px' }}><strong>From:</strong> {from}</li>
          {product && product.map((item, index) => (
            <li key={index} style={{ marginBottom: '8px' }}><strong>Product:</strong> {item.name} - ${item.price}</li>
          ))}
          <li style={{ marginBottom: '8px' }}><strong>Total:</strong> ${total}</li>
        </ul>
        {product && product.map((item, index) => (
          <div key={index}>
            <h3>{item.name}</h3>
            <p>Price: ${item.price}</p>
            <img src={item.image} alt={item.name} style={{ maxWidth: '100%', marginBottom: '20px' }} />
            <a href={item.url}>View Product</a>
          </div>
        ))}
        <p style={{ fontSize: '16px', color: '#4B5563' }}>If you have any questions, reply to this email or contact us at {to}.</p>
      </div>
    </div>
  );
};


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