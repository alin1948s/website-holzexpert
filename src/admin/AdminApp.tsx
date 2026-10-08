import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  LockKeyhole,
  LogOut,
  Mail,
  PackageCheck,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Trees,
  X,
} from 'lucide-react';
import type { RfqFormData } from '../types';
import { getAdminToken, holzApiUrl, setAdminToken } from '../lib/holzApi';
import './admin.css';

type OrderStatus = 'noua' | 'in_lucru' | 'ofertata' | 'castigata' | 'inchisa';
type StatusFilter = 'toate' | OrderStatus;

interface RfqOrder extends RfqFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  adminNotes: string;
}

interface ApiResult<T = unknown> {
  status: 'success' | 'error';
  message?: string;
  token?: string;
  authenticated?: boolean;
  setupRequired?: boolean;
  orders?: T;
  order?: T;
}

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'noua', label: 'Nouă' },
  { value: 'in_lucru', label: 'În lucru' },
  { value: 'ofertata', label: 'Ofertată' },
  { value: 'castigata', label: 'Câștigată' },
  { value: 'inchisa', label: 'Închisă' },
];

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'toate', label: 'Toate cererile' },
  ...STATUS_OPTIONS,
];

async function request<T>(url: string, options?: RequestInit): Promise<ApiResult<T>> {
  const token = getAdminToken();
  const response = await fetch(holzApiUrl(url), {
    cache: 'no-store',
    ...options,
    headers: {
      ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  let result: ApiResult<T>;
  try {
    result = await response.json() as ApiResult<T>;
  } catch {
    throw new Error('API-ul Holz Expert nu a răspuns cu date valide.');
  }
  if (!response.ok || result.status !== 'success') {
    if (response.status === 401) setAdminToken('');
    throw new Error(result.message || 'Solicitarea nu a putut fi finalizată.');
  }
  return result;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('ro-RO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function statusLabel(status: OrderStatus): string {
  return STATUS_OPTIONS.find((option) => option.value === status)?.label ?? 'Nouă';
}

function gradeLabel(grade: RfqFormData['grade']): string {
  return grade.replace('EN1611_CLASS_', 'Clasa ');
}

function normalizeSearch(value: string): string {
  return value.toLocaleLowerCase('ro').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function csvCell(value: unknown): string {
  let text = String(value ?? '');
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function AdminApp() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [configured, setConfigured] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [orders, setOrders] = useState<RfqOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<StatusFilter>('toate');
  const [selectedOrder, setSelectedOrder] = useState<RfqOrder | null>(null);
  const [editStatus, setEditStatus] = useState<OrderStatus>('noua');
  const [editNotes, setEditNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState('');

  const refreshOrders = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const result = await request<RfqOrder[]>('orders');
      setOrders(Array.isArray(result.orders) ? result.orders : []);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Nu am putut încărca cererile.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const noSession: ApiResult = { status: 'error', authenticated: false };
    const sessionRequest: Promise<ApiResult> = getAdminToken()
      ? request('auth/me').catch(() => noSession)
      : Promise.resolve(noSession);
    Promise.all([
      request('auth/status'),
      sessionRequest,
    ])
      .then(([status, session]) => {
        if (!active) return;
        setConfigured(!status.setupRequired);
        setAuthenticated(session.status === 'success' && Boolean(session.authenticated));
      })
      .catch((error: unknown) => {
        if (!active) return;
        setLoginError(error instanceof Error ? error.message : 'Serviciul de administrare nu este disponibil.');
      })
      .finally(() => {
        if (active) setCheckingSession(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (authenticated) void refreshOrders();
  }, [authenticated, refreshOrders]);

  useEffect(() => {
    if (!selectedOrder) return;
    setEditStatus(selectedOrder.status);
    setEditNotes(selectedOrder.adminNotes || '');
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedOrder(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [selectedOrder]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const filteredOrders = useMemo(() => {
    const query = normalizeSearch(search.trim());
    return orders.filter((order) => {
      if (filter !== 'toate' && order.status !== filter) return false;
      if (!query) return true;
      const haystack = normalizeSearch([
        order.id,
        order.companyName,
        order.contactPerson,
        order.email,
        order.phoneCountryCode,
        order.phoneNumber,
        order.country,
        order.destinationPort,
        order.grade,
      ].join(' '));
      return haystack.includes(query);
    });
  }, [filter, orders, search]);

  const counts = useMemo(() => ({
    total: orders.length,
    new: orders.filter((order) => order.status === 'noua').length,
    active: orders.filter((order) => ['in_lucru', 'ofertata'].includes(order.status)).length,
  }), [orders]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const result = await request('auth/login', {
        method: 'POST',
        body: JSON.stringify({ password }),
      });
      if (!result.token) throw new Error('Autentificarea nu a returnat o sesiune validă.');
      setAdminToken(result.token);
      setPassword('');
      setAuthenticated(true);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Autentificarea nu a reușit.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    setAdminToken('');
    setAuthenticated(false);
    setOrders([]);
  };

  const saveOrder = async () => {
    if (!selectedOrder) return;
    setIsSaving(true);
    try {
      const result = await request<RfqOrder>(`orders/${encodeURIComponent(selectedOrder.id)}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: editStatus,
          adminNotes: editNotes,
        }),
      });
      const updatedOrder = result.order;
      if (updatedOrder) {
        setOrders((current) => current.map((order) => order.id === updatedOrder.id ? updatedOrder : order));
      }
      setSelectedOrder(null);
      setNotice('Modificările au fost salvate.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Nu am putut salva modificările.');
    } finally {
      setIsSaving(false);
    }
  };

  const exportCsv = () => {
    const rows = [
      ['Cod', 'Data', 'Status', 'Companie', 'Persoană contact', 'Email', 'Telefon', 'Țară', 'Port', 'Volum m³', 'Container(e)', 'Clasă', 'Incoterm'],
      ...filteredOrders.map((order) => [
        order.id,
        formatDate(order.createdAt),
        statusLabel(order.status),
        order.companyName,
        order.contactPerson,
        order.email,
        `${order.phoneCountryCode} ${order.phoneNumber}`,
        order.country,
        order.destinationPort,
        order.approxVolumeM3,
        order.volumeContainers,
        gradeLabel(order.grade),
        order.incoterm,
      ]),
    ];
    const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `holzexpert-cereri-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (checkingSession) {
    return <main className="ha-page"><div className="ha-loading"><RefreshCw className="ha-spin" /> Se verifică accesul…</div></main>;
  }

  if (!authenticated) {
    return (
      <main className="ha-login-page">
        <section className="ha-login-card" aria-labelledby="ha-login-title">
          <a className="ha-login-brand" href={import.meta.env.BASE_URL} aria-label="Înapoi la Holz Expert">
            <span className="ha-brand-mark">H</span>
            <span><strong>HOLZ EXPERT</strong><small>INDUSTRY S.R.L.</small></span>
          </a>
          <span className="ha-eyebrow"><LockKeyhole size={14} /> ACCES INTERN</span>
          <h1 id="ha-login-title">Administrare cereri</h1>
          <p className="ha-login-copy">Autentifică-te pentru a vedea cererile de ofertă primite de la clienți.</p>
          {!configured ? (
            <div className="ha-alert ha-alert--warning" role="status">
              <ShieldCheck size={18} />
              <span>Panoul nu este configurat încă. Administratorul trebuie să activeze parola și baza de date în Cloudflare Workers.</span>
            </div>
          ) : (
            <form className="ha-login-form" onSubmit={handleLogin}>
              <label htmlFor="ha-password">Parolă de administrator</label>
              <input
                autoComplete="current-password"
                id="ha-password"
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
              {loginError && <p className="ha-alert ha-alert--error" role="alert">{loginError}</p>}
              <button className="ha-button ha-button--primary ha-login-submit" disabled={isLoggingIn} type="submit">
                {isLoggingIn ? 'Se verifică…' : 'Intră în panou'} <ArrowRight size={17} />
              </button>
            </form>
          )}
          {configured && loginError && <p className="ha-login-service-error" role="status">{loginError}</p>}
          <a className="ha-back-link" href={import.meta.env.BASE_URL}> <ArrowLeft size={15} /> Înapoi la site</a>
        </section>
      </main>
    );
  }

  return (
    <main className="ha-page">
      <header className="ha-header">
        <div className="ha-header-inner">
          <a className="ha-login-brand" href={import.meta.env.BASE_URL} aria-label="Holz Expert, pagina principală">
            <span className="ha-brand-mark">H</span>
            <span><strong>HOLZ EXPERT</strong><small>INDUSTRY S.R.L.</small></span>
          </a>
          <div className="ha-header-actions">
            <span className="ha-secure-label"><ShieldCheck size={15} /> Panou securizat</span>
            <a className="ha-button ha-button--quiet ha-site-link" href={import.meta.env.BASE_URL}>Vezi site-ul <ArrowRight size={15} /></a>
            <button className="ha-button ha-button--quiet ha-logout" onClick={() => void handleLogout()} type="button"><LogOut size={16} /> <span>Ieșire</span></button>
          </div>
        </div>
      </header>

      <div className="ha-content">
        <section className="ha-page-heading">
          <div>
            <span className="ha-eyebrow"><Trees size={15} /> COMERCIAL · EXPORT</span>
            <h1>Cereri de ofertă</h1>
            <p>Centralizează și urmărește solicitările trimise prin formularul Holz Expert.</p>
          </div>
          <div className="ha-toolbar-actions">
            <button className="ha-button ha-button--quiet" disabled={isLoading} onClick={() => void refreshOrders()} type="button">
              <RefreshCw className={isLoading ? 'ha-spin' : ''} size={16} /> <span>Reîmprospătează</span>
            </button>
            <button className="ha-button ha-button--primary" disabled={!filteredOrders.length} onClick={exportCsv} type="button">
              <ArrowDownToLine size={16} /> <span>Exportă CSV</span>
            </button>
          </div>
        </section>

        <section className="ha-stats" aria-label="Sumar cereri">
          <article className="ha-stat-card"><span>Total cereri</span><strong>{counts.total}</strong><small>Toate solicitările primite</small></article>
          <article className="ha-stat-card ha-stat-card--new"><span>De contactat</span><strong>{counts.new}</strong><small>Cereri noi, în așteptare</small></article>
          <article className="ha-stat-card ha-stat-card--active"><span>În lucru</span><strong>{counts.active}</strong><small>Ofertare sau discuție activă</small></article>
        </section>

        <section className="ha-orders-panel" aria-labelledby="ha-orders-title">
          <div className="ha-panel-heading">
            <div><h2 id="ha-orders-title">Solicitări recente</h2><p>{filteredOrders.length} {filteredOrders.length === 1 ? 'cerere afișată' : 'cereri afișate'}</p></div>
            <label className="ha-search">
              <Search aria-hidden="true" size={17} />
              <span className="ha-visually-hidden">Caută cereri</span>
              <input onChange={(event) => setSearch(event.target.value)} placeholder="Caută client, cod, port…" type="search" value={search} />
              {search && <button aria-label="Șterge căutarea" onClick={() => setSearch('')} type="button"><X size={15} /></button>}
            </label>
          </div>

          <div aria-label="Filtrează cererile după status" className="ha-filters" role="group">
            {FILTERS.map((item) => (
              <button aria-pressed={filter === item.value} className={filter === item.value ? 'is-active' : ''} key={item.value} onClick={() => setFilter(item.value)} type="button">
                {item.label}
                <span>{item.value === 'toate' ? orders.length : orders.filter((order) => order.status === item.value).length}</span>
              </button>
            ))}
          </div>
          <label className="ha-mobile-filter">
            <span className="ha-visually-hidden">Filtrează cererile după status</span>
            <select onChange={(event) => setFilter(event.target.value as StatusFilter)} value={filter}>
              {FILTERS.map((item) => {
                const count = item.value === 'toate' ? orders.length : orders.filter((order) => order.status === item.value).length;
                return <option key={item.value} value={item.value}>{item.label} · {count}</option>;
              })}
            </select>
          </label>

          {loadError && <div className="ha-alert ha-alert--error ha-load-error" role="alert">{loadError}</div>}
          {isLoading && !orders.length ? (
            <div className="ha-empty-state"><RefreshCw className="ha-spin" size={22} /><p>Se încarcă cererile…</p></div>
          ) : filteredOrders.length ? (
            <div className="ha-order-list">
              {filteredOrders.map((order) => (
                <article className="ha-order-card" key={order.id}>
                  <div className="ha-order-main">
                    <div className="ha-order-title-line">
                      <span className="ha-order-ref">{order.id}</span>
                      <span className={`ha-status ha-status--${order.status}`}><i />{statusLabel(order.status)}</span>
                    </div>
                    <h3>{order.companyName}</h3>
                    <p className="ha-order-contact">{order.contactPerson} <span>·</span> {formatDate(order.createdAt)}</p>
                    <div className="ha-order-facts">
                      <span><PackageCheck size={15} /> {order.approxVolumeM3} m³ · {order.volumeContainers} {order.transportType === 'container_40hc' ? 'containere' : 'camioane'}</span>
                      <span><FileText size={15} /> {gradeLabel(order.grade)} · {order.thickness}×{order.width} mm</span>
                      <span className="ha-order-port">{order.destinationPort}, {order.country}</span>
                    </div>
                  </div>
                  <div className="ha-order-actions">
                    <a aria-label={`Sună la ${order.companyName}`} className="ha-icon-button" href={`tel:${`${order.phoneCountryCode}${order.phoneNumber}`.replace(/[^+\d]/g, '')}`} title="Sună clientul"><Phone size={17} /></a>
                    <a aria-label={`Scrie un email către ${order.companyName}`} className="ha-icon-button" href={`mailto:${order.email}?subject=${encodeURIComponent(`Holz Expert · ${order.id}`)}`} title="Trimite email"><Mail size={17} /></a>
                    <button className="ha-button ha-button--details" onClick={() => setSelectedOrder(order)} type="button">Detalii <ArrowRight size={15} /></button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="ha-empty-state">
              <span className="ha-empty-icon"><CheckCircle2 size={23} /></span>
              <h3>{search || filter !== 'toate' ? 'Nicio cerere găsită' : 'Nu există cereri încă'}</h3>
              <p>{search || filter !== 'toate' ? 'Schimbă filtrul sau încearcă un alt termen de căutare.' : 'Cererile trimise din formularul de ofertă vor apărea automat aici.'}</p>
            </div>
          )}
          <div className="ha-panel-footer"><span><ShieldCheck size={14} /> Datele comenzilor sunt accesibile doar după autentificare.</span><span>Actualizat la {new Intl.DateTimeFormat('ro-RO', { timeStyle: 'short' }).format(new Date())}</span></div>
        </section>
        <footer className="ha-footer">© {new Date().getFullYear()} Holz Expert Industry S.R.L. <span>·</span> Administrare solicitări comerciale</footer>
      </div>

      {selectedOrder && (
        <div className="ha-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedOrder(null); }}>
          <section aria-labelledby="ha-dialog-title" aria-modal="true" className="ha-dialog" role="dialog">
            <header className="ha-dialog-header">
              <div><span className="ha-order-ref">{selectedOrder.id}</span><h2 id="ha-dialog-title">Detaliile cererii</h2></div>
              <button aria-label="Închide detaliile" className="ha-icon-button" onClick={() => setSelectedOrder(null)} type="button"><X size={19} /></button>
            </header>
            <div className="ha-dialog-body">
              <div className="ha-detail-client"><span>COMPANIE</span><strong>{selectedOrder.companyName}</strong><small>{selectedOrder.contactPerson} · {formatDate(selectedOrder.createdAt)}</small></div>
              <div className="ha-detail-grid">
                <div><span>Email</span><a href={`mailto:${selectedOrder.email}`}>{selectedOrder.email}</a></div>
                <div><span>Telefon</span><a href={`tel:${`${selectedOrder.phoneCountryCode}${selectedOrder.phoneNumber}`.replace(/[^+\d]/g, '')}`}>{selectedOrder.phoneCountryCode} {selectedOrder.phoneNumber}</a></div>
                <div><span>Destinație</span><strong>{selectedOrder.destinationPort}, {selectedOrder.country}</strong></div>
                <div><span>Condiție</span><strong>{selectedOrder.incoterm} · {selectedOrder.deliveryTimeline}</strong></div>
                <div><span>Transport</span><strong>{selectedOrder.volumeContainers} × {selectedOrder.transportType === 'container_40hc' ? '40’ HC' : 'Mega truck'} · {selectedOrder.approxVolumeM3} m³</strong></div>
                <div><span>Specificație</span><strong>{gradeLabel(selectedOrder.grade)} · {selectedOrder.thickness}×{selectedOrder.width} mm · {selectedOrder.length} m</strong></div>
                <div><span>Umiditate</span><strong>{selectedOrder.moisture === 'kd_18' ? 'KD 18%' : 'Tăiat proaspăt'}</strong></div>
                <div><span>Monedă</span><strong>{selectedOrder.currency}</strong></div>
              </div>
              <div className="ha-detail-block"><span>Tratamente solicitate</span><p>{selectedOrder.treatments.length ? selectedOrder.treatments.join(' · ') : 'Fără tratamente specificate'}</p></div>
              {selectedOrder.specialRequirements && <div className="ha-detail-block"><span>Cerințe suplimentare</span><p>{selectedOrder.specialRequirements}</p></div>}
              <div className="ha-edit-fields">
                <label>Status cerere
                  <select onChange={(event) => setEditStatus(event.target.value as OrderStatus)} value={editStatus}>
                    {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </label>
                <label>Notițe interne
                  <textarea onChange={(event) => setEditNotes(event.target.value)} placeholder="Note pentru echipa comercială…" rows={4} value={editNotes} />
                </label>
              </div>
            </div>
            <footer className="ha-dialog-footer">
              <button className="ha-button ha-button--quiet" onClick={() => setSelectedOrder(null)} type="button">Închide</button>
              <button className="ha-button ha-button--primary" disabled={isSaving} onClick={() => void saveOrder()} type="button"><Check size={16} /> {isSaving ? 'Se salvează…' : 'Salvează modificările'}</button>
            </footer>
          </section>
        </div>
      )}
      {notice && <div className="ha-toast" role="status">{notice}</div>}
    </main>
  );
}

export default AdminApp;
