export interface ProductEmail {
    name: string;
    price: string;
    url: string;
    image: string;
    product_url: string;
    amount: number;
}
export interface SendEmailInterface {
    orderNumber: number,
    amount?: number,
    address: string,
    date_: string,
    from: string;
    cust_name: string;
    cust_lname: string,
    to: string;
    subject: string;
    text: string;
    // total: number;
    // product_url: string;
    product?: ProductEmail[]; // Including the Product object
    total?: number;
    tracking?: string;
}