namespace com.ndbs.salestracking;

entity Customers {
    key ID      : UUID;
        name    : String(50) not null;
        address : String(150);
        toSales : Association to one Sales on toSales.customerID = $self.ID;
}

entity Plants {
    key ID          : UUID;
        description : String(100);
        toProducts  : Association to many ProductsPlants
                          on toProducts.toPlant = $self;
}

entity ProductsPlants {
    productID : Products:ID;
    plantID   : Plants:ID;
    toProduct : Association to one Products
                    on toProduct.ID = $self.productID;
    toPlant   : Association to one Plants
                    on toPlant.ID = $self.plantID;
}

entity Products {
    key ID        : UUID;
        name      : String(50) not null;
        plant     : Plants:ID;
        toPlants  : Association to many ProductsPlants
                        on toPlants.toProduct = $self;
        cost      : Decimal(13, 2) not null;
        unitprice : Decimal(13, 2) not null;
        currency  : String(4) not null;
        toSales   : Association to one Sales on toSales.productID = $self.ID;
}

entity Sales {
    key salesNumber  : UUID;
        productID    : Products:ID;
        toProductID  : Composition of many Products
                           on toProductID.ID = $self.productID;
        customerID   : Customers:ID;
        toCustomerID : Association to many Customers
                           on toCustomerID.ID = $self.customerID;
        quantity     : Integer not null;
        totalPrice   : Decimal(13, 2) not null;
        date         : Date;
}


/*
* Sales <=> Product
* Composition M-1
* Bir satışın sadece bir tane urunu olabilir. Bir ürünün bir çok satışı olabilir
*/

/*
* Sales <=> Customer
* Association M-1
* Bir satışın bir müşterisi olacaktır. Bir müşterinin birden çok satışı olabilir.
*/

/*
* Product <=> Plant
* Association N-M
* Bir ürün farklı plantlarda üretilebilir. Bir plant farklı ürünler üretebilir.
*/
