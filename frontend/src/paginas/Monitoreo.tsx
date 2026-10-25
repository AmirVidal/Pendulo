import { Activity, Gauge, MoveHorizontal, Play, Save, Settings2, Square } from 'lucide-react'
import GraficaAngulo from '../componentes/GraficaAngulo'
import PanelGanancias from '../componentes/PanelGanancias'
import { CarroVisual, PenduloVisual } from '../componentes/Indicadores'
import type { Estado, Ganancias, Punto } from '../tipos/medicion'
type Props={puntos:Punto[];angulo:number;posicion:number;estado:Estado;ganancias:Ganancias;midiendo:boolean;puedeGuardar:boolean;iniciar:()=>void;detener:()=>void;guardar:()=>void;aplicar:(g:Ganancias)=>void}
export default function Monitoreo(p:Props) {
 return <div><div className="cabecera-pagina"><div><h2>Monitoreo en vivo</h2><p>Visualización de las variables del sistema</p></div><span className="demo">Datos simulados</span></div><section className="tarjeta grafica-principal"><h3><Activity size={20}/> Ángulo del péndulo en tiempo real <small>Referencia: 0°</small></h3><GraficaAngulo puntos={p.puntos}/></section>
 <div className="columnas-monitoreo"><section className="tarjeta"><h3><Gauge size={19}/> Ángulo del péndulo</h3><PenduloVisual angulo={p.angulo}/></section><section className="tarjeta"><h3><MoveHorizontal size={19}/> Estado de posición del dispositivo</h3><CarroVisual posicion={p.posicion} estado={p.estado}/></section><section className="tarjeta"><h3><Settings2 size={19}/> Ganancias LQR</h3><PanelGanancias ganancias={p.ganancias} aplicar={p.aplicar} bloqueado={p.midiendo}/></section></div>
 <div className="acciones-principales"><button className="boton principal" disabled={p.midiendo} onClick={p.iniciar}><Play size={18}/>Iniciar medición</button><button className="boton advertencia" disabled={!p.midiendo} onClick={p.detener}><Square size={17}/>Detener</button><button className="boton secundario" disabled={!p.puedeGuardar} onClick={p.guardar}><Save size={18}/>Guardar medición</button></div></div>
}
