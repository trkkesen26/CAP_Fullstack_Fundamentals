const cds = require('@sap/cds')

class ReportService extends cds.ApplicationService {
    async init() {
        const db = await cds.connect.to("db"),
        {
            Products,Sales,Plant,Customers
        }=db.entities("ReportService");

        this.before('POST', Sales, async (req) => {
            let pID = req.data.productID;

            let product = await db.run(SELECT.one.from(Products).where({ ID: pID }));
            if (product != null)
                req.data.totalPrice = product.unitprice * req.data.quantity;
            else
                req.reject(500, "Could not be found specified product.");
        })

        return super.init()
    }
  }
  module.exports = ReportService