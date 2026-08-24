const fs = require('fs');
const path = require('path');

const filesToProcess = [
  path.join(__dirname, 'src/pages/SolverWorkspace.tsx'),
  path.join(__dirname, 'src/pages/Vault.tsx'),
  path.join(__dirname, 'src/components/Layout.tsx')
];

filesToProcess.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace font sizes
    content = content.replace(/text-\[9px\]/g, 'text-xs');
    content = content.replace(/text-\[10px\]/g, 'text-sm');
    content = content.replace(/text-\[11px\]/g, 'text-sm');
    content = content.replace(/text-xs/g, 'text-base');
    
    // Wait, replacing text-xs to text-base will conflict if I then replace text-base. 
    // We can do it in a single pass with a replacer function.
    
    // But since I only need to bump up to text-base, I can just do:
    // text-[9px] -> text-[11px]
    // text-[10px] -> text-xs
    // text-[11px] -> text-sm
    // text-xs -> text-base
    // Let's use a function
    
    const sizeMap = {
      'text-[9px]': 'text-xs',
      'text-[10px]': 'text-sm',
      'text-[11px]': 'text-sm',
      'text-xs': 'text-base',
      'text-sm': 'text-lg',
      'text-base': 'text-xl'
    };
    
    content = content.replace(/text-\[9px\]|text-\[10px\]|text-\[11px\]|text-xs|text-sm|text-base/g, match => sizeMap[match]);
    
    // Check for dashboard shadow or any bg-black/40 which looks like shadow
    content = content.replace(/bg-black\/40/g, 'bg-transparent');
    content = content.replace(/bg-black\/60/g, 'bg-transparent');
    content = content.replace(/bg-axiom-surface-dark\/95/g, 'bg-axiom-base-dark'); // remove surface color to flatten
    content = content.replace(/backdrop-blur-md/g, ''); // remove blur

    fs.writeFileSync(file, content);
    console.log('Processed', file);
  }
});
