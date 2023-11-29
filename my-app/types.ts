export interface SendEmailInterface {
    order_id: string,
    amount: number,
    address: string,
    date_:Date,
    from: string;
    cust_name: string;
    cust_lname: string,
    to: string;
    subject: string;
    text: string;
}