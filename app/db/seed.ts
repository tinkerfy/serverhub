import { db } from './index';
import { users, categories, products, addresses, orders, orderItems, reviews } from './schema';
import { hashPassword } from '../lib/auth';

const CATEGORIES = [
  { name: 'Servers', slug: 'servers', description: 'Enterprise rack, tower, and blade servers' },
  { name: 'Storage', slug: 'storage', description: 'SAN, NAS, and direct-attached storage systems' },
  { name: 'Networking', slug: 'networking', description: 'Switches, routers, and networking equipment' },
  { name: 'Components', slug: 'components', description: 'CPU, RAM, storage drives, and RAID controllers' },
];

const PRODUCTS = [
  // Dell PowerEdge R740
  {
    name: 'Dell PowerEdge R740',
    brand: 'Dell',
    model: 'R740',
    categoryId: 1,
    description: '2U rack server with dual Intel Xeon Silver 4110 processors, 64GB RAM, and 6x 900GB SAS drives. Ideal for virtualization and enterprise workloads.',
    condition: 'refurbished' as const,
    sku: 'DELL-R740-001',
    price: '4500.00',
    cost: '2800.00',
    originalPrice: '12000.00',
    stock: 5,
    specs: JSON.stringify({ cpu: '2x Intel Xeon Silver 4110 (12 cores total)', ram: '64GB DDR4 ECC', storage: '6x 900GB 10K SAS', network: 'Dual 1GbE', power: '750W Redundant PSU' }),
    imageUrls: ['/images/products/dell-poweredge-r740/main.jpg'],
  },
  {
    name: 'Dell PowerEdge R740xd',
    brand: 'Dell',
    model: 'R740xd',
    categoryId: 1,
    description: '2U rack server optimized for storage-intensive workloads. Dual Xeon Gold 6140, 128GB RAM, 12x 3.5" drive bays.',
    condition: 'certified-pre-owned' as const,
    sku: 'DELL-R740XD-001',
    price: '5200.00',
    cost: '3200.00',
    originalPrice: '15000.00',
    stock: 3,
    specs: JSON.stringify({ cpu: '2x Intel Xeon Gold 6140 (28 cores total)', ram: '128GB DDR4 ECC', storage: '12x 900GB 10K SAS', network: 'Dual 10GbE', power: '1300W Redundant PSU' }),
    imageUrls: ['/images/products/dell-poweredge-r740xd/main.jpg'],
  },
  {
    name: 'Dell PowerEdge T440',
    brand: 'Dell',
    model: 'T440',
    categoryId: 1,
    description: 'Tower server for small to medium businesses. Single Xeon Silver 4114, 32GB RAM, 4x 2TB HDD. Quiet operation for office environments.',
    condition: 'like-new' as const,
    sku: 'DELL-T440-001',
    price: '2800.00',
    cost: '1600.00',
    originalPrice: '7500.00',
    stock: 8,
    specs: JSON.stringify({ cpu: 'Intel Xeon Silver 4114 (10 cores)', ram: '32GB DDR4 ECC', storage: '4x 2TB 7.2K HDD', network: 'Dual 1GbE', power: '350W' }),
    imageUrls: ['/images/products/dell-poweredge-t440/main.jpg'],
  },
  // HP ProLiant DL380 Gen10
  {
    name: 'HP ProLiant DL380 Gen10',
    brand: 'HP',
    model: 'DL380 Gen10',
    categoryId: 1,
    description: 'Industry-standard 2U rack server. Dual Intel Xeon Gold 6148, 128GB RAM, 4x 900GB SAS. Proven reliability for mission-critical applications.',
    condition: 'refurbished' as const,
    sku: 'HP-DL380-001',
    price: '5800.00',
    cost: '3500.00',
    originalPrice: '16000.00',
    stock: 4,
    specs: JSON.stringify({ cpu: '2x Intel Xeon Gold 6148 (20 cores each)', ram: '128GB DDR4 ECC', storage: '4x 900GB 10K SAS', network: 'Dual 10GbE', power: '750W Platinum PSU' }),
    imageUrls: ['/images/products/hp-proliant-dl380-gen10/main.jpg'],
  },
  {
    name: 'HP ProLiant DL380 Gen11',
    brand: 'HP',
    model: 'DL380 Gen11',
    categoryId: 1,
    description: 'Latest generation 2U rack server with 4th Gen Intel Xeon Scalable processors. Dual Platinum 8480+, 256GB RAM, 8x NVMe drives.',
    condition: 'like-new' as const,
    sku: 'HP-DL380G11-001',
    price: '12500.00',
    cost: '8000.00',
    originalPrice: '28000.00',
    stock: 2,
    specs: JSON.stringify({ cpu: '2x Intel Xeon Platinum 8480+ (32 cores each)', ram: '256GB DDR5 ECC', storage: '8x 3.84TB NVMe SSD', network: 'Dual 25GbE', power: '1600W Platinum PSU' }),
    imageUrls: ['/images/products/hp-proliant-dl380-gen11/main.jpg'],
  },
  {
    name: 'HP ProLiant ML350 Gen10 Plus',
    brand: 'HP',
    model: 'ML350 Gen10 Plus',
    categoryId: 1,
    description: 'Tower/server hybrid with flexibility for expanding workloads. Dual Xeon Gold 6248R, 64GB RAM, 4x 1.92TB SAS SSD.',
    condition: 'certified-pre-owned' as const,
    sku: 'HP-ML350-001',
    price: '6200.00',
    cost: '3800.00',
    originalPrice: '18000.00',
    stock: 3,
    specs: JSON.stringify({ cpu: '2x Intel Xeon Gold 6248R (24 cores each)', ram: '64GB DDR4 ECC', storage: '4x 1.92TB SAS SSD', network: 'Dual 10GbE', power: '800W Redundant PSU' }),
    imageUrls: ['/images/products/hp-proliant-ml350-gen10/main.jpg'],
  },
  // Lenovo ThinkSystem SR650
  {
    name: 'Lenovo ThinkSystem SR650',
    brand: 'Lenovo',
    model: 'SR650',
    categoryId: 1,
    description: '2U rack server with dual Intel Xeon Gold 6150, 64GB RAM, 4x 900GB SAS. Excellent for virtualization and cloud infrastructure.',
    condition: 'refurbished' as const,
    sku: 'LEN-SR650-001',
    price: '4800.00',
    cost: '2900.00',
    originalPrice: '13500.00',
    stock: 6,
    specs: JSON.stringify({ cpu: '2x Intel Xeon Gold 6150 (18 cores each)', ram: '64GB DDR4 ECC', storage: '4x 900GB 10K SAS', network: 'Dual 1GbE', power: '750W Redundant PSU' }),
    imageUrls: ['/images/products/lenovo-thinksystem-sr650/main.jpg'],
  },
  {
    name: 'Lenovo ThinkSystem SR650 V2',
    brand: 'Lenovo',
    model: 'SR650 V2',
    categoryId: 1,
    description: 'Second generation with 3rd Gen Intel Xeon. Dual Gold 6330, 128GB RAM, 8x 2.5" drive bays with NVMe support.',
    condition: 'certified-pre-owned' as const,
    sku: 'LEN-SR650V2-001',
    price: '7500.00',
    cost: '4800.00',
    originalPrice: '20000.00',
    stock: 3,
    specs: JSON.stringify({ cpu: '2x Intel Xeon Gold 6330 (28 cores each)', ram: '128GB DDR4 ECC', storage: '8x 1.92TB NVMe SSD', network: 'Dual 25GbE', power: '1100W Redundant PSU' }),
    imageUrls: ['/images/products/lenovo-thinksystem-sr650-v2/main.jpg'],
  },
  {
    name: 'Lenovo ThinkSystem ST50',
    brand: 'Lenovo',
    model: 'ST50',
    categoryId: 1,
    description: 'Tower server for SMB workloads. Single Xeon Silver 4310, 32GB RAM, 4x 4TB HDD. Quiet and compact for office deployment.',
    condition: 'good' as const,
    sku: 'LEN-ST50-001',
    price: '2200.00',
    cost: '1300.00',
    originalPrice: '6500.00',
    stock: 10,
    specs: JSON.stringify({ cpu: 'Intel Xeon Silver 4310 (12 cores)', ram: '32GB DDR4 ECC', storage: '4x 4TB 7.2K HDD', network: 'Dual 1GbE', power: '550W' }),
    imageUrls: ['/images/products/lenovo-thinksystem-st50/main.jpg'],
  },
  // Cisco Nexus Switches
  {
    name: 'Cisco Nexus 9336C-FX2',
    brand: 'Cisco',
    model: 'Nexus 9336C-FX2',
    categoryId: 3,
    description: '36-port 10/25GbE Data Center switch with 12x 40/100GbE uplinks. Ideal for top-of-rack deployments.',
    condition: 'refurbished' as const,
    sku: 'CISCO-N9K-C9336-001',
    price: '8500.00',
    cost: '5200.00',
    originalPrice: '22000.00',
    stock: 2,
    specs: JSON.stringify({ ports: '36x 25GbE SFP28 + 12x 100GbE QSFP28', throughput: '1.08 Tbps', memory: '900MB buffer', power: '375W' }),
    imageUrls: ['/images/products/cisco-nexus-9336/main.jpg'],
  },
  {
    name: 'Cisco Catalyst 9300-48P',
    brand: 'Cisco',
    model: 'C9300-48P',
    categoryId: 3,
    description: '48-port PoE+ access switch with 4x 40GbE uplinks. Powers IP phones, cameras, and APs directly.',
    condition: 'like-new' as const,
    sku: 'CISCO-C9300-001',
    price: '6800.00',
    cost: '4200.00',
    originalPrice: '15000.00',
    stock: 4,
    specs: JSON.stringify({ ports: '48x PoE+ Gigabit + 4x 40GbE uplinks', throughput: '216 Gbps', poe: '740W PoE budget', power: '400W input' }),
    imageUrls: ['/images/products/cisco-catalyst-9300/main.jpg'],
  },
  {
    name: 'Cisco Catalyst 9500-48Y4C',
    brand: 'Cisco',
    model: 'C9500-48Y4C',
    categoryId: 3,
    description: 'Core/distribution layer 48-port 25GbE + 4x 100GbE uplink switch. Built for high-performance data centers.',
    condition: 'certified-pre-owned' as const,
    sku: 'CISCO-C9500-001',
    price: '14500.00',
    cost: '9000.00',
    originalPrice: '35000.00',
    stock: 1,
    specs: JSON.stringify({ ports: '48x 25GbE SFP28 + 4x 100GbE QSFP28', throughput: '2.16 Tbps', memory: '1.8GB buffer', power: '600W' }),
    imageUrls: ['/images/products/cisco-catalyst-9500/main.jpg'],
  },
  {
    name: 'Cisco Nexus 3548',
    brand: 'Cisco',
    model: 'Nexus 3548',
    categoryId: 3,
    description: '48-port 1GbE + 4x 10GbE uplink leaf switch. Fanless, energy-efficient design for access layer.',
    condition: 'good' as const,
    sku: 'CISCO-N3K-C3548-001',
    price: '2800.00',
    cost: '1500.00',
    originalPrice: '8000.00',
    stock: 5,
    specs: JSON.stringify({ ports: '48x 1GbE SFP + 4x 10GbE SFP+', throughput: '216 Gbps', fanless: true, power: '100W' }),
    imageUrls: ['/images/products/cisco-nexus-3548/main.jpg'],
  },
  // NetApp AFF
  {
    name: 'NetApp AFF A250',
    brand: 'NetApp',
    model: 'AFF A250',
    categoryId: 2,
    description: '2U all-flash storage array with NVMe technology. 16-drive bays, 40GbE connectivity, ideal for mid-range workloads.',
    condition: 'refurbished' as const,
    sku: 'NETAPP-A250-001',
    price: '9500.00',
    cost: '6000.00',
    originalPrice: '25000.00',
    stock: 3,
    specs: JSON.stringify({ capacity: 'Up to 128TB raw', form: '2U, 16x 3.5" drive bays', connectivity: '40GbE, 32Gb FC', controller: 'Active/Active' }),
    imageUrls: ['/images/products/netapp-aff-a250/main.jpg'],
  },
  {
    name: 'NetApp AFF A800',
    brand: 'NetApp',
    model: 'AFF A800',
    categoryId: 2,
    description: 'High-performance 4U all-flash array. 40-drive bays, dual active controllers, 32Gb FC + 100GbE.',
    condition: 'certified-pre-owned' as const,
    sku: 'NETAPP-A800-001',
    price: '28000.00',
    cost: '18000.00',
    originalPrice: '65000.00',
    stock: 1,
    specs: JSON.stringify({ capacity: 'Up to 512TB raw', form: '4U, 40x 3.5" drive bays', connectivity: '32Gb FC + 100GbE', controller: 'Active/Active, dual' }),
    imageUrls: ['/images/products/netapp-aff-a800/main.jpg'],
  },
  {
    name: 'NetApp E2600',
    brand: 'NetApp',
    model: 'E2600',
    categoryId: 2,
    description: 'Entry-level SAS storage shelf. 36-bay, dual-controller, expandable to 144 drives. Great for expanding existing SAN.',
    condition: 'good' as const,
    sku: 'NETAPP-E2600-001',
    price: '4200.00',
    cost: '2500.00',
    originalPrice: '12000.00',
    stock: 2,
    specs: JSON.stringify({ capacity: '36x 2.5" SAS/SATA, expandable', form: '2U, dual-controller', connectivity: '16Gb FC, 16Gb iSCSI', expandable: 'Up to 144 drives' }),
    imageUrls: ['/images/products/netapp-e2600/main.jpg'],
  },
  // HPE MSA
  {
    name: 'HPE MSA 2060',
    brand: 'HPE',
    model: 'MSA 2060',
    categoryId: 2,
    description: 'Entry-level all-flash storage with dual controllers. 12x 2.5" drive bays, 16Gb FC + 10GbE.',
    condition: 'refurbished' as const,
    sku: 'HPE-MSA2060-001',
    price: '7800.00',
    cost: '4800.00',
    originalPrice: '20000.00',
    stock: 2,
    specs: JSON.stringify({ capacity: 'Up to 76.8TB raw', form: '2U, 12x 2.5" drive bays', connectivity: '16Gb FC + 10GbE', controller: 'Active/Active' }),
    imageUrls: ['/images/products/hpe-msa-2060/main.jpg'],
  },
  {
    name: 'HPE MSA 2062',
    brand: 'HPE',
    model: 'MSA 2062',
    categoryId: 2,
    description: 'Hybrid storage with flash cache tier. 12x 2.5" + 4x 3.5" drive bays, cost-effective for mixed workloads.',
    condition: 'certified-pre-owned' as const,
    sku: 'HPE-MSA2062-001',
    price: '6500.00',
    cost: '4000.00',
    originalPrice: '18000.00',
    stock: 3,
    specs: JSON.stringify({ capacity: 'Up to 60TB (flash + HDD)', form: '2U, 12x 2.5" + 4x 3.5"', connectivity: '16Gb FC + 10GbE', controller: 'Active/Active' }),
    imageUrls: ['/images/products/hpe-msa-2062/main.jpg'],
  },
  {
    name: 'HPE MSA P2000',
    brand: 'HPE',
    model: 'P2000',
    categoryId: 2,
    description: 'Older generation SAN storage, reliable for legacy workloads. Dual controllers, 8x 3.5" SAS drives.',
    condition: 'good' as const,
    sku: 'HPE-P2000-001',
    price: '2500.00',
    cost: '1200.00',
    originalPrice: '8000.00',
    stock: 4,
    specs: JSON.stringify({ capacity: '8x 900GB 10K SAS', form: '2U', connectivity: '8Gb FC + 1GbE', controller: 'Active/Active' }),
    imageUrls: ['/images/products/hpe-msa-p2000/main.jpg'],
  },
  // Components
  {
    name: 'Intel Xeon Gold 6248R',
    brand: 'Intel',
    model: 'Xeon Gold 6248R',
    categoryId: 4,
    description: '24-core 2.4GHz Cascade Lake processor. 33MB cache, 205W TDP. Compatible with Dell R740, HP DL380 Gen10.',
    condition: 'like-new' as const,
    sku: 'INTEL-6248R-001',
    price: '1800.00',
    cost: '1100.00',
    originalPrice: '4800.00',
    stock: 20,
    specs: JSON.stringify({ cores: '24 cores / 48 threads', baseClock: '2.4 GHz', turboClock: '3.9 GHz', cache: '33MB L3', tdp: '205W', socket: 'LGA 3647' }),
    imageUrls: ['/images/products/intel-xeon-gold-6248r/main.jpg'],
  },
  {
    name: 'Samsung 960PRO 2TB NVMe',
    brand: 'Samsung',
    model: '960PRO 2TB',
    categoryId: 4,
    description: 'PCIe 3.0 NVMe M.2 SSD. 3,500MB/s read, 2,900MB/s write. Ideal for boot drives and caching.',
    condition: 'like-new' as const,
    sku: 'SAM-960PRO-2TB-001',
    price: '280.00',
    cost: '160.00',
    originalPrice: '500.00',
    stock: 50,
    specs: JSON.stringify({ capacity: '2TB', form: 'M.2 2280', interface: 'PCIe 3.0 x4 NVMe', readSpeed: '3,500 MB/s', writeSpeed: '2,900 MB/s' }),
    imageUrls: ['/images/products/samsung-960pro-2tb/main.jpg'],
  },
  {
    name: 'Crucial 32GB DDR4 ECC RDIMM',
    brand: 'Crucial',
    model: 'CT4G4DFS8266',
    categoryId: 4,
    description: '32GB DDR4-2666 ECC Registered DIMM. Server-grade memory for Dell, HP, and Lenovo servers.',
    condition: 'like-new' as const,
    sku: 'CRU-CT4G4DFS-001',
    price: '180.00',
    cost: '100.00',
    originalPrice: '350.00',
    stock: 100,
    specs: JSON.stringify({ capacity: '32GB', type: 'DDR4-2666 ECC RDIMM', form: '288-pin DIMM', voltage: '1.2V', rank: 'Dual Rank' }),
    imageUrls: ['/images/products/crucial-32gb-ddr4/main.jpg'],
  },
  {
    name: 'Broadcom MegaRAID 9361-8i',
    brand: 'Broadcom',
    model: 'MegaRAID 9361-8i',
    categoryId: 4,
    description: '8-port PCIe 3.0 SAS/SATA RAID controller with 2GB cache. Supports RAID 0/1/5/6/10/50/60.',
    condition: 'good' as const,
    sku: 'BRC-9361-001',
    price: '450.00',
    cost: '250.00',
    originalPrice: '1200.00',
    stock: 15,
    specs: JSON.stringify({ ports: '8x SFF-8643 SAS3', interface: 'PCIe 3.0 x8', cache: '2GB DDR3', raidLevels: '0, 1, 5, 6, 10, 50, 60', battery: 'VRM module included' }),
    imageUrls: ['/images/products/broadcom-megaraid-9361/main.jpg'],
  },
  {
    name: 'Seagate 1.92TB SAS SSD',
    brand: 'Seagate',
    model: 'ST1920SS0001',
    categoryId: 4,
    description: 'Enterprise 2.5" SAS3 SSD with 6Gb/s interface. Mixed-use rated, 1.5 DWPD endurance.',
    condition: 'refurbished' as const,
    sku: 'SEA-ST1920-001',
    price: '320.00',
    cost: '180.00',
    originalPrice: '800.00',
    stock: 30,
    specs: JSON.stringify({ capacity: '1.92TB', form: '2.5" SFF SAS', interface: 'SAS3 6Gb/s', readSpeed: '650 MB/s', writeSpeed: '390 MB/s', endurance: '1.5 DWPD' }),
    imageUrls: ['/images/products/seagate-1.92tb-sas/main.jpg'],
  },
];

