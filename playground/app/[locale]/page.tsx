import { getTemplates } from '../utils/templates';
import PlaygroundClient from '../components/PlaygroundClient';


export default function Page() {
  const templates = getTemplates();
  
  return <PlaygroundClient initialTemplates={templates} />;
}