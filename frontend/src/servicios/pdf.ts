import { jsPDF } from 'jspdf'
import type { Medicion } from '../tipos/medicion'
import { duracionTexto } from '../tipos/medicion'
export function exportarPDF(m:Medicion) {
 const pdf=new jsPDF();pdf.setFillColor(10,31,46);pdf.rect(0,0,210,36,'F');pdf.setTextColor(255,255,255);pdf.setFontSize(17);pdf.text('Control del Pendulo Invertido',17,17);pdf.setFontSize(10);pdf.text('Informe de medicion',17,26)
 pdf.setTextColor(30,45,60);pdf.setFontSize(12);pdf.text('Datos de la medicion',17,49);pdf.setFontSize(10)
 const filas=[`Fecha: ${new Date(m.fecha).toLocaleString('es-BO')}`,`Duracion: ${duracionTexto(m.duracion)}`,`Angulo maximo: ${m.anguloMaximo.toFixed(2)} grados`,`Estado: ${m.estado}`,`Muestras registradas: ${m.puntos.length}`]
 filas.forEach((texto,i)=>pdf.text(texto,17,60+i*7));pdf.setFontSize(12);pdf.text('Ganancias LQR',17,107);pdf.setFontSize(10);pdf.text(Object.entries(m.ganancias).map(([k,v])=>`${k.toUpperCase()}: ${v}`).join('     '),17,118)
 pdf.setFontSize(12);pdf.text('Angulo en funcion del tiempo',17,135)
 const x=20,y=145,w=170,h=88;pdf.setDrawColor(190,203,215);pdf.rect(x,y,w,h)
 for(let i=1;i<4;i++)pdf.line(x,y+h*i/4,x+w,y+h*i/4)
 pdf.setDrawColor(35,170,85);pdf.line(x,y+h/2,x+w,y+h/2)
 const maxT=Math.max(1,m.duracion);const maxA=Math.max(5,Math.ceil(m.anguloMaximo/5)*5)
 pdf.setDrawColor(0,160,205);pdf.setLineWidth(0.45)
 for(let i=1;i<m.puntos.length;i++){const a=m.puntos[i-1],b=m.puntos[i];pdf.line(x+a.tiempo/maxT*w,y+h/2-a.angulo/maxA*h/2,x+b.tiempo/maxT*w,y+h/2-b.angulo/maxA*h/2)}
 pdf.setFontSize(9);pdf.text(`Escala vertical: +/- ${maxA} grados`,20,243);pdf.text(`Tiempo total: ${m.duracion.toFixed(2)} s`,120,243);pdf.setTextColor(90,105,117);pdf.text('Reporte generado por Control del Pendulo Invertido',17,282)
 pdf.save(`medicion-${m.id.slice(0,8)}.pdf`)
}
