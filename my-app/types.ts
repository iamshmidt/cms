export interface ProductEmail {
    name: string;
    price: number;
    url: string;
    image: string;
    product_url: string;
}
export interface SendEmailInterface {
    order_id: string,
    amount: number,
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
}