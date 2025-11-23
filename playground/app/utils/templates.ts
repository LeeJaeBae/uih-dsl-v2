import fs from 'fs';
import path from 'path';

export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  code: string;
}

export function getTemplates(): Template[] {
  const templatesDir = path.join(process.cwd(), 'app/templates');
  const files = fs.readdirSync(templatesDir);
  
  return files
    .filter(file => file.endsWith('.uih'))
    .map(file => {
      const id = file.replace('.uih', '');
      const content = fs.readFileSync(path.join(templatesDir, file), 'utf-8');
      
      // Extract metadata from content using regex
      const titleMatch = content.match(/title:\s*"([^"]+)"/);
      const descMatch = content.match(/description:\s*"([^"]+)"/);
      
      // Determine category based on filename or content
      let category = 'General';
      if (id.includes('dashboard')) category = 'Dashboard';
      else if (id.includes('landing')) category = 'Landing Page';
      else if (id.includes('mobile')) category = 'Mobile';
      else if (['nexus-dashboard', 'feature-showcase', 'adaptive-components', 'state-machine'].includes(id)) category = 'Showcase';
      
      return {
        id,
        title: titleMatch ? titleMatch[1] : id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        description: descMatch ? descMatch[1] : `Template for ${id}`,
        category,
        code: content
      };
    });
}
