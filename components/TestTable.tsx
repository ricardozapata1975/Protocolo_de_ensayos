
import React from 'react';
import { Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import { TestRow } from '../types';

interface TestTableProps {
  tests: TestRow[];
  onUpdate: (tests: TestRow[]) => void;
}

const TestTable: React.FC<TestTableProps> = ({ tests, onUpdate }) => {
  const addRow = () => {
    const newRow: TestRow = {
      id: Math.random().toString(36).substr(2, 9),
      section: '',
      type: '',
      test: '',
      comment: '',
      tested: false
    };
    onUpdate([...tests, newRow]);
  };

  const removeRow = (id: string) => {
    if (tests.length === 1) {
       onUpdate([{ ...tests[0], section: '', type: '', test: '', comment: '', tested: false }]);
       return;
    }
    onUpdate(tests.filter(t => t.id !== id));
  };

  const updateRow = (id: string, field: keyof TestRow, value: any) => {
    onUpdate(tests.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-800">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-4">Sección</th>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4">Ensayo</th>
              <th className="px-6 py-4">Comentario / Resultado</th>
              <th className="px-6 py-4 w-28 text-center">Probado</th>
              <th className="px-6 py-4 w-20 text-center">Eliminar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {tests.map((test) => (
              <tr key={test.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                <td className="px-3 py-2">
                  <input
                    type="text"
                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 rounded-xl p-2.5 text-sm text-slate-900 dark:text-white transition-all outline-none font-medium placeholder:text-slate-300 dark:placeholder:text-slate-700"
                    value={test.section}
                    onChange={(e) => updateRow(test.id, 'section', e.target.value)}
                    placeholder="Módulo..."
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 rounded-xl p-2.5 text-sm text-slate-900 dark:text-white transition-all outline-none font-medium placeholder:text-slate-300 dark:placeholder:text-slate-700"
                    value={test.type}
                    onChange={(e) => updateRow(test.id, 'type', e.target.value)}
                    placeholder="Ej: UX/UI..."
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 rounded-xl p-2.5 text-sm text-slate-900 dark:text-white transition-all outline-none font-medium placeholder:text-slate-300 dark:placeholder:text-slate-700"
                    value={test.test}
                    onChange={(e) => updateRow(test.id, 'test', e.target.value)}
                    placeholder="Ensayo..."
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 rounded-xl p-2.5 text-sm text-slate-900 dark:text-white transition-all outline-none font-medium placeholder:text-slate-300 dark:placeholder:text-slate-700"
                    value={test.comment}
                    onChange={(e) => updateRow(test.id, 'comment', e.target.value)}
                    placeholder="Observaciones..."
                  />
                </td>
                <td className="px-3 py-2 text-center">
                  <button
                    onClick={() => updateRow(test.id, 'tested', !test.tested)}
                    className={`inline-flex items-center justify-center p-2.5 rounded-xl transition-all shadow-sm ${
                      test.tested 
                        ? 'bg-green-100 dark:bg-green-500 text-green-700 dark:text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600'
                    }`}
                  >
                    {test.tested ? <CheckSquare size={20} /> : <Square size={20} />}
                  </button>
                </td>
                <td className="px-3 py-2 text-center">
                  <button
                    onClick={() => removeRow(test.id)}
                    className="p-2.5 text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-6 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex justify-center">
        <button
          onClick={addRow}
          className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/20 transition-all active:scale-95"
        >
          <Plus size={18} />
          Agregar nuevo ensayo
        </button>
      </div>
    </div>
  );
};

export default TestTable;
