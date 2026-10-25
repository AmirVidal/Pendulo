import { Activity, ChevronDown, History, Orbit, UserCircle } from 'lucide-react'
import { useState } from 'react'
export type Pagina='monitoreo'|'historial'
export default function Estructura({pagina,cambiar,children}:{pagina:Pagina;cambiar:(p:Pagina)=>void;children:React.ReactNode}) {
 const [menu,setMenu]=useState(false)
 return <div className="aplicacion"><aside className="lateral"><div className="marca"><Orbit size={29}/> PÉNDULO</div><small>NAVEGACIÓN</small><nav><button className={pagina==='monitoreo'?'activo':''} onClick={()=>cambiar('monitoreo')}><Activity size={19}/>Monitoreo en vivo</button><button className={pagina==='historial'?'activo':''} onClick={()=>cambiar('historial')}><History size={19}/>Historial</button></nav><div className="pie-lateral">● Modo demostración</div></aside><div className="principal-layout"><header className="cabecera"><div className="titulo-cabecera"><h1>Control del Péndulo Invertido</h1><span className="conexion">● Simulación</span></div><div className="usuario"><button onClick={()=>setMenu(!menu)} aria-expanded={menu}><UserCircle size={28}/> Juan Pérez <ChevronDown size={16}/></button>{menu&&<div className="menu-usuario"><b>Juan Pérez</b><small>Usuario de demostración</small></div>}</div></header><main className="contenido">{children}</main></div></div>
}
