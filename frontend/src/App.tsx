import { useEffect, useRef, useState } from 'react'
import Estructura from './componentes/Estructura'
import type { Pagina } from './componentes/Estructura'
import Monitoreo from './paginas/Monitoreo'
import Historial from './paginas/Historial'
import { cargarMediciones, persistirMediciones } from './servicios/mediciones'
import { estadoDe, gananciasIniciales } from './tipos/medicion'
import type { Ganancias, Medicion, Punto } from './tipos/medicion'

const INTERVALO=100
function simular(t:number):Punto {return {tiempo:Number(t.toFixed(2)),angulo:Number((14*Math.exp(-.12*t)*Math.sin(2.3*t+.5)).toFixed(3)),posicion:Number((12.5*Math.exp(-.08*t)*Math.sin(1.4*t)).toFixed(3))}}
export default function App() {
 const [pagina,setPagina]=useState<Pagina>('monitoreo');const [puntos,setPuntos]=useState<Punto[]>([]);const [midiendo,setMidiendo]=useState(false);const [puedeGuardar,setPuedeGuardar]=useState(false)
 const [ganancias,setGanancias]=useState<Ganancias>(gananciasIniciales);const [mediciones,setMediciones]=useState<Medicion[]>(cargarMediciones)
 const completos=useRef<Punto[]>([]);const inicio=useRef<number|null>(null);const fecha=useRef('');const gananciasDeMedicion=useRef<Ganancias>(gananciasIniciales)
 const ultimo=puntos.at(-1);const angulo=ultimo?.angulo??0;const posicion=ultimo?.posicion??0
 useEffect(()=>{if(!midiendo)return;const identificador=window.setInterval(()=>{if(inicio.current===null)return;const punto=simular((performance.now()-inicio.current)/1000);completos.current.push(punto);setPuntos(completos.current.slice(-500))},INTERVALO);return ()=>window.clearInterval(identificador)},[midiendo])
 function iniciar(){completos.current=[];inicio.current=performance.now();fecha.current=new Date().toISOString();gananciasDeMedicion.current={...ganancias};setPuntos([]);setPuedeGuardar(false);setMidiendo(true)}
 function detener(){setMidiendo(false);inicio.current=null;setPuedeGuardar(completos.current.length>0)}
 function guardar(){if(midiendo||!puedeGuardar||completos.current.length===0)return;const lista=[...completos.current];const fin=lista.at(-1)!;const nuevo:Medicion={id:crypto.randomUUID(),fecha:fecha.current,duracion:fin.tiempo,anguloMaximo:Math.max(...lista.map(p=>Math.abs(p.angulo))),ganancias:{...gananciasDeMedicion.current},estado:estadoDe(fin.angulo,fin.posicion),puntos:lista};try{const siguientes=[nuevo,...mediciones];persistirMediciones(siguientes);setMediciones(siguientes);setPuedeGuardar(false);window.alert('Medición guardada correctamente.')}catch{window.alert('No se pudo guardar. Comprueba el espacio disponible en el navegador.')}}
 function eliminar(id:string){const siguientes=mediciones.filter(m=>m.id!==id);try{persistirMediciones(siguientes);setMediciones(siguientes)}catch{window.alert('No se pudo actualizar el historial.')}}
 function aplicar(g:Ganancias){if(midiendo)return;setGanancias(g)}
 return <Estructura pagina={pagina} cambiar={setPagina}>{pagina==='monitoreo'?<Monitoreo puntos={puntos} angulo={angulo} posicion={posicion} estado={estadoDe(angulo,posicion)} ganancias={ganancias} midiendo={midiendo} puedeGuardar={puedeGuardar} iniciar={iniciar} detener={detener} guardar={guardar} aplicar={aplicar}/>:<Historial mediciones={mediciones} eliminar={eliminar} volver={()=>setPagina('monitoreo')}/>}</Estructura>
}
