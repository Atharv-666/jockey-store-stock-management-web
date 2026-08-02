// Rich Sample Data Store for Jockey Store Inventory & Sales System (INR ₹)

export const mockProducts = [
  {
    _id: 'jck_101',
    name: 'Jockey Modern Classic Super Combed Cotton Polo',
    category: "Men's",
    subCategory: 'Polos',
    price: 1299.00,
    imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800',
    minRequiredStock: 20,
    isFreeSize: false,
    variants: [
      { _id: 'v_j1_1', color: 'Navy Blue', size: 'M', stockQuantity: 18, soldQuantity: 24 },
      { _id: 'v_j1_2', color: 'Navy Blue', size: 'L', stockQuantity: 14, soldQuantity: 30 },
      { _id: 'v_j1_3', color: 'White', size: 'M', stockQuantity: 5, soldQuantity: 28 },
      { _id: 'v_j1_4', color: 'Black', size: 'L', stockQuantity: 0, soldQuantity: 20 }
    ],
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString()
  },
  {
    _id: 'jck_102',
    name: 'Jockey USA Premium Athletic Trackpants',
    category: "Men's",
    subCategory: 'Trackpants',
    price: 1899.00,
    imageUrl: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&q=80&w=800',
    minRequiredStock: 15,
    isFreeSize: false,
    variants: [
      { _id: 'v_j2_1', color: 'Charcoal Grey', size: 'M', stockQuantity: 12, soldQuantity: 18 },
      { _id: 'v_j2_2', color: 'Charcoal Grey', size: 'L', stockQuantity: 8, soldQuantity: 14 },
      { _id: 'v_j2_3', color: 'Black', size: 'XL', stockQuantity: 3, soldQuantity: 10 }
    ],
    createdAt: new Date(Date.now() - 16 * 86400000).toISOString()
  },
  {
    _id: 'jck_103',
    name: 'Jockey Super Combed Cotton Trunk (Pack of 3)',
    category: "Men's",
    subCategory: 'Innerwear',
    price: 899.00,
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
    minRequiredStock: 25,
    isFreeSize: false,
    variants: [
      { _id: 'v_j3_1', color: 'Assorted Dark', size: 'M', stockQuantity: 28, soldQuantity: 45 },
      { _id: 'v_j3_2', color: 'Assorted Dark', size: 'L', stockQuantity: 20, soldQuantity: 38 }
    ],
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString()
  },
  {
    _id: 'jck_201',
    name: 'Jockey Seamless Padded Active Bra',
    category: "Women's",
    subCategory: 'Activewear',
    price: 1499.00,
    imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800',
    minRequiredStock: 15,
    isFreeSize: false,
    variants: [
      { _id: 'v_j4_1', color: 'Rose Pink', size: 'S', stockQuantity: 6, soldQuantity: 16 },
      { _id: 'v_j4_2', color: 'Rose Pink', size: 'M', stockQuantity: 2, soldQuantity: 22 },
      { _id: 'v_j4_3', color: 'Black', size: 'M', stockQuantity: 0, soldQuantity: 19 }
    ],
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString()
  },
  {
    _id: 'jck_202',
    name: 'Jockey Soft Cotton Printed Lounge Dress',
    category: "Women's",
    subCategory: 'Dresses',
    price: 1699.00,
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800',
    minRequiredStock: 12,
    isFreeSize: false,
    variants: [
      { _id: 'v_j5_1', color: 'Teal Blue', size: 'S', stockQuantity: 10, soldQuantity: 12 },
      { _id: 'v_j5_2', color: 'Teal Blue', size: 'M', stockQuantity: 7, soldQuantity: 15 }
    ],
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    _id: 'jck_301',
    name: 'Jockey Junior Boys Printed Cotton Tee',
    category: "Kids",
    subCategory: 'Boys',
    price: 699.00,
    imageUrl: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&q=80&w=800',
    minRequiredStock: 15,
    isFreeSize: false,
    variants: [
      { _id: 'v_j6_1', color: 'Bright Red', size: 'S', stockQuantity: 14, soldQuantity: 10 },
      { _id: 'v_j6_2', color: 'Bright Red', size: 'M', stockQuantity: 9, soldQuantity: 12 }
    ],
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString()
  },
  {
    _id: 'jck_302',
    name: 'Jockey Girls Soft Stretch Leggings',
    category: "Kids",
    subCategory: 'Girls',
    price: 799.00,
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800',
    minRequiredStock: 10,
    isFreeSize: false,
    variants: [
      { _id: 'v_j7_1', color: 'Navy Blue', size: 'S', stockQuantity: 4, soldQuantity: 14 },
      { _id: 'v_j7_2', color: 'Navy Blue', size: 'M', stockQuantity: 0, soldQuantity: 11 }
    ],
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString()
  },
  {
    _id: 'jck_401',
    name: 'Jockey Cushion Sole Ankle Socks (Pack of 3)',
    category: "Accessories",
    subCategory: 'Socks',
    price: 499.00,
    imageUrl: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&q=80&w=800',
    minRequiredStock: 30,
    isFreeSize: true,
    variants: [
      { _id: 'v_j8_1', color: 'White & Grey', size: 'Free-Size', stockQuantity: 42, soldQuantity: 60 },
      { _id: 'v_j8_2', color: 'All Black', size: 'Free-Size', stockQuantity: 12, soldQuantity: 48 }
    ],
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    _id: 'jck_402',
    name: 'Jockey Adjustable Athletic Sports Cap',
    category: "Accessories",
    subCategory: 'Caps',
    price: 899.00,
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800',
    minRequiredStock: 15,
    isFreeSize: true,
    variants: [
      { _id: 'v_j9_1', color: 'Black USA Logo', size: 'Free-Size', stockQuantity: 18, soldQuantity: 25 },
      { _id: 'v_j9_2', color: 'White Sports', size: 'Free-Size', stockQuantity: 3, soldQuantity: 17 }
    ],
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  }
];

