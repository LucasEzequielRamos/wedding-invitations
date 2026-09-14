"use client";
import Image from "next/image";
import { getPublicMediaUrl } from "@/features/media/utils/get-public-media-url";

type MediaItem={id:string;path:string;alt:string|null;width:number|null;height:number|null;type?:string};
type Props={media:MediaItem[];value:string;onChange:(mediaId:string)=>void;label?:string};
export function MediaSelector({media,value,onChange,label="Seleccionar imagen"}:Props){
 return <div><label className="text-sm font-semibold text-slate-800">{label}</label>{media.length===0?<div className="mt-2 rounded-lg border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">No hay imágenes cargadas para esta boda. Subilas desde Media.</div>:<div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">{media.map(item=>{const selected=item.id===value;return <button key={item.id} type="button" onClick={()=>onChange(item.id)} className={`overflow-hidden rounded-xl border-2 bg-white text-left transition ${selected?"border-slate-900 ring-2 ring-slate-200":"border-slate-200 hover:border-slate-400"}`}><div className="relative aspect-square">{item.width&&item.height?<Image src={getPublicMediaUrl(item.path)} alt={item.alt??""} fill sizes="200px" className="object-cover"/>:<img src={getPublicMediaUrl(item.path)} alt={item.alt??""} className="h-full w-full object-cover"/>}</div><div className="flex items-center justify-between gap-2 px-2 py-2 text-xs text-slate-700"><span className="truncate">{item.alt||"Sin descripción"}</span>{selected&&<span className="font-bold text-slate-900">✓</span>}</div></button>})}</div>}</div>;
}
