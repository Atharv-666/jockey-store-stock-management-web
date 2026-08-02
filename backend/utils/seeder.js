import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';
import SaleHistory from '../models/SaleHistory.js';
import { mockProducts, mockSaleHistory } from './mockStore.js';

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    // Drop collections to clear old conflicting data
    await Product.collection.drop().catch(() => {});
    await SaleHistory.collection.drop().catch(() => {});

    console.log('Seeding Jockey Store Sample Data...');

    // Prepare products without _id string so Mongoose auto-generates ObjectIds
    const productsToCreate = mockProducts.map((p) => {
      const { _id, ...rest } = p;
      return {
        ...rest,
        variants: p.variants.map((v) => {
          const { _id: vId, ...vRest } = v;
          return vRest;
        }),
      };
    });

    const createdProducts = await Product.create(productsToCreate);

    // Map sales to created products
    const salesToCreate = mockSaleHistory.map((s, idx) => {
      const { _id, ...rest } = s;
      const matchedProd = createdProducts.find(
        (p) => p.name.toLowerCase() === s.productName.toLowerCase()
      ) || createdProducts[idx % createdProducts.length];

      return {
        ...rest,
        productId: matchedProd._id,
      };
    });

    await SaleHistory.create(salesToCreate);

    console.log('Jockey Store Sample Data Imported Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error with Jockey sample data import: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
}
