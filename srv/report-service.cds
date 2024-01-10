using {com.ndbs.salestracking as st} from '../db/schema';

service ReportService @(
        path    : 'reportService',
        requires: 'authentication-user'
) {
        @cds.search: {
                totalPrice,
                quantity,
                date
        }
        entity Sales          as select from st.Sales;

        entity Products       as select from st.Products;
        entity Plant          as select from st.Plants;

        entity Customers @(restrict: [
                {
                        grant: 'READ',
                        to   : 'Normal User'
                },
                {
                        grant: [
                                'READ',
                                'WRITE'
                        ],
                        to   : 'Admin'
                },
                {
                        grant: ['*'],
                        to   : 'God'
                }
        ])                    as select from st.Customers;

        entity ProductsPlants as projection on st.ProductsPlants;

        entity Report         as
                select from Sales
                left join Products
                        on Sales.productID = Products.ID
                left join Customers
                        on Sales.customerID = Customers.ID
                left join Plant
                        on Products.plant = Plant.ID
                {
                        Products.name     as ProductName,
                        Customers.name    as CustomerName,
                        Sales.quantity,
                        Sales.totalPrice,
                        Products.currency,
                        Plant.description as PlantName
                };
}
