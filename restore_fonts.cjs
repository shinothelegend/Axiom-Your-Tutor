const fs = require('fs');
const path = require('path');

const filesToProcess = [
  path.join(__dirname, 'src/pages/SolverWorkspace.tsx'),
  path.join(__dirname, 'src/pages/Vault.tsx')
];

filesToProcess.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Reverse the font sizing from previous script
    const reverseSizeMap = {
      'text-xl': 'text-base',
      'text-lg': 'text-sm',
      'text-base': 'text-[12px]', // slightly bigger than original xs (12px)
      'text-sm': 'text-[11px]', // original
      'text-xs': 'text-[10px]' // slightly bigger than original 9px
    };
    
    content = content.replace(/text-xl|text-lg|text-base|text-sm|text-xs/g, match => reverseSizeMap[match]);
    
    fs.writeFileSync(file, content);
    console.log('Reversed fonts for', file);
  }
});
