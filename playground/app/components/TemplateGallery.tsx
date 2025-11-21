import { motion } from 'framer-motion';
import { Template } from '../utils/templates';

interface TemplateGalleryProps {
  templates: Template[];
  onSelect: (template: Template) => void;
  onClose: () => void;
}

export default function TemplateGallery({ templates, onSelect, onClose }: TemplateGalleryProps) {
  // Group templates by category
  const categories = Array.from(new Set(templates.map(t => t.category)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Template Gallery</h2>
            <p className="text-gray-500 mt-1">Choose a starting point for your next project</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          {categories.map(category => (
            <div key={category} className="mb-10 last:mb-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                {category}
                <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full font-medium">
                  {templates.filter(t => t.category === category).length}
                </span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates
                  .filter(t => t.category === category)
                  .map(template => (
                    <motion.button
                      key={template.id}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSelect(template)}
                      className="group text-left bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 overflow-hidden flex flex-col h-full"
                    >
                      {/* Preview Placeholder */}
                      <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-100 relative overflow-hidden group-hover:from-blue-50/50 group-hover:to-indigo-50/50 transition-colors">
                        {/* Abstract shapes for preview */}
                        <div className="absolute inset-0 opacity-50">
                          <div className="absolute top-4 left-4 right-4 h-2 bg-white rounded-full shadow-sm opacity-60"></div>
                          <div className="absolute top-10 left-4 w-1/3 h-2 bg-white rounded-full shadow-sm opacity-40"></div>
                          <div className="absolute top-20 left-4 right-4 bottom-4 bg-white rounded-lg shadow-sm opacity-80 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500"></div>
                        </div>
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <span className="bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-semibold shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300">
                            Use Template
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {template.title}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                          {template.description}
                        </p>
                        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-50">
                          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                            UIH DSL
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}