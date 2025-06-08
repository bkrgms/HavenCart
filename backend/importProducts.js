require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('./models/Product');

async function importProducts() {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB bağlantısı başarılı!');

    // JSON dosyasını oku
    const productsFile = path.join(__dirname, 'products.json');
    
    if (!fs.existsSync(productsFile)) {
      console.error('products.json dosyası bulunamadı. Önce generateProducts.js çalıştırın.');
      process.exit(1);
    }

    const productsData = fs.readFileSync(productsFile, 'utf8');
    const products = JSON.parse(productsData);

    console.log(`${products.length} ürün yüklenecek...`);

    // Mevcut ürünleri temizle (isteğe bağlı)
    const clearExisting = process.argv.includes('--clear');
    if (clearExisting) {
      console.log('Mevcut ürünler temizleniyor...');
      await Product.deleteMany({});
      console.log('Mevcut ürünler temizlendi.');
    }

    // Batch'ler halinde import et
    const batchSize = 50;
    let importedCount = 0;

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      try {
        const insertedProducts = await Product.insertMany(batch, { ordered: false });
        importedCount += insertedProducts.length;
        console.log(`Batch ${Math.floor(i/batchSize) + 1}: ${insertedProducts.length} ürün import edildi`);
      } catch (error) {
        console.error(`Batch ${Math.floor(i/batchSize) + 1} hatası:`, error.message);
        // Devam et, sadece bu batch'i atla
      }
    }

    console.log(`\n✅ Toplam ${importedCount} ürün başarıyla import edildi!`);
    
    // İstatistik göster
    const totalProducts = await Product.countDocuments();
    const categoryStats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log(`\n📊 Veritabanı İstatistikleri:`);
    console.log(`Toplam ürün sayısı: ${totalProducts}`);
    console.log('\nKategorilere göre dağılım:');
    categoryStats.forEach(cat => {
      console.log(`  ${cat._id}: ${cat.count} ürün`);
    });

  } catch (error) {
    console.error('Import hatası:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nMongoDB bağlantısı kapatıldı.');
  }
}

// Script'i çalıştır
if (require.main === module) {
  importProducts();
}

module.exports = { importProducts }; 