const SAMPLE_USERS = [
  { name: 'Admin User', email: 'admin@serverhub.com', password: 'Admin123!', role: 'admin' as const },
  { name: 'John Buyer', email: 'john@example.com', password: 'User123!', role: 'user' as const },
  { name: 'Jane Corp', email: 'jane@corp.com', password: 'User123!', role: 'user' as const },
];

const SAMPLE_ADDRESSES = [
  { userId: 2, type: 'shipping' as const, fullName: 'John Buyer', phone: '555-0101', street: '123 Server Lane', city: 'San Jose', state: 'CA', zip: '95134', country: 'US', isDefault: true },
  { userId: 2, type: 'billing' as const, fullName: 'John Buyer', phone: '555-0101', street: '123 Server Lane', city: 'San Jose', state: 'CA', zip: '95134', country: 'US', isDefault: true },
  { userId: 3, type: 'shipping' as const, fullName: 'Jane Corp', phone: '555-0202', street: '456 Data Center Blvd', city: 'Dallas', state: 'TX', zip: '75201', country: 'US', isDefault: true },
  { userId: 3, type: 'billing' as const, fullName: 'Jane Corp', phone: '555-0202', street: '456 Data Center Blvd', city: 'Dallas', state: 'TX', zip: '75201', country: 'US', isDefault: true },
];

