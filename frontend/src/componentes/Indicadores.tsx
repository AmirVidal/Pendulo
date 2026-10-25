import type { Estado } from '../tipos/medicion'
export function PenduloVisual({angulo}:{angulo:number}) {
 const giro=Math.max(-45,Math.min(45,angulo))
 return <div className="pendulo-visual"><strong>{angulo.toFixed(2)}°</strong><svg viewBox="0 0 190 175" role="img" aria-label={`Inclinación ${angulo.toFixed(2)} grados`}><line x1="95" x2="95" y1="12" y2="143" stroke="#4a6b7e" strokeDasharray="5 5"/><g transform={`rotate(${giro},95,138)`}><line x1="95" x2="95" y1="138" y2="26" stroke="#00dafa" strokeWidth="6" strokeLinecap="round"/><circle cx="95" cy="26" r="11" fill="#04dcf8"/></g><rect x="60" y="134" width="70" height="25" rx="7" fill="#236e97" stroke="#8feaff" strokeWidth="2"/><circle cx="76" cy="161" r="9" fill="#082033" stroke="#a4efff" strokeWidth="4"/><circle cx="115" cy="161" r="9" fill="#082033" stroke="#a4efff" strokeWidth="4"/></svg></div>
}
export function CarroVisual({posicion,estado}:{posicion:number;estado:Estado}) {
 const porcentaje=Math.min(100,Math.max(0,(posicion+40.8)/81.6*100))
 return <div className="carro-visual"><div className="posicion-actual"><strong>{posicion>=0?'+':''}{posicion.toFixed(2)} cm</strong><span className={`estado ${estado==='Estable'?'bien':estado==='Corrigiendo'?'alerta':'peligro'}`}>● {estado}</span></div><div className="riel"><div className="centro-riel"/><div className="marcador-carro" style={{left:`${porcentaje}%`}}/></div><div className="marcas"><span>-40.8</span><span>0</span><span>+40.8</span></div><p>Posición en el riel (cm)</p></div>
}
