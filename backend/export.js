// backend/exportCSV.js
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { Parser } = require('json2csv');
const Product = require('./models/productModel');

// Connect to MongoDB
mongoose
  .connect(
    'mongodb+srv://mukulpersonal2003:NTtv8gfqHJsC90fH@cluster0.mkzoudt.mongodb.net/EcommerceWeb',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('MongoDB connected');
    exportCSV();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Function to export MongoDB data to CSV
const exportCSV = async () => {
  try {
    const products = await Product.find({}).lean().exec();

    // Process data if needed
    const processedItems = products.map((item) => ({
      name: item.name,
      category: item.category,
      price: item.price,
      image: item.image,
      description: item.description,
      brand: item.brand,
    }));

    // Specify fields for CSV
    const fields = ['name', 'category', 'price', 'image', 'description', 'brand'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(processedItems);

    // Write CSV file
    const csvFilePath = path.join(__dirname, 'data/products_export.csv');
    fs.writeFileSync(csvFilePath, csv);

    console.log('CSV file successfully created');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error exporting data to CSV:', error);
  }
};