const SAMPLE_ORDERS = [
  {
    userId: 2, orderNumber: 'SH-2024-0001', status: 'delivered' as const, paymentStatus: 'paid' as const,
    subtotal: '4500.00', tax: '382.50', shippingCost: '150.00', total: '5032.50',
    shippingAddressId: 1, billingAddressId: 2,
  },
  {
    userId: 3, orderNumber: 'SH-2024-0002', status: 'shipped' as const, paymentStatus: 'paid' as const,
    subtotal: '14500.00', tax: '1232.50', shippingCost: '250.00', total: '15982.50',
    shippingAddressId: 3, billingAddressId: 4,
  },
];

const SAMPLE_ORDER_ITEMS = [
  { orderId: 1, productId: 1, name: 'Dell PowerEdge R740', price: '4500.00', quantity: 1, total: '4500.00' },
  { orderId: 2, productId: 11, name: 'Cisco Nexus 9336C-FX2', price: '14500.00', quantity: 1, total: '14500.00' },
];

const SAMPLE_REVIEWS = [
  { productId: 1, userId: 2, rating: 5, comment: 'Excellent condition, works perfectly. Saved us thousands on our virtualization project.', status: 'approved' as const },
  { productId: 11, userId: 3, rating: 4, comment: 'Great switch, but shipping took longer than expected. Performance is outstanding.', status: 'approved' as const },
];

