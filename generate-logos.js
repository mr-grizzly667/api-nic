const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

const generateSVG = (name, index) => {
  const colors = [
    ['#FF7A00', '#FF9D42'],
    ['#009B4D', '#00C863'],
    ['#0B1F3A', '#1C3A6A'],
    ['#E63946', '#F0717B'],
    ['#4361EE', '#7B90FF'],
    ['#7209B7', '#9D4EDD'],
    ['#F72585', '#FF70A6'],
  ];
  
  const [color1, color2] = colors[index % colors.length];
  const initial = name.substring(0, 1).toUpperCase();
  const initial2 = name.substring(1, 2).toLowerCase();
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <defs>
      <linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="${color1}" />
        <stop offset="100%" stopColor="${color2}" />
      </linearGradient>
      <filter id="shadow${index}">
        <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.3"/>
      </filter>
    </defs>
    <rect width="200" height="200" rx="40" fill="url(#grad${index})" />
    <circle cx="100" cy="100" r="70" fill="white" opacity="0.1" />
    <text x="100" y="125" font-family="Arial, sans-serif" font-weight="900" font-size="90" fill="white" text-anchor="middle" filter="url(#shadow${index})">${initial}${initial2}</text>
  </svg>`;
};

async function main() {
  const registrars = await prisma.registrar.findMany();
  let updatedCount = 0;

  const uploadDir = path.join(__dirname, 'uploads', 'registrars');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  for (let i = 0; i < registrars.length; i++) {
    const reg = registrars[i];
    const svgContent = generateSVG(reg.name, i);
    const filename = `${reg.slug || uuidv4()}.svg`;
    const filepath = path.join(uploadDir, filename);
    
    fs.writeFileSync(filepath, svgContent);
    
    const logoUrl = `/uploads/registrars/${filename}`;
    
    await prisma.registrar.update({
      where: { id: reg.id },
      data: { logo: logoUrl }
    });
    
    updatedCount++;
  }

  console.log(`Successfully generated and linked ${updatedCount} SVG logos.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
