import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Printer, Info, UserCheck, 
  Sun, Moon, Upload, Download, RotateCcw, 
  Image as ImageIcon, Menu, X, ClipboardList,
  Activity, HelpCircle,
  BookOpen, ListChecks, Zap, Trash2
} from 'lucide-react';
import { LOGO_SVG } from './constants';
import { FOP04Data, FOP04_INITIAL } from './forms/fop04/schema';
import { FOP01Data, FOP01_INITIAL } from './forms/fop01/schema';
import TestTable from './components/TestTable';
import ProtocolPreview from './components/ProtocolPreview';

type FormID = 'F-OP-01' | 'F-OP-02' | 'F-OP-03' | 'F-OP-04' | 'F-OP-05' | 'P-OP-01' | 'P-OP-02';

const App: React.FC = () => {
  const [activeForm, setActiveForm] = useState<FormID>('F-OP-04');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    return 'light';
  });

  // Estado independiente para F-OP-04
  const [fop04Data, setFop04Data] = useState<FOP04Data>(() => {
    const saved = localStorage.getItem('data_fop04');
    return saved ? JSON.parse(saved) : FOP04_INITIAL;
  });

  // Estado independiente para F-OP-01
  const [fop01Data, setFop01Data] = useState<FOP01Data>(() => {
    const saved = localStorage.getItem('data_fop01');
    return saved ? JSON.parse(saved) : FOP01_INITIAL;
  });

  const [customLogo, setCustomLogo] = useState<string | null>(() => localStorage.getItem('custom_logo'));
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('data_fop04', JSON.stringify(fop04Data));
  }, [fop04Data]);

  useEffect(() => {
    localStorage.setItem('data_fop01', JSON.stringify(fop01Data));
  }, [fop01Data]);

  useEffect(() => {
    if (customLogo) {
      localStorage.setItem('custom_logo', customLogo);
    } else {
      localStorage.removeItem('custom_logo');
    }
  }, [customLogo]);

  useEffect(() => {
    const root = window.document.documentElement;
    theme === 'dark' ? root.classList.add('dark') : root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handlePrint = () => window.print();

  const handleExportJSON = () => {
    const dataToExport = activeForm === 'F-OP-04' ? fop04Data : fop01Data;
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PX_Control_${activeForm}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content);
        
        if (activeForm === 'F-OP-04' && parsedData.tests) {
          setFop04Data(parsedData);
        } else if (activeForm === 'F-OP-01' && parsedData.notes !== undefined) {
          setFop01Data(parsedData);
        } else {
          alert('Formato de archivo inválido para este formulario.');
        }
      } catch (error) {
        alert('Error al leer el archivo JSON.');
        console.error(error);
      }
    };
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCustomLogo(`<img src="${result}" alt="Custom Logo" style="width: 100%; height: 100%; object-fit: contain;" />`);
      };
      reader.readAsDataURL(file);
    }
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  const handleClearData = () => {
    if (window.confirm('¿Estás seguro de que deseas limpiar todos los datos del formulario actual? Esta acción no se puede deshacer.')) {
      if (activeForm === 'F-OP-04') {
        setFop04Data(FOP04_INITIAL);
      } else if (activeForm === 'F-OP-01') {
        setFop01Data(FOP01_INITIAL);
      }
      setCustomLogo(null);
    }
  };

  const menuItems = [
    { section: 'Operaciones (Registros)', items: [
      { id: 'F-OP-01', icon: BookOpen, label: 'Control de Proyectos', code: 'F OP-01', active: true },
      { id: 'F-OP-02', icon: Zap, label: 'Ensayo Tablero Señales', code: 'F OP-02', active: false },
      { id: 'F-OP-03', icon: Activity, label: 'Ensayo Tablero Arranque', code: 'F OP-03', active: false },
      { id: 'F-OP-04', icon: ClipboardList, label: 'Ensayo Programa (SW)', code: 'F OP-04', active: true },
      { id: 'F-OP-05', icon: ListChecks, label: 'Checklist Proyectos', code: 'F OP-05', active: false },
    ]},
    { section: 'Procedimientos (Ayuda)', items: [
      { id: 'P-OP-01', icon: HelpCircle, label: 'Proc. de Operaciones', code: 'P OP-01', active: false },
      { id: 'P-OP-02', icon: Info, label: 'Diseño y Desarrollo', code: 'P OP-02', active: false },
    ]}
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      <input type="file" accept=".json" ref={fileInputRef} onChange={handleImportJSON} className="hidden" />
      <input type="file" accept="image/*" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" />

      {/* Sidebar Modular */}
      <aside className={`no-print fixed inset-y-0 left-0 z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <div className={`flex items-center gap-3 ${!isSidebarOpen && 'hidden'}`}>
              <div className="w-8 h-8 flex items-center justify-center overflow-hidden">{LOGO_SVG("w-full h-full")}</div>
              <span className="font-black text-slate-800 dark:text-white">PX ISO 9001</span>
            </div>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-8 overflow-y-auto">
            {menuItems.map((group, idx) => (
              <div key={idx} className="space-y-2">
                {isSidebarOpen && <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{group.section}</p>}
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.active) {
                        setActiveForm(item.id as FormID);
                        setActiveTab('form');
                      }
                    }}
                    className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group relative ${
                      activeForm === item.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    } ${!item.active && 'opacity-40 cursor-not-allowed'}`}
                  >
                    <item.icon size={22} />
                    {isSidebarOpen && (
                      <div className="flex flex-col items-start overflow-hidden">
                        <span className="text-sm font-bold truncate">{item.label}</span>
                        <span className="text-[9px] font-medium opacity-60 uppercase">{item.code}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100 dark:border-slate-800">
            <button 
              onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} 
              className="w-full flex items-center gap-4 p-3 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
              {isSidebarOpen && <span className="text-sm font-bold">{theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content - NOTA: print:ml-0 remueve el margen del sidebar al imprimir para que quede centrado */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'ml-72 print:ml-0' : 'ml-20 print:ml-0'}`}>
        
        <header className="no-print bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {customLogo ? (
                  <div className="w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: customLogo }} />
                ) : (
                  LOGO_SVG("w-full h-full")
                )}
             </div>
             <div>
                <h1 className="text-lg font-bold dark:text-white leading-none">{activeForm} (Rev.0)</h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sistema de Gestión de Calidad</p>
             </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('form')} 
                className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase transition-colors ${activeTab === 'form' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Editor
              </button>
              <button 
                onClick={() => setActiveTab('preview')} 
                className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase transition-colors ${activeTab === 'preview' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Vista Previa
              </button>
            </div>
            
            {(activeForm === 'F-OP-04' || activeForm === 'F-OP-01') && (
              <div className="flex gap-1 ml-2 mr-2 border-x border-slate-200 dark:border-slate-700 px-3">
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                  title="Importar JSON"
                >
                  <Upload size={18} />
                </button>
                <button 
                  onClick={handleExportJSON} 
                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                  title="Exportar JSON"
                >
                  <Download size={18} />
                </button>
              </div>
            )}

            <button 
              onClick={handlePrint} 
              className="bg-slate-900 dark:bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors shadow-sm active:scale-95"
            >
              <Printer size={16} /><span>Imprimir</span>
            </button>
          </div>
        </header>

        {/* NOTA: print:p-0 remueve el padding que enjaulaba al reporte en la impresión */}
        <main className="flex-grow p-6 lg:p-10 print:p-0 print:m-0">
          
          {/* =======================
              F-OP-04 ENSAYO PROGRAMA
              ======================= */}
          {activeForm === 'F-OP-04' && (
            activeTab === 'form' ? (
              <div className="space-y-8 max-w-6xl mx-auto no-print">
                 {/* Encabezado F-OP-04 */}
                 <section className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-3">
                      <FileText size={20} className="text-blue-500" /> Datos del Encabezado
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="lg:col-span-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Cliente</label>
                        <input type="text" className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white transition-colors focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400" value={fop04Data.header.client} onChange={(e) => setFop04Data({...fop04Data, header: {...fop04Data.header, client: e.target.value}})} placeholder="Nombre del cliente" />
                      </div>
                      <div className="lg:col-span-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Orden de Trabajo (Nro Obra)</label>
                        <input type="text" className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white transition-colors focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400" value={fop04Data.header.workOrder} onChange={(e) => setFop04Data({...fop04Data, header: {...fop04Data.header, workOrder: e.target.value}})} placeholder="Ej: OT-2024-001" />
                      </div>
                      <div className="lg:col-span-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Programa</label>
                        <input type="text" className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white transition-colors focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400" value={fop04Data.header.program} onChange={(e) => setFop04Data({...fop04Data, header: {...fop04Data.header, program: e.target.value}})} placeholder="Ej: PLC-01 / SCADA" />
                      </div>
                      <div className="lg:col-span-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Nombre del Proyecto</label>
                        <input type="text" className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white transition-colors focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400" value={fop04Data.header.name} onChange={(e) => setFop04Data({...fop04Data, header: {...fop04Data.header, name: e.target.value}})} placeholder="Nombre del proyecto" />
                      </div>
                      <div className="lg:col-span-4">
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Descripción General</label>
                        <textarea className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white transition-colors focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24 placeholder:text-slate-400" value={fop04Data.header.description} onChange={(e) => setFop04Data({...fop04Data, header: {...fop04Data.header, description: e.target.value}})} placeholder="Breve descripción del ensayo..." />
                      </div>
                    </div>
                 </section>

                 <section className="space-y-6">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-3"><ListChecks size={20} className="text-blue-500" /> Protocolo de Ensayos</h2>
                    <TestTable tests={fop04Data.tests} onUpdate={(tests) => setFop04Data({...fop04Data, tests})} />
                 </section>

                 <section className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-3"><UserCheck size={20} className="text-blue-500" /> Firmas de Aprobación</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Realizó (Resp. Programación)</label>
                        <input type="text" className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none" value={fop04Data.footer.realizadoNombre} onChange={(e) => setFop04Data({...fop04Data, footer: {...fop04Data.footer, realizadoNombre: e.target.value}})} placeholder="Nombre" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Aprobación (Resp. Automatización)</label>
                        <input type="text" className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none" value={fop04Data.footer.aprobacionAutoNombre} onChange={(e) => setFop04Data({...fop04Data, footer: {...fop04Data.footer, aprobacionAutoNombre: e.target.value}})} placeholder="Nombre" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Aprobación (Cliente)</label>
                        <input type="text" className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none" value={fop04Data.footer.aprobacionClienteNombre} onChange={(e) => setFop04Data({...fop04Data, footer: {...fop04Data.footer, aprobacionClienteNombre: e.target.value}})} placeholder="Nombre" />
                      </div>
                    </div>
                 </section>
                 
                 <div className="flex justify-end pt-4 pb-12">
                   <button onClick={handleClearData} className="flex items-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                     <Trash2 size={16} /> Limpiar Formulario
                   </button>
                 </div>
              </div>
            ) : (
              /* Contenedor de Previsualización - NOTA: print:bg-transparent print:p-0 remueve los marcos y fondos extra en la impresión */
              <div className="max-w-6xl mx-auto bg-slate-200/50 dark:bg-slate-800 p-8 rounded-[32px] overflow-x-auto border border-slate-200 dark:border-slate-700 shadow-inner print:p-0 print:m-0 print:bg-transparent print:border-none print:shadow-none print:overflow-visible print:max-w-none">
                <ProtocolPreview data={fop04Data} customLogo={customLogo} />
              </div>
            )
          )}

          {/* =======================
              F-OP-01 CONTROL PROYECTO
              ======================= */}
          {activeForm === 'F-OP-01' && (
            <div className="space-y-8 max-w-6xl mx-auto">
               <section className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm no-print">
                  <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-3">
                    <BookOpen size={20} className="text-blue-500" /> Control de Proyectos (F-OP-01)
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Cliente</label>
                      <input type="text" className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none" value={fop01Data.header.client} onChange={(e) => setFop01Data({...fop01Data, header: {...fop01Data.header, client: e.target.value}})} placeholder="Nombre del cliente" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Proyecto</label>
                      <input type="text" className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none" value={fop01Data.header.projectName} onChange={(e) => setFop01Data({...fop01Data, header: {...fop01Data.header, projectName: e.target.value}})} placeholder="Nombre del proyecto" />
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-sm border border-blue-100 dark:border-blue-900/50">
                    <p className="font-bold flex items-center gap-2"><Activity size={18} /> Estructura Inicial Creada</p>
                    <p className="opacity-80 mt-1">Podemos proceder a diseñar la tabla de hitos o entregables para este formulario en los próximos pasos.</p>
                  </div>
               </section>
               
               {activeTab === 'preview' && (
                 <div className="max-w-6xl mx-auto bg-slate-200/50 dark:bg-slate-800 p-8 rounded-[32px] flex items-center justify-center border border-slate-200 dark:border-slate-700">
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Previsualización F-OP-01 en construcción</p>
                 </div>
               )}
            </div>
          )}

          {/* FALLBACK OTROS FORMULARIOS */}
          {activeForm !== 'F-OP-04' && activeForm !== 'F-OP-01' && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-400 space-y-4">
              <BookOpen size={48} className="opacity-20" />
              <p className="text-sm font-bold uppercase tracking-widest">Módulo {activeForm} en desarrollo</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default App;