async function seed() {
  console.log('Seeding database...');

  for (const cat of CATEGORIES) {
    await db.insert(categories).values(cat).onConflictDoNothing();
  }
  console.log(`  ${CATEGORIES.length} categories inserted`);

  for (const prod of PRODUCTS) {
    await db.insert(products).values(prod).onConflictDoNothing();
  }
  console.log(`  ${PRODUCTS.length} products inserted`);

  for (const user of SAMPLE_USERS) {
    const hashedPassword = await hashPassword(user.password);
    await db.insert(users).values({
      name: user.name,
      email: user.email,
      passwordHash: hashedPassword,
      role: user.role,
    }).onConflictDoNothing();
  }
  console.log(`  ${SAMPLE_USERS.length} users inserted`);

  for (const addr of SAMPLE_ADDRESSES) {
    await db.insert(addresses).values(addr).onConflictDoNothing();
  }
  console.log(`  ${SAMPLE_ADDRESSES.length} addresses inserted`);

  for (const order of SAMPLE_ORDERS) {
    await db.insert(orders).values(order).onConflictDoNothing();
  }
  console.log(`  ${SAMPLE_ORDERS.length} orders inserted`);

  for (const item of SAMPLE_ORDER_ITEMS) {
    await db.insert(orderItems).values(item).onConflictDoNothing();
  }
  console.log(`  ${SAMPLE_ORDER_ITEMS.length} order items inserted`);

  for (const review of SAMPLE_REVIEWS) {
    await db.insert(reviews).values(review).onConflictDoNothing();
  }
  console.log(`  ${SAMPLE_REVIEWS.length} reviews inserted`);

  console.log('Seed complete!');
}

seed().catch(console.error);
