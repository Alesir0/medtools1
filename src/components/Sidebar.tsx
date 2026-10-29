import React from 'react';
import { 
  X, 
  Ambulance, 
  Droplet, 
  BedDouble, 
  Baby, 
  Pill, 
  FileText, 
  Ban, 
  Scan, 
  Brain, 
  HeartPulse, 
  Settings, 
  Archive,
  Layers
} from 'lucide-react';
import { ToolConfigItem } from '../types/clinical';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  toolsConfig: ToolConfigItem[];
  triageCount: number;
  wardCount: number;
  hdCount: number;
  dischargedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  toolsConfig,
  triageCount,
  wardCount,
  hdCount,
  dischargedCount,
}) => {
  const getToolIcon = (id: string) => {
    switch (id) {
      case 'tab-er-triage': return <Ambulance className="w-5 h-5 text-rose-400" />;
      case 'tab-hd-patients': return <Droplet className="w-5 h-5 text-teal-400" />;
      case 'tab-ward-patients': return <BedDouble className="w-5 h-5 text-sky-400" />;
      case 'tab-discharged': return <Archive className="w-5 h-5 text-amber-400" />;
      case 'tab-peds': return <Baby className="w-5 h-5 text-emerald-400" />;
      case 'tab-er-drugs': return <Pill className="w-5 h-5 text-rose-400" />;
      case 'tab-iraqi-rx': return <FileText className="w-5 h-5 text-purple-400" />;
      case 'tab-actilyse': return <Ban className="w-5 h-5 text-red-400" />;
      case 'tab-head-ct': return <Scan className="w-5 h-5 text-indigo-400" />;
      case 'tab-gcs': return <Brain className="w-5 h-5 text-cyan-400" />;
      case 'tab-heart': return <HeartPulse className="w-5 h-5 text-rose-400" />;
      case 'tab-admin': return <Settings className="w-5 h-5 text-slate-400" />;
      default: return <Layers className="w-5 h-5 text-slate-400" />;
    }
  };

  const getBadgeCount = (id: string) => {
    if (id === 'tab-er-triage') return triageCount;
    if (id === 'tab-ward-patients') return wardCount;
    if (id === 'tab-hd-patients') return hdCount;
    if (id === 'tab-discharged') return dischargedCount;
    return undefined;
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-80 bg-slate-900 border-l border-slate-800 text-slate-200 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="font-bold text-base text-white">الأقسام والوحدات السريرية</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {toolsConfig.filter(t => t.visible).map((tool) => {
            const isActive = activeTab === tool.id;
            const count = getBadgeCount(tool.id);

            return (
              <button
                key={tool.id}
                onClick={() => {
                  onSelectTab(tool.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {getToolIcon(tool.id)}
                  <span className="truncate">{tool.title}</span>
                </div>
                {count !== undefined && count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : tool.id === 'tab-er-triage'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : tool.id === 'tab-discharged'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-slate-800 text-center text-xs text-slate-500">
          <span>المنظومة السريرية الذكية • إصدار المستشفى 2026</span>
        </div>
      </aside>
    </>
  );
};
