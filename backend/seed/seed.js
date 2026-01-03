require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("../config/db");

// Models
const User = require("../models/User");
const Category = require("../models/Category");
const Attribute = require("../models/Attribute");
const AttributeValue = require("../models/AttributeValue");
const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Review = require("../models/Review");

const seed = async () => {
  try {
    await connectDB();

    console.log("🗑 Clearing database...");
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Attribute.deleteMany(),
      AttributeValue.deleteMany(),
      Product.deleteMany(),
      ProductVariant.deleteMany(),
      Cart.deleteMany(),
      Order.deleteMany(),
      Review.deleteMany(),
    ]);

    /* ================= USERS ================= */
    console.log("👤 Creating users...");
    const users = await User.insertMany(
      Array.from({ length: 10 }).map((_, i) => ({
        username: `user${i + 1}`,
        email: `user${i + 1}@test.com`,
        password: "123456",
        verified: true,
      }))
    );

    const admin = await User.create({
      username: "admin",
      email: "admin@test.com",
      password: "123456",
      role: "admin",
      verified: true,
    });

    /* ================= CATEGORIES ================= */
    console.log("📦 Creating categories...");
    const categories = await Category.insertMany([
      { name: "Electronics" },
      { name: "Fashion" },
      { name: "Home Appliances" },
      { name: "Books" },
      { name: "Sports" },
    ]);

    const [electronics, fashion] = categories;

    /* ================= ATTRIBUTES ================= */
    console.log("🏷 Creating attributes...");
    const colorAttr = await Attribute.create({
      name: "Color",
      category: electronics._id,
    });

    const sizeAttr = await Attribute.create({
      name: "Size",
      category: fashion._id,
    });

    /* ================= ATTRIBUTE VALUES ================= */
    console.log("🎨 Creating attribute values...");
    const colors = await AttributeValue.insertMany(
      ["Black", "White", "Red", "Blue", "Silver"].map((c) => ({
        attribute: colorAttr._id,
        value: c,
      }))
    );

    const sizes = await AttributeValue.insertMany(
      ["S", "M", "L", "XL"].map((s) => ({
        attribute: sizeAttr._id,
        value: s,
      }))
    );

    /* ================= PRODUCTS & VARIANTS ================= */
    console.log("🛒 Creating products and variants...");
    const products = [];

    for (let i = 1; i <= 30; i++) {
      const product = await Product.create({
        name: `Smartphone Model ${i}`,
        category: electronics._id,
        description: `High quality smartphone model ${i}`,
        photo: [`phone-${i}.jpg`],
      });

      // Variants
      for (const color of colors) {
        await ProductVariant.create({
          product: product._id,
          price: 800 + i * 10,
          stock: Math.floor(Math.random() * 20) + 5,
          photo: [`phone-${i}-${color.value}.jpg`],
          attributes: [
            { attribute: colorAttr._id, value: color._id },
          ],
        });
      }

      products.push(product);
    }

    /* ================= CARTS ================= */
    console.log("🛍 Creating carts...");
    for (const user of users) {
      const product = products[Math.floor(Math.random() * products.length)];
      const variant = await ProductVariant.findOne({ product: product._id });

      await Cart.create({
        user: user._id,
        items: [
          {
            product: product._id,
            variant: variant._id,
            quantity: 1,
            price: variant.price,
          },
        ],
        totalPrice: variant.price,
      });
    }

    /* ================= ORDERS ================= */
    console.log("🧾 Creating orders...");
    for (const user of users.slice(0, 5)) {
      const product = products[Math.floor(Math.random() * products.length)];
      const variant = await ProductVariant.findOne({ product: product._id });

      await Order.create({
        user: user._id,
        items: [
          {
            product: product._id,
            variant: variant._id,
            quantity: 1,
            price: variant.price,
          },
        ],
        shippingAddress: {
          fullName: user.username,
          address: "Bole Street",
          city: "Addis Ababa",
          country: "Ethiopia",
          phone: "0912345678",
        },
        paymentInfo: {
          method: "chapa",
          status: "paid",
          transactionId: `TX-${Date.now()}`,
        },
        totalAmount: variant.price,
        isPaid: true,
        paidAt: new Date(),
        orderStatus: "delivered",
      });
    }

    /* ================= REVIEWS ================= */
    console.log("⭐ Creating reviews...");
    for (const product of products.slice(0, 10)) {
      for (const user of users.slice(0, 3)) {
        const rating = Math.floor(Math.random() * 2) + 4;

        const review = await Review.create({
          product: product._id,
          user: user._id,
          rating,
          comment: "Very good quality, recommended!",
        });

        product.reviews.push(review._id);
        product.ratingsCount += 1;
        product.averageRating =
          (product.averageRating + rating) / product.ratingsCount;

        await product.save();
      }
    }

    console.log("✅ LARGE SEED COMPLETED");
    process.exit();
  } catch (err) {
    console.error("❌ SEED ERROR:", err);
    process.exit(1);
  }
};

seed();
