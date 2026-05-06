import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { createAnubisPix } from "@/server/anubis.functions";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Proteja o Seu Relacionamento — Relatório WhatsApp" },
      {
        name: "description",
        content:
          "Descubra o que escondem de si. Localização, áudios, fotos e vídeos eliminados. Resultados em 2 minutos, totalmente discreto.",
      },
    ],
  }),
});

type Step = "intro" | "phone" | "processing" | "report";

function TopBanner({ red = true }: { red?: boolean }) {
  return (
    <div
      className={`w-full text-center py-3 text-sm font-bold tracking-wide text-white ${red ? "bg-brand-red-soft" : "bg-brand-red"
        }`}
    >
      APENAS HOJE 01/05/2026 TESTE GRÁTIS.
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-white">
      <div className="max-w-3xl mx-auto px-6 py-8 text-center text-sm text-muted-foreground space-y-4">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a href="#" className="hover:text-foreground transition">Política de Privacidade</a>
          <a href="#" className="hover:text-foreground transition">Termos de Utilização</a>
          <a href="#" className="hover:text-foreground transition">Suporte por Email</a>
        </div>
        <p className="leading-relaxed">
          Esta plataforma tem finalidade exclusivamente informativa e destina-se a auxiliar pais,
          responsáveis legais e profissionais autorizados a compreender ferramentas de monitorização
          de dispositivos, sempre dentro dos limites da legislação vigente e com o devido consentimento.
        </p>
        <p>© 2026 Proteja o Seu Relacionamento. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

function CookieBanner() {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-foreground/95 text-white px-4 py-3 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
      <span>Este site utiliza cookies para melhorar a sua experiência. Ao continuar, concorda com a nossa política.</span>
      <button
        onClick={() => setShow(false)}
        className="bg-brand-green hover:bg-brand-green-strong transition text-white font-semibold px-5 py-2 rounded-md"
      >
        Aceitar
      </button>
    </div>
  );
}

function IntroStep({ onChoose }: { onChoose: () => void }) {
  return (
    <div className="min-h-[calc(100vh-48px)] flex flex-col">
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            DESCUBRA O QUE ESCONDEM DE SI...
          </h1>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Localização em tempo real, áudios, fotos e vídeos eliminados!
            <br />
            Resultados em 2 minutos, totalmente discreto.
          </p>
          <div className="mt-10 space-y-4">
            <button
              onClick={onChoose}
              className="w-full flex items-center gap-4 bg-brand-green hover:bg-brand-green-strong transition text-white font-bold py-5 px-6 rounded-xl shadow-sm"
            >
              <span className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-lg">👤</span>
              <span>Quero Monitorizar o Meu Parceiro</span>
            </button>
            <button
              onClick={onChoose}
              className="w-full flex items-center gap-4 bg-brand-green hover:bg-brand-green-strong transition text-white font-bold py-5 px-6 rounded-xl shadow-sm"
            >
              <span className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-lg">👤</span>
              <span>Quero Monitorizar a Minha Parceira</span>
            </button>
          </div>
        </div>
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

function PhoneStep({ onSubmit, onBack }: { onSubmit: () => void; onBack: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const validate = (v: string) => {
    const digits = v.replace(/\D/g, "");
    if (!digits) return "Insira um número de telemóvel.";
    if (digits.length < 6) return "Número demasiado curto.";
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate(value);
    setError(err);
    if (!err) onSubmit();
  };

  return (
    <div className="min-h-[calc(100vh-48px)] flex flex-col">
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Introduza o número da sua parceira
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Insira o número de telemóvel com indicativo do país <span className="text-brand-red font-medium">(ex: +351)</span>
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
            <div>
              <input
                type="tel"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (error) setError(validate(e.target.value));
                }}
                placeholder="+351 912 345 678"
                aria-invalid={!!error}
                className={`w-full px-5 py-4 rounded-xl border-2 text-center text-lg outline-none transition ${error ? "border-destructive" : "border-brand-green focus:border-brand-green-strong"
                  }`}
              />
              {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-brand-green hover:bg-brand-green-strong transition text-white font-bold py-4 rounded-xl"
            >
              Iniciar Monitorização
            </button>
            <button
              type="button"
              onClick={onBack}
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              ← Voltar
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ProcessingStep({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const steps = [
    "A localizar servidor mais próximo...",
    "A estabelecer ligação segura...",
    "A autenticar credenciais...",
    "A aceder à base de dados...",
    "A recolher mensagens...",
    "A analisar conversas...",
  ];
  const [shown, setShown] = useState<number>(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => Math.min(100, p + 4));
    }, 120);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setShown(Math.min(steps.length, Math.floor((progress / 100) * steps.length) + 1));
  }, [progress]);

  return (
    <div className="min-h-[calc(100vh-48px)] flex flex-col">
      <main className="flex-1 flex items-start justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              A Processar Acesso ao WhatsApp
            </h1>
            <p className="mt-3 text-muted-foreground">
              Aguarde enquanto conectamos aos servidores e preparamos o seu acesso.
            </p>
          </div>

          <div className="mt-8 bg-white rounded-2xl border border-border p-6 shadow-sm">
            <div className="h-3 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full bg-brand-green transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">A conectar aos servidores... {progress}%</p>

            <ul className="mt-5 bg-secondary rounded-xl p-4 space-y-2 max-h-44 overflow-auto text-sm">
              {steps.slice(0, shown).map((s, i) => (
                <li key={i} className="flex items-center gap-2 text-foreground">
                  <span className="text-brand-green">↻</span> {s}
                </li>
              ))}
            </ul>

            <div className="mt-6 bg-secondary rounded-xl p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xl">
                👤
              </div>
              <div className="flex-1">
                <p className="font-bold">Perfil WhatsApp</p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-green/15 text-brand-green-strong">
                Online
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-secondary rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Última conexão</p>
                <p className="font-bold">Há poucos minutos</p>
              </div>
              <div className="bg-secondary rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Estado do dispositivo</p>
                <p className="font-bold">Ativo</p>
              </div>
            </div>

            <button
              onClick={onDone}
              disabled={progress < 100}
              className="mt-6 w-full bg-brand-green hover:bg-brand-green-strong disabled:opacity-50 disabled:cursor-not-allowed transition text-white font-bold py-4 rounded-xl"
            >
              Aceder ao Relatório
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ConversationCard({ id, label, alert, time }: { id: string; label: string; alert: string; time: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-secondary/60 hover:bg-secondary transition text-left"
      >
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground text-sm">
          {id}
        </div>
        <div className="flex-1">
          <p className="font-bold">{label}</p>
          <p className="text-sm text-brand-red">⚠ {alert}</p>
        </div>
        <span className="text-xs text-muted-foreground">{time}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md bg-white rounded-2xl p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <p className="font-bold">{label}</p>
              <button onClick={() => setOpen(false)} className="text-muted-foreground">✕</button>
            </div>
            <div className="mt-4 space-y-2 max-h-72 overflow-auto">
              <div className="bg-secondary rounded-lg p-2 max-w-[75%] text-sm">
                Olá, tudo bem?<div className="text-[10px] text-muted-foreground text-right">14:22</div>
              </div>
              <div className="bg-brand-green/15 rounded-lg p-2 max-w-[75%] text-sm ml-auto">
                Tudo sim e tu?<div className="text-[10px] text-muted-foreground text-right">14:23</div>
              </div>
              <div className="bg-secondary rounded-lg p-2 max-w-[75%] text-sm italic text-muted-foreground">
                🔒 Conteúdo bloqueado<div className="text-[10px] text-right">14:25</div>
              </div>
              <div className="bg-brand-green/15 rounded-lg p-2 max-w-[75%] text-sm ml-auto italic text-muted-foreground">
                🔒 Conteúdo bloqueado<div className="text-[10px] text-right">14:26</div>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Para visualizar a conversa completa, precisa desbloquear as conversas.
            </p>
            <button className="mt-3 w-full bg-brand-green hover:bg-brand-green-strong transition text-white font-bold py-3 rounded-xl">
              🔓 DESBLOQUEAR CONVERSAS COMPLETAS
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function CheckoutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<"pix" | "card">("pix");
  const [copied, setCopied] = useState(false);
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvc: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");

  const [pixCode, setPixCode] = useState("");
  const [pixQr, setPixQr] = useState("");
  const [pixLoading, setPixLoading] = useState(false);
  const [pixError, setPixError] = useState("");

  useEffect(() => {
    if (!open || tab !== "pix" || pixCode || pixLoading) return;
    setPixLoading(true);
    setPixError("");
    gerarPixAnubis()
      .then((d) => {
        setPixCode(d.copyAndPaste);
        setPixQr(d.qrCodeBase64);
      })
      .catch(() => setPixError("Erro ao gerar Pix. Tente novamente."))
      .finally(() => setPixLoading(false));
  }, [open, tab, pixCode, pixLoading]);


  if (!open) return null;

  const formatCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  const formatExp = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const validateCard = () => {
    const e: Record<string, string> = {};
    const num = card.number.replace(/\s/g, "");
    if (num.length < 13) e.number = "Número de cartão inválido.";
    if (card.name.trim().length < 3) e.name = "Informe o nome do titular.";
    if (!/^\d{2}\/\d{2}$/.test(card.exp)) e.exp = "Validade inválida (MM/AA).";
    if (!/^\d{3,4}$/.test(card.cvc)) e.cvc = "CVC inválido.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = (method: "pix" | "card") => {
    if (method === "card" && !validateCard()) return;
    setStatus("processing");
    setTimeout(() => setStatus("success"), 2000);
  };

  const copyPix = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { }
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl max-h-[95vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-border px-5 py-4 flex justify-between items-center">
          <div>
            <p className="text-xs text-muted-foreground">Total a pagar</p>
            <p className="font-extrabold text-lg">R$ 20,99</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="h-9 w-9 rounded-full bg-secondary hover:bg-muted transition flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {status === "success" ? (
          <div className="p-8 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-brand-green/15 text-brand-green-strong text-3xl flex items-center justify-center">
              ✓
            </div>
            <h3 className="mt-4 text-xl font-extrabold">Pagamento confirmado!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              O acesso completo ao relatório foi liberado.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full bg-brand-green hover:bg-brand-green-strong transition text-white font-bold py-3 rounded-xl"
            >
              Aceder ao Relatório Completo
            </button>
          </div>
        ) : (
          <>
            <div className="px-5 pt-4">
              <div className="grid grid-cols-2 gap-2 bg-secondary p-1 rounded-xl">
                <button
                  onClick={() => setTab("pix")}
                  className={`py-2 rounded-lg font-semibold text-sm transition ${tab === "pix" ? "bg-white shadow text-foreground" : "text-muted-foreground"
                    }`}
                >
                  Pix
                </button>
                <button
                  onClick={() => setTab("card")}
                  className={`py-2 rounded-lg font-semibold text-sm transition ${tab === "card" ? "bg-white shadow text-foreground" : "text-muted-foreground"
                    }`}
                >
                  Cartão
                </button>
              </div>
            </div>

            {tab === "pix" ? (
              <div className="p-5 space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  {pixLoading
                    ? "A gerar Pix..."
                    : pixError
                    ? pixError
                    : "Escaneie o QR Code abaixo ou copie o código Pix."}
                </p>
                <div className="mx-auto w-48 h-48 bg-white border-2 border-foreground rounded-xl p-2 flex items-center justify-center overflow-hidden">
                  {pixQr ? (
                    <img
                      src={pixQr.startsWith("data:") ? pixQr : `data:image/png;base64,${pixQr}`}
                      alt="QR Code Pix"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="grid grid-cols-12 gap-[2px] w-full h-full opacity-40">
                      {Array.from({ length: 144 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-[1px] ${
                            (i * 7 + (i % 5) * 11) % 3 === 0 ? "bg-foreground" : "bg-transparent"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-secondary rounded-xl p-3">
                  <p className="text-[11px] text-muted-foreground mb-1">Pix Copia e Cola</p>
                  <p className="text-xs break-all font-mono leading-relaxed min-h-[2rem]">
                    {pixCode || (pixLoading ? "Gerando código..." : "—")}
                  </p>
                </div>
                <button
                  onClick={copyPix}
                  disabled={!pixCode}
                  className="w-full bg-foreground hover:bg-foreground/90 disabled:opacity-50 transition text-white font-bold py-3 rounded-xl"
                >
                  {copied ? "✓ Código copiado" : "Copiar código Pix"}
                </button>

                <button
                  onClick={() => handlePay("pix")}
                  disabled={status === "processing"}
                  className="w-full bg-brand-green hover:bg-brand-green-strong disabled:opacity-60 transition text-white font-bold py-3 rounded-xl"
                >
                  {status === "processing" ? "A confirmar pagamento..." : "Já paguei"}
                </button>
                <p className="text-[11px] text-center text-muted-foreground">
                  Pagamento processado de forma segura. Confirmação em segundos.
                </p>
              </div>
            ) : (
              <form
                className="p-5 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  handlePay("card");
                }}
                noValidate
              >
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Número do cartão</label>
                  <input
                    inputMode="numeric"
                    value={card.number}
                    onChange={(e) => setCard({ ...card, number: formatCard(e.target.value) })}
                    placeholder="0000 0000 0000 0000"
                    className={`w-full mt-1 px-4 py-3 rounded-xl border-2 outline-none transition ${errors.number ? "border-destructive" : "border-border focus:border-brand-green"
                      }`}
                  />
                  {errors.number && <p className="text-xs text-destructive mt-1">{errors.number}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Nome do titular</label>
                  <input
                    value={card.name}
                    onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })}
                    placeholder="NOME COMO NO CARTÃO"
                    className={`w-full mt-1 px-4 py-3 rounded-xl border-2 outline-none transition ${errors.name ? "border-destructive" : "border-border focus:border-brand-green"
                      }`}
                  />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Validade</label>
                    <input
                      inputMode="numeric"
                      value={card.exp}
                      onChange={(e) => setCard({ ...card, exp: formatExp(e.target.value) })}
                      placeholder="MM/AA"
                      className={`w-full mt-1 px-4 py-3 rounded-xl border-2 outline-none transition ${errors.exp ? "border-destructive" : "border-border focus:border-brand-green"
                        }`}
                    />
                    {errors.exp && <p className="text-xs text-destructive mt-1">{errors.exp}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">CVC</label>
                    <input
                      inputMode="numeric"
                      value={card.cvc}
                      onChange={(e) =>
                        setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })
                      }
                      placeholder="123"
                      className={`w-full mt-1 px-4 py-3 rounded-xl border-2 outline-none transition ${errors.cvc ? "border-destructive" : "border-border focus:border-brand-green"
                        }`}
                    />
                    {errors.cvc && <p className="text-xs text-destructive mt-1">{errors.cvc}</p>}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={status === "processing"}
                  className="w-full bg-brand-green hover:bg-brand-green-strong disabled:opacity-60 transition text-white font-bold py-3 rounded-xl mt-2"
                >
                  {status === "processing" ? "A processar pagamento..." : "Pagar R$ 20,99"}
                </button>
                <p className="text-[11px] text-center text-muted-foreground">
                  🔒 Conexão segura e criptografada.
                </p>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ReportStep() {
  const ctaRef = useRef<HTMLDivElement>(null);
  const [checkout, setCheckout] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-secondary/40">
      <div className="bg-brand-green text-white text-center py-10 px-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold">Relatório de Acesso ao WhatsApp</h1>
        <p className="mt-2 text-sm text-white/90">
          Confira abaixo os principais dados recuperados da análise do número informado.
        </p>
      </div>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 space-y-6 pb-32">
        {/* Análise de conversas */}
        <section className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          <h2 className="text-xl font-bold text-brand-green-strong">💬 Análise de Conversas</h2>
          <p className="mt-3 text-sm leading-relaxed">
            <span className="text-brand-red font-semibold">148 conversas suspeitas</span> foram encontradas
            durante a análise. O sistema conseguiu recuperar{" "}
            <span className="text-brand-green-strong font-semibold">mensagens apagadas</span> e algumas foram
            classificadas como <span className="text-brand-red font-semibold">críticas</span> com base no conteúdo.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">Toque numa conversa abaixo para visualizar os detalhes.</p>
          <div className="mt-4 space-y-2">
            <ConversationCard id="392" label="+351 9XXXX-392" alert="Mensagem apagada recuperada" time="Ontem" />
            <ConversationCard id="781" label="+351 9XXXX-781" alert="Áudio suspeito detetado" time="3 dias" />
            <ConversationCard id="032" label="+351 9XXXX-032" alert="Fotos suspeitas encontradas" time="1 semana" />
          </div>
        </section>

        {/* Mídia recuperada */}
        <section className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          <h2 className="text-xl font-bold text-brand-green-strong">📷 Mídia Recuperada</h2>
          <p className="mt-3 text-sm leading-relaxed">
            <span className="text-brand-red font-semibold">3 áudios comprometedores</span> foram recuperados
            durante a análise. Além disso, o sistema encontrou{" "}
            <span className="text-brand-red font-semibold">267 fotos apagadas</span> que podem conter conteúdo sensível.
          </p>
          <button onClick={() => setCheckout(true)} className="mt-4 w-full bg-brand-green hover:bg-brand-green-strong transition text-white font-bold py-3 rounded-xl">
            🔓 DESBLOQUEAR ÁUDIOS COMPLETOS
          </button>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-secondary flex items-center justify-center text-sm text-muted-foreground">
                🔒 Bloqueado
              </div>
            ))}
          </div>
          <button onClick={() => setCheckout(true)} className="mt-4 w-full bg-brand-green hover:bg-brand-green-strong transition text-white font-bold py-3 rounded-xl">
            🔓 DESBLOQUEAR TODAS AS FOTOS
          </button>
        </section>

        <div ref={ctaRef} />
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-white via-white to-white/0 pt-4 pb-4 px-4">
        <button onClick={() => setCheckout(true)} className="block max-w-3xl mx-auto w-full bg-brand-green hover:bg-brand-green-strong transition text-white font-bold py-4 rounded-xl shadow-lg text-lg">
          🔓 DESBLOQUEAR TUDO POR R$20,99
        </button>
      </div>

      <CheckoutModal open={checkout} onClose={() => setCheckout(false)} />

      <Footer />
    </div>
  );
}

function Index() {
  const [step, setStep] = useState<Step>("intro");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBanner red={step !== "report"} />
      {step === "intro" && <IntroStep onChoose={() => setStep("phone")} />}
      {step === "phone" && <PhoneStep onSubmit={() => setStep("processing")} onBack={() => setStep("intro")} />}
      {step === "processing" && <ProcessingStep onDone={() => setStep("report")} />}
      {step === "report" && <ReportStep />}
    </div>
  );
}
