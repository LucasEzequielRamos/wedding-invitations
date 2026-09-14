import type { TextConfig } from "../schemas/text-config.schema";
export function InvitationText({config}:{config:TextConfig}){return <section className="px-6 py-12"><p className={`mx-auto max-w-3xl whitespace-pre-line text-lg leading-8 ${config.align==='left'? 'text-left':config.align==='right'?'text-right':'text-center'}`}>{config.text}</p></section>}