export const mockSaleHistory = [
  {
    _id: 'sale_jck_1',
    productId: 'jck_101',
    productName: 'Jockey Modern Classic Super Combed Cotton Polo',
    category: "Men's",
    subCategory: 'Polos',
    color: 'Navy Blue',
    size: 'M',
    quantity: 2,
    unitPrice: 1299.00,
    totalPrice: 2598.00,
    date: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    _id: 'sale_jck_2',
    productId: 'jck_201',
    productName: 'Jockey Seamless Padded Active Bra',
    category: "Women's",
    subCategory: 'Activewear',
    color: 'Rose Pink',
    size: 'M',
    quantity: 1,
    unitPrice: 1499.00,
    totalPrice: 1499.00,
    date: new Date(Date.now() - 4 * 3600000).toISOString()
  },
  {
    _id: 'sale_jck_3',
    productId: 'jck_103',
    productName: 'Jockey Super Combed Cotton Trunk (Pack of 3)',
    category: "Men's",
    subCategory: 'Innerwear',
    color: 'Assorted Dark',
    size: 'L',
    quantity: 3,
    unitPrice: 899.00,
    totalPrice: 2697.00,
    date: new Date(Date.now() - 8 * 3600000).toISOString()
  },
  {
    _id: 'sale_jck_4',
    productId: 'jck_401',
    productName: 'Jockey Cushion Sole Ankle Socks (Pack of 3)',
    category: "Accessories",
    subCategory: 'Socks',
    color: 'White & Grey',
    size: 'Free-Size',
    quantity: 4,
    unitPrice: 499.00,
    totalPrice: 1996.00,
    date: new Date(Date.now() - 14 * 3600000).toISOString()
  },
  {
    _id: 'sale_jck_5',
    productId: 'jck_301',
    productName: 'Jockey Junior Boys Printed Cotton Tee',
    category: "Kids",
    subCategory: 'Boys',
    color: 'Bright Red',
    size: 'S',
    quantity: 2,
    unitPrice: 699.00,
    totalPrice: 1398.00,
    date: new Date(Date.now() - 20 * 3600000).toISOString()
  }
];
