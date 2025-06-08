const { faker } = require('@faker-js/faker');
const fs = require('fs');

// Türkçe kategoriler ve ev eşyaları
const categories = [
  'Ev Dekorasyon',
  'Mutfak',
  'Aydınlatma',
  'Banyo',
  'Tekstil',
  'Elektronik',
  'Bahçe',
  'Mobilya',
  'Yatak Odası',
  'Oturma Odası'
];

const brands = [
  'IKEA', 'Zara Home', 'H&M Home', 'LC Waikiki Home', 'Koçtaş', 'Bauhaus', 
  'English Home', 'Madame Coco', 'Taç', 'Özdilek', 'Karaca', 'Kütahya Porselen',
  'Paşabahçe', 'Arzum', 'Fakir', 'Bosch', 'Siemens', 'Samsung', 'LG', 'Philips'
];

// Unsplash kategorilerine özel anahtar kelimeler ve fiyat aralıkları
const categoryConfig = {
  'Ev Dekorasyon': {
    keywords: ['interior', 'decoration', 'home-decor', 'vase', 'plant', 'candle'],
    priceRange: { min: 49.99, max: 899.99 }
  },
  'Mutfak': {
    keywords: ['kitchen', 'cooking', 'cookware', 'utensils', 'appliance'],
    priceRange: { min: 29.99, max: 2999.99 }
  },
  'Aydınlatma': {
    keywords: ['lighting', 'lamp', 'chandelier', 'bulb', 'pendant'],
    priceRange: { min: 79.99, max: 1599.99 }
  },
  'Banyo': {
    keywords: ['bathroom', 'towel', 'bath', 'shower', 'mirror'],
    priceRange: { min: 19.99, max: 799.99 }
  },
  'Tekstil': {
    keywords: ['textile', 'fabric', 'bedding', 'curtain', 'carpet'],
    priceRange: { min: 39.99, max: 1299.99 }
  },
  'Elektronik': {
    keywords: ['electronics', 'technology', 'gadget', 'device', 'smartphone'],
    priceRange: { min: 199.99, max: 9999.99 }
  },
  'Bahçe': {
    keywords: ['garden', 'outdoor', 'plant', 'furniture-outdoor', 'patio'],
    priceRange: { min: 59.99, max: 2499.99 }
  },
  'Mobilya': {
    keywords: ['furniture', 'chair', 'table', 'sofa', 'cabinet'],
    priceRange: { min: 299.99, max: 4999.99 }
  },
  'Yatak Odası': {
    keywords: ['bedroom', 'bed', 'mattress', 'pillow', 'bedding'],
    priceRange: { min: 99.99, max: 3999.99 }
  },
  'Oturma Odası': {
    keywords: ['living-room', 'sofa', 'coffee-table', 'armchair', 'bookshelf'],
    priceRange: { min: 199.99, max: 5999.99 }
  }
};

// Ürün isimleri kategorilere göre
const productNames = {
  'Ev Dekorasyon': [
    'Modern Dekoratif Vazo', 'Duvar Tablosu', 'Aromaterapi Mum', 'Fotoğraf Çerçevesi', 'Dekoratif Heykel', 'Duvar Aynası', 'Floating Duvar Rafı',
    'Dekoratif Yastık', 'Sukulent Çiçeklik', 'Vintage Biblo', 'Dijital Duvar Saati', 'Led Şerit Işık', 'Minimal Çerçeve Seti'
  ],
  'Mutfak': [
    'Seramik Tava', 'Paslanmaz Tencere', 'Çay Bardağı Seti', 'Kahve Fincan Takımı', 'Porselen Tabak', 'Çelik Kaşık Seti', 'Mutfak Bıçağı', 'Bambu Kesme Tahtası',
    'İndüksiyon Ocak', 'Ankastre Fırın', 'No-Frost Buzdolabı', 'Blender Mikser', 'Smoothie Blender', 'Otomatik Kahve Makinesi'
  ],
  'Aydınlatma': [
    'LED Masa Lambası', 'Kristal Avize', 'Spot Aydınlatma', 'E27 Led Ampul', 'Modern Duvar Aplisi', 'Gece Lambası',
    'RGB Şerit Led', 'Sarkıt Tavan Lambası', 'Solar Bahçe Lambası', 'Projeksiyon Lamba'
  ],
  'Banyo': [
    'Bambü Havlu', 'Kaydırmaz Banyo Paspası', 'Su Geçirmez Duş Perdesi', 'Dozajlı Sabunluk', 'LED Banyo Aynası', 'Banyo Dolabı',
    'Seramik Lavabo', 'Krom Banyo Aksesuar Seti', 'Duvara Monte Kağıt Tutacağı'
  ],
  'Tekstil': [
    'Çift Kişilik Yatak Örtüsü', 'Pamuk Nevresim Takımı', 'Blackout Perde', 'Antik Halı', 'Vintage Kilim', 'Saten Yastık Kılıfı',
    'Polar Battaniye', 'Pamuk Örtü', 'Masa Runner', 'Jakarlı Masa Örtüsü'
  ],
  'Elektronik': [
    '4K Smart TV', 'Gaming Laptop', 'Tablet', 'Akıllı Telefon', 'Bluetooth Kulaklık', 'Taşınabilir Hoparlör', 'Hızlı Şarj Aleti',
    'DSLR Kamera', 'Oyun Konsolu', 'Fitness Akıllı Saat'
  ],
  'Bahçe': [
    'Fiber Çiçek Saksısı', 'Bahçe Masa Sandalye Takımı', 'Bahçe Şemsiyesi', 'Elektrikli Barbeku', 'Otomatik Sulama Sistemi',
    'Bahçe El Aleti Seti', 'Ahşap Bahçe Çiti', 'Solar Bahçe Lambası', 'Bahçe Pergolası'
  ],
  'Mobilya': [
    'Chesterfield Koltuk', 'Yemek Masası', 'Ergonomik Sandalye', 'Gardırop', 'Komidin', 'Baza Yatak', 'Şifonyer',
    'Kitaplık', 'Tv Ünitesi', 'Berjer Koltuk'
  ],
  'Yatak Odası': [
    'Ortopedik Yatak', 'Capitone Başlık', 'Gece Lambası', 'Aynalı Şifonyer', 'Makyaj Masası', 'Yatak Odası Pufu', 'Saten Yatak Örtüsü',
    'Memory Foam Nevresim', 'Ortopedik Yastık', 'Dimmer Gece Lambası'
  ],
  'Oturma Odası': [
    'L Koltuk Takımı', 'Cam Sehpa', 'Modern Tv Ünitesi', 'Tekli Berjer', 'Shaggy Halı', 'Fon Perde',
    'Dekoratif Yastık Takımı', 'Modern Avize', 'Canvas Duvar Tablosu', 'Açık Kitaplık'
  ]
};

