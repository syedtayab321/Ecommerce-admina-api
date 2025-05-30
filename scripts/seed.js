import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import config from '../config/env.js';
import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';
import Sale from '../models/Sale.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

const categories = ['Electronics', 'Clothing', 'Home', 'Books', 'Toys'];
const paymentMethods = ['credit_card', 'paypal', 'cash_on_delivery'];

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info('MongoDB Connected...');
  } catch (err) {
    logger.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

const createAdminUser = async () => {
  const adminUser = new User({
    name: 'Admin User',
    email: 'admin@example.com',
    password: await bcrypt.hash('123456', 10),
    isAdmin: true
  });
  
  await adminUser.save();
  logger.info('Admin user created');
};

const generateProducts = async (count = 50) => {
  await Product.deleteMany();
  await Inventory.deleteMany();
  
  const products = [];
  
  for (let i = 1; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const price = parseFloat((Math.random() * 1000 + 10).toFixed(2));
    const quantity = Math.floor(Math.random() * 100);
    
    const product = new Product({
      name: `Product ${i}`,
      description: `This is a sample ${category} product`,
      price,
      category,
      sku: `SKU-${1000 + i}`,
      images: [`image${i}-1.jpg`, `image${i}-2.jpg`]
    });
    
    await product.save();
    
    await Inventory.create({
      product: product._id,
      quantity,
      lowStockThreshold: 10
    });
    
    products.push(product);
  }
  
  logger.info(`${count} products and inventory items created`);
  return products;
};

const generateSales = async (products, count = 200) => {
  await Sale.deleteMany();
  
  for (let i = 1; i <= count; i++) {
    const saleDate = new Date();
    saleDate.setDate(saleDate.getDate() - Math.floor(Math.random() * 365));
    
    const itemsCount = Math.floor(Math.random() * 5) + 1;
    const saleItems = [];
    let totalAmount = 0;
    
    for (let j = 0; j < itemsCount; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 5) + 1;
      
      saleItems.push({
        product: product._id,
        quantity,
        priceAtSale: product.price
      });
      
      totalAmount += product.price * quantity;
    }
    
    await Sale.create({
      items: saleItems,
      totalAmount,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      status: 'completed',
      saleDate
    });
  }
  
  logger.info(`${count} sales created`);
};

const seedDatabase = async () => {
  await connectDB();
  await createAdminUser();
  const products = await generateProducts();
  await generateSales(products);
  process.exit();
};

seedDatabase();