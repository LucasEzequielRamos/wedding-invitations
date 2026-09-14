import type { QuoteConfig } from "../schemas/quote.schema";
export function InvitationQuote({config}:{config:QuoteConfig}){return <section className="px-6 py-16 text-center"><div className="mx-auto max-w-3xl"><blockquote className="text-3xl leading-relaxed">“{config.text}”</blockquote>{config.author&&<p className="mt-4 text-sm text-slate-500">{config.author}</p>}</div></section>}