// Özellikler listesi
const features = [
  'Su geçirmez', 'Dayanıklı malzeme', 'Modern tasarım', 'Kolay temizlik', 'Çevre dostu',
  'Antibakteriyel yüzey', 'UV korumalı', 'Isı yalıtımı', 'Ses yalıtımı', 'Enerji tasarruflu',
  '2 yıl garantili', 'İthal kalite', 'El yapımı', 'Doğal malzeme', 'Alerjik olmayan',
  'Kolay montaj', 'Kompakt tasarım', 'Çok amaçlı kullanım', 'Şık görünüm', 'Ekonomik fiyat'
];

function generateProduct() {
  const category = faker.helpers.arrayElement(categories);
  const productNamesForCategory = productNames[category] || ['Kaliteli Ürün'];
  const config = categoryConfig[category];
  
  const name = faker.helpers.arrayElement(productNamesForCategory);
  const brand = faker.helpers.arrayElement(brands);
  
  // Kategoriye uygun resim URL'si oluştur
  const keyword = faker.helpers.arrayElement(config.keywords);
  const imageId = faker.number.int({ min: 1, max: 1000 });
  const image = `https://picsum.photos/seed/${keyword}-${imageId}/400/300`;
  
  // Çoklu resimler - kategoriye uygun
  const imageCount = faker.number.int({ min: 2, max: 4 });
  const images = [];
  for (let i = 0; i < imageCount; i++) {
    const imgKeyword = faker.helpers.arrayElement(config.keywords);
    images.push({
      url: `https://picsum.photos/seed/${imgKeyword}-${imageId}-${i}/400/300`,
      order: i,
      isPrimary: i === 0
    });
  }
  
  // Kategoriye uygun fiyat
  const price = faker.number.float({ 
    min: config.priceRange.min, 
    max: config.priceRange.max, 
    precision: 0.01 
  });
  
  return {
    name: name,
    description: `${name}, evinizin dekorasyonunu tamamlayacak kaliteli bir üründür. Modern tasarımı ile her ortama uyum sağlar. Dayanıklı malzemesi sayesinde uzun yıllar kullanabilirsiniz. ${category.toLowerCase()} kategorisinde öne çıkan bu ürün, hem fonksiyonel hem de estetik açıdan mükemmeldir.`,
    price: price,
    category: category,
    brand: brand,
    stock: faker.number.int({ min: 5, max: 150 }),
    image: image,
    images: images,
    features: faker.helpers.arrayElements(features, { min: 3, max: 6 }),
    specifications: `Malzeme: ${faker.helpers.arrayElement(['Ahşap', 'Metal', 'Plastik', 'Cam', 'Seramik', 'Kumaş', 'Deri'])}, 
Boyutlar: ${faker.number.int({ min: 10, max: 200 })}x${faker.number.int({ min: 10, max: 200 })}x${faker.number.int({ min: 5, max: 100 })} cm,
Ağırlık: ${faker.number.float({ min: 0.5, max: 50, precision: 0.1 })} kg,
Renk: ${faker.helpers.arrayElement(['Beyaz', 'Siyah', 'Kahverengi', 'Gri', 'Mavi', 'Kırmızı', 'Yeşil', 'Sarı', 'Mor'])}`,
    isActive: faker.datatype.boolean({ probability: 0.95 }),
    averageRating: faker.number.float({ min: 3.0, max: 5.0, precision: 0.1 }),
    totalReviews: faker.number.int({ min: 5, max: 500 })
  };
}

function generateProducts(count = 400) {
  console.log(`Generating ${count} products...`);
  const products = [];
  
  for (let i = 0; i < count; i++) {
    products.push(generateProduct());
    if ((i + 1) % 50 === 0) {
      console.log(`Generated ${i + 1} products...`);
    }
  }
  
  return products;
}

// Generate products and save to file
const products = generateProducts(400);

// Save to JSON file
fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
console.log('Products saved to products.json');

// Also create a smaller sample for testing
const sampleProducts = products.slice(0, 20);
fs.writeFileSync('sample-products.json', JSON.stringify(sampleProducts, null, 2));
console.log('Sample products saved to sample-products.json');

module.exports = { generateProducts }; 