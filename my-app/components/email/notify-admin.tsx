
import { SendEmailInterface} from "@/types";
import logoImage from '@/public/4.png';
export const EmailTemplate: React.FC<Readonly<SendEmailInterface>> = ({
  orderNumber,
  amount,
  address,
  date_,
  from,
  cust_name,
  cust_lname,
  to,
  subject,
  text,
  product,
  total,
  tracking
}) => {
  // Calculate the total
  let shipping = 6.00;
// Calculate the total price of the products.
console.log('text', text)

let trackingUrl = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${tracking}`;
let shipping_total = (total || 0) + shipping;
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#374151', padding: '20px', maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>

    <div style={{ textAlign: 'center' }}>
      <div style={{ width: '100%', margin: "0 auto", display: "flex", justifyContent: "center" }}>
        <a href="https://oxxyknits.com"><img src="https://i.imgur.com/nprAA9n.png" alt="Logo" style={imageStyle} /></a>
      </div>
      <h3 style={{ marginBottom: '16px', fontSize: '16px', color: '#4B5563' }}>Hi {cust_name},</h3>
      <p style={{ marginBottom: '16px', fontSize: '16px', color: '#4B5563' }}>{text}</p>
    </div>
    <h2 style={{ textAlign: 'center' }}>ORDER NO.  {orderNumber}</h2>
  
    {/* <p style={{ textAlign: 'center' }}>{date_}</p> */}
    {tracking ? (<p style={{ textAlign: 'center' }}>Tracking Number# {tracking}</p>) : null}

    {tracking? ( 
    <div style={{width:'100%', display:"flex", flexDirection:'column', justifyContent: 'center'}}>
    <div style={buttonStyle}>
    <a href={trackingUrl} target="_blank" rel="noopener noreferrer" style={styleLink}>TRACK YOUR ORDER</a>
  </div></div>) : null}
   {tracking ? (<p style={{ textAlign: 'center' }}>Estimated Delivery: 4-9 days</p>) :  <h2 style={{textAlign: 'left'}}>Processing</h2>}
   
  {product && product.map((item, index) => (
     <div key={index}>
    
        <table style={tableStyle}  key={index}>
        <tbody>
          <tr>
            <td style={{ ...tdStyle, textAlign: 'left' }}>
            <h3>{item.name}</h3>
              <img src={item.image} alt={item.name}  style={imageStyle} />
           
            </td>
            <td style={tdStyle}>
              <p>x {item.amount}</p>
              <h4>{item.price}</h4>
              <div style={buttonStyle} ><a href={item.url} style={styleLink}>View Product</a></div>
            </td>
          </tr>
    
        </tbody>
      </table>
      </div>
        ))}
         <table style={{ ...tableStyle, marginTop: '20px', textAlign: 'right' }}>
      <tbody>
        {/* <tr>
          <td>Discount (JUSTINACASE)</td>
          <td>- $18.00</td>
        </tr> */}
        {total ? (
          <>
        <tr>
          <td>Subtotal</td>
          <td><strong>${total}</strong></td>
        </tr>
        <tr>
          <td>Shipping (4-9 days)</td>
          <td><strong>$6.00</strong></td>
        </tr>
        <tr>
          <td style={totalStyle}><h3>Total</h3></td>
          <td style={totalStyle}><strong>${shipping_total.toFixed(2)}</strong></td>
        </tr></>) : null}
        
      </tbody>
    </table>
 {amount ? (<ul style={{ listStyleType: 'none', padding: '0', marginBottom: '20px' }}>
        <li style={{ marginBottom: '8px' }}><strong>Amount:</strong> {amount}</li>
        <li style={{ marginBottom: '8px' }}><strong>Address:</strong> {address}</li>
        <li style={{ marginBottom: '8px' }}><strong>Date:</strong> {date_}</li>
        </ul>) : null}
       
     <p style={{ fontSize: '16px', color: '#4B5563' }}>If you have any questions, reply to this email or contact us at {to}.</p>
  </div>
  );
};


const imageStyle = {
    width: '100%',
    height: 'auto',
    display: 'block',
    maxWidth:'200px'
  };
  const buttonStyle = {
    maxWidth: '180px', // w-auto
    textAlign: 'center',
    borderRadius: '10px', // rounded-full
    backgroundColor: 'black', // bg-black
    border: 'transparent', // border-transparent
    padding: '10px 20px', // px-5 py-3 (Tailwind's default spacing scale)
    opacity: '1', // default opacity
    color: 'white', // text-white
    fontWeight: '600', 
  
  };

  const styleLink = {
    textDecoration: 'none',
    color: 'white',
    fontWeight: '600',
  }

  const tableStyle = {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  const tdStyle = {
    paddingBottom: '10px',
    borderBottom: '1px solid #ccc',
    textAlign: 'right',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, Karla",

  };

  const totalStyle = {
    fontWeight: 'bold'
  };