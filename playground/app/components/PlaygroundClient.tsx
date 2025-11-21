'use client';

import { useState, useEffect, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { useCompiler } from '../hooks/useCompiler';

import TemplateGallery from './TemplateGallery';
import { Template } from '../utils/templates';
import { motion, AnimatePresence } from 'framer-motion';
import { IframePreview } from './IframePreview';
import type { Framework } from '../types';

interface PlaygroundClientProps {
  initialTemplates: Template[];
}

export default function PlaygroundClient({ initialTemplates }: PlaygroundClientProps) {
  const [uihCode, setUihCode] = useState(initialTemplates[0]?.code || '');
  const [framework, setFramework] = useState<Framework>('react');
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [showGallery, setShowGallery] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplates[0]?.id);

  const { code, errors, wsStatus, ir } = useCompiler(uihCode, framework);
  const isCompiling = wsStatus === 'connecting';

  const cssVars = useMemo(() => {
    if (!ir?.style?.tokens) return {};
    const vars: Record<string, string> = {};
    ir.style.tokens.forEach((token: any) => {
      const key = token.path.join(".");
      vars[key] = String(token.value);
    });
    return vars;
  }, [ir]);

  const handleTemplateSelect = (template: Template) => {
    setUihCode(template.code);
    setSelectedTemplateId(template.id);
    setShowGallery(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden pt-14">
      {/* Sidebar / Toolbar */}
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6 z-20 shadow-sm">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-8 shadow-lg shadow-blue-200">
          U
        </div>
        
        <div className="flex flex-col gap-4 w-full px-2">
          <button 
            onClick={() => setShowGallery(true)}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200 group relative"
            title="Templates"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </button>
          
          <div className="h-px bg-gray-200 w-8 mx-auto my-2"></div>
          
          <button 
            onClick={() => setFramework('react')}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${framework === 'react' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
            title="React Output"
          >
            <span className="font-bold text-sm">Re</span>
          </button>

          <button 
            onClick={() => setFramework('vue')}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${framework === 'vue' ? 'bg-green-50 text-green-600' : 'text-gray-500 hover:bg-gray-100'}`}
            title="Vue Output"
          >
            <span className="font-bold text-sm">Vu</span>
          </button>

                    <button 

                      onClick={() => setFramework('svelte')}

                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${framework === 'svelte' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-100'}`}

                      title="Svelte Output"

                    >

                      <span className="font-bold text-sm">Sv</span>

                    </button>

                    

                    <button 

                      onClick={() => setFramework('html')}

                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${framework === 'html' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-100'}`}

                      title="HTML Output"

                    >

                      <span className="font-bold text-sm">Ht</span>

                    </button>

                  </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-800">
              {initialTemplates.find(t => t.id === selectedTemplateId)?.title || 'Playground'}
            </h1>
            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md font-medium">
              v2.0.0
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'preview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Preview
              </button>
              <button 
                onClick={() => setActiveTab('code')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'code' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Code
              </button>
            </div>
            
            <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">
              Export
            </button>
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor Panel */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col bg-white">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">UIH DSL</span>
              {isCompiling && <span className="text-xs text-blue-600 animate-pulse">Compiling...</span>}
            </div>
            <div className="flex-1 relative">
              <Editor
                height="100%"
                defaultLanguage="yaml"
                value={uihCode}
                onChange={(value) => setUihCode(value || '')}
                theme="light"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 16, bottom: 16 },
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                }}
              />
            </div>
          </div>

          {/* Preview/Output Panel */}
          <div className="w-1/2 bg-gray-50 flex flex-col relative">
            {activeTab === 'preview' ? (
              <div className="flex-1 p-8 overflow-hidden flex items-center justify-center bg-gray-100">
                <div className="w-full h-full bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 relative">
                  {errors && errors.length > 0 ? (
                    <div className="absolute inset-0 p-6 bg-red-50 overflow-auto">
                      <h3 className="text-red-800 font-bold mb-2">Compilation Error</h3>
                      <pre className="text-red-600 text-sm font-mono whitespace-pre-wrap">{errors[0].message}</pre>
                    </div>
                  ) : (
                    <IframePreview code={code} cssVars={cssVars} framework={framework} />
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                 <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Generated {framework.toUpperCase()}</span>
                </div>
                <div className="flex-1 relative">
                  <Editor
                    height="100%"
                    defaultLanguage={'typescript'}
                    value={code}
                    theme="light"
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      padding: { top: 16, bottom: 16 },
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Template Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <TemplateGallery 
            templates={initialTemplates} 
            onSelect={handleTemplateSelect} 
            onClose={() => setShowGallery(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
