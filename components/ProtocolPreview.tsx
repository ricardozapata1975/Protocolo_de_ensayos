import React from 'react';
import { ProtocolData } from '../types';
import { LOGO_SVG } from '../constants';

interface ProtocolPreviewProps {
  data: ProtocolData;
  customLogo?: string | null;
}

const ProtocolPreview: React.FC<ProtocolPreviewProps> = ({ data, customLogo }) => {
  return (
    <div 
      id="protocol-report" 
      className="bg-white p-[10mm] sm:p-8 w-[210mm] min-h-[297mm] mx-auto text-[11px] font-sans border print:border-none shadow-xl print:shadow-none text-black box-border flex flex-col justify-between"
    >
      <div>
        {/* Header Container */}
        <div className="border-[1.5px] border-black flex flex-col mb-4 text-black">
          {/* Top Header */}
          <div className="flex border-b-[1.5px] border-black">
            <div className="w-[35%] p-3 flex flex-row items-center justify-center gap-3 border-r-[1.5px] border-black bg-white">
               <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {customLogo ? (
                    <div className="w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: customLogo }} />
                  ) : (
                    LOGO_SVG("w-full h-full")
                  )}
               </div>
               <div className="flex flex-col items-start leading-tight">
                 <div className="font-bold text-lg text-blue-800 tracking-tight">PX CONTROL</div>
                 <div className="text-[6.5px] uppercase tracking-tighter font-bold whitespace-nowrap text-black">Process Automation Experts</div>
               </div>
            </div>
            <div className="w-[65%] flex flex-col">
              <div className="text-center font-bold text-base py-3 border-b-[1.5px] border-black uppercase bg-gray-50 text-black">
                Protocolo de Ensayos Programa
              </div>
              <div className="grid grid-cols-6 h-full text-[9px]">
                <div className="col-span-1 p-1.5 border-r border-black font-bold bg-gray-100 flex items-center justify-center text-center text-black">Codigo</div>
                <div className="col-span-1 p-1.5 border-r border-black flex items-center justify-center font-medium text-black">{data.header.code}</div>
                <div className="col-span-1 p-1.5 border-r border-black font-bold bg-gray-100 flex items-center justify-center text-center leading-none text-black">Revisión N°</div>
                <div className="col-span-1 p-1.5 border-r border-black flex items-center justify-center font-medium text-black">{data.header.revision}</div>
                <div className="col-span-1 p-1.5 border-r border-black font-bold bg-gray-100 flex items-center justify-center text-center text-black">Vigencia</div>
                <div className="col-span-1 p-1.5 flex items-center justify-center font-medium text-black">{data.header.validityDate}</div>
              </div>
            </div>
          </div>
          
          {/* Row 1: Client & Work Order */}
          <div className="grid grid-cols-12 border-b-[1.5px] border-black text-[10px]">
            <div className="col-span-2 p-1.5 border-r border-black font-bold bg-gray-100 text-black">Cliente</div>
            <div className="col-span-6 p-1.5 border-r border-black font-medium uppercase text-black">{data.header.client || '------'}</div>
            <div className="col-span-2 p-1.5 border-r border-black font-bold bg-gray-100 text-center uppercase text-black">Nro Obra</div>
            <div className="col-span-2 p-1.5 font-medium text-center text-black">{data.header.workOrder || '------'}</div>
          </div>

          {/* Row 2: Program & Project Name */}
          <div className="grid grid-cols-12 border-b-[1.5px] border-black text-[10px]">
            <div className="col-span-2 p-1.5 border-r border-black font-bold bg-gray-100 text-black">Programa</div>
            <div className="col-span-4 p-1.5 border-r border-black font-medium text-black">{data.header.program || '------'}</div>
            <div className="col-span-2 p-1.5 border-r border-black font-bold bg-gray-100 text-center uppercase text-black">Nombre Proyecto</div>
            <div className="col-span-4 p-1.5 font-medium text-black">{data.header.name || '------'}</div>
          </div>

          {/* Row 3: Description (Full Width) */}
          <div className="grid grid-cols-12 text-[10px]">
            <div className="col-span-2 p-1.5 border-r border-black font-bold bg-gray-100 text-black">Desc:</div>
            <div className="col-span-10 p-1.5 font-medium leading-relaxed italic text-black">{data.header.description || '------'}</div>
          </div>
        </div>

        {/* Main Content Table */}
        <div className="border-[1.5px] border-black overflow-hidden">
          <table className="w-full text-left table-fixed text-black">
            <thead>
              <tr className="bg-gray-100 border-b-[1.5px] border-black text-[9px] uppercase font-bold text-black">
                <th className="p-1.5 border-r border-black w-24">Sección</th>
                <th className="p-1.5 border-r border-black w-24">Tipo</th>
                <th className="p-1.5 border-r border-black w-40">Ensayo</th>
                <th className="p-1.5 border-r border-black">Comentario / Resultado</th>
                <th className="p-1.5 w-16 text-center">Probado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/30 text-[9px] text-black">
              {data.tests.length > 0 ? data.tests.map((test) => (
                <tr key={test.id} className="min-h-[24px]">
                  <td className="p-1.5 border-r border-black break-words font-medium text-black">{test.section}</td>
                  <td className="p-1.5 border-r border-black break-words text-black">{test.type}</td>
                  <td className="p-1.5 border-r border-black break-words text-black">{test.test}</td>
                  <td className="p-1.5 border-r border-black break-words text-black">{test.comment}</td>
                  <td className="p-1.5 text-center font-bold text-green-700 text-sm align-middle">
                    {test.tested ? '✓' : ''}
                  </td>
                </tr>
              )) : null}
              {data.tests.length < 15 && Array.from({ length: 15 - data.tests.length }).map((_, i) => (
                <tr key={`empty-${i}`} className="h-6">
                  <td className="border-r border-black"></td>
                  <td className="border-r border-black"></td>
                  <td className="border-r border-black"></td>
                  <td className="border-r border-black"></td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signatures Footer */}
        <div className="mt-8 grid grid-cols-3 border-[1.5px] border-black text-black">
          <div className="border-r border-black flex flex-col min-h-[100px]">
            <div className="bg-gray-100 border-b border-black p-2 text-[9px] font-bold uppercase text-black">Realizó: Resp. Programación</div>
            <div className="p-4 flex flex-col gap-3 flex-grow justify-end">
              <div className="flex gap-2 text-[10px] text-black"><span>Nombre:</span> <span className="border-b border-dotted border-black flex-grow font-bold text-black">{data.footer.realizadoNombre}</span></div>
              <div className="flex gap-2 text-[10px] text-black"><span>Firma:</span> <span className="border-b border-dotted border-black flex-grow h-6"></span></div>
            </div>
          </div>
          <div className="border-r border-black flex flex-col min-h-[100px]">
            <div className="bg-gray-100 border-b border-black p-2 text-[9px] font-bold uppercase text-black">Aprobación: Resp Automatización</div>
            <div className="p-4 flex flex-col gap-3 flex-grow justify-end">
               <div className="flex gap-2 text-[10px] text-black"><span>Nombre:</span> <span className="border-b border-dotted border-black flex-grow font-bold text-black">{data.footer.aprobacionAutoNombre}</span></div>
               <div className="flex gap-2 text-[10px] text-black"><span>Firma:</span> <span className="border-b border-dotted border-black flex-grow h-6"></span></div>
            </div>
          </div>
          <div className="flex flex-col min-h-[100px]">
            <div className="bg-gray-100 border-b border-black p-2 text-[9px] font-bold uppercase text-black">Aprobación: Cliente</div>
            <div className="p-4 flex flex-col gap-3 flex-grow justify-end">
              <div className="flex gap-2 text-[10px] text-black"><span>Nombre:</span> <span className="border-b border-dotted border-black flex-grow font-bold text-black">{data.footer.aprobacionClienteNombre}</span></div>
              <div className="flex gap-2 text-[10px] text-black"><span>Firma:</span> <span className="border-b border-dotted border-black flex-grow h-6"></span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Footer Note */}
      <div className="mt-6 flex justify-between items-end border-t border-gray-200 pt-2">
        <div className="text-[8px] text-gray-500 italic">
          Documento generado digitalmente via PX Control Web Portal - Sistema de Gestión de Calidad ISO 9001
        </div>
        <div className="text-[8px] font-bold text-gray-600">
          Pág. 1 de 1
        </div>
      </div>
    </div>
  );
};

export default ProtocolPreview;