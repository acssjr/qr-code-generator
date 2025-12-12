'use client';

import { useEffect, useState } from 'react';
import { X, ArrowLeft, BarChart3, Eye, Copy, Smartphone, Monitor, Tablet } from 'lucide-react';
import { getLinks, getLinkStats } from '@/lib/api';
import { Link, LinkStats } from '@/types';

interface DashboardModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialLinkId?: string;
    onShowToast: (message: string, type: 'success' | 'error') => void;
}

export default function DashboardModal({ isOpen, onClose, initialLinkId, onShowToast }: DashboardModalProps) {
    const [links, setLinks] = useState<Link[]>([]);
    const [selectedLink, setSelectedLink] = useState<Link | null>(null);
    const [stats, setStats] = useState<LinkStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<'list' | 'detail'>('list');

    useEffect(() => {
        if (isOpen) {
            if (initialLinkId) {
                loadStats(initialLinkId);
            } else {
                loadLinks();
            }
        }
    }, [isOpen, initialLinkId]);

    const loadLinks = async () => {
        setIsLoading(true);
        setView('list');
        try {
            const data = await getLinks();
            setLinks(data);
        } catch (error) {
            console.error('Error loading links:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadStats = async (linkId: string) => {
        setIsLoading(true);
        setView('detail');
        try {
            const data = await getLinkStats(linkId);
            setSelectedLink(data.link);
            setStats(data.stats);

            // Update URL for bookmarking
            window.history.pushState(null, '', `#stats/${linkId}`);
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        setView('list');
        setSelectedLink(null);
        setStats(null);
        window.history.pushState('', document.title, window.location.pathname);
        loadLinks();
    };

    const handleClose = () => {
        window.history.pushState('', document.title, window.location.pathname);
        onClose();
    };

    const copyStatsUrl = () => {
        if (selectedLink) {
            const url = `${window.location.origin}${window.location.pathname}#stats/${selectedLink.short_code}`;
            navigator.clipboard.writeText(url);
            onShowToast('Link copiado! Salve para acessar as estatísticas depois.', 'success');
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('pt-BR');
    };

    const formatDateTime = (dateStr: string | null) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getCountryFlag = (countryCode: string) => {
        if (!countryCode || countryCode === 'unknown') return '🌍';
        try {
            const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0));
            return String.fromCodePoint(...codePoints);
        } catch {
            return '🌍';
        }
    };

    const getDeviceIcon = (deviceType: string) => {
        switch (deviceType) {
            case 'mobile': return <Smartphone className="w-4 h-4" />;
            case 'tablet': return <Tablet className="w-4 h-4" />;
            default: return <Monitor className="w-4 h-4" />;
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
            <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                    <h2 className="flex items-center gap-3 text-xl font-semibold text-white">
                        <BarChart3 className="w-6 h-6 text-purple-400" />
                        Dashboard de Estatísticas
                    </h2>
                    <button
                        onClick={handleClose}
                        className="w-9 h-9 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="loading-spinner" />
                    ) : view === 'list' ? (
                        /* List View */
                        <div className="space-y-4">
                            {links.length === 0 ? (
                                <div className="text-center py-12 text-white/40">
                                    <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                    <p className="text-base mb-2">Nenhum QR Code rastreado ainda</p>
                                    <span className="text-sm">Ative o rastreamento ao gerar um QR Code</span>
                                </div>
                            ) : (
                                links.map((link) => (
                                    <div
                                        key={link.id}
                                        onClick={() => loadStats(link.id)}
                                        className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/[0.08] rounded-lg cursor-pointer transition-all hover:border-purple-500 hover:bg-white/[0.06]"
                                    >
                                        <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg shrink-0">
                                            <BarChart3 className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-semibold text-white truncate">
                                                {link.title || 'Sem título'}
                                            </div>
                                            <div className="text-xs text-white/40 truncate">{link.original_url}</div>
                                        </div>
                                        <div className="flex items-center gap-4 shrink-0">
                                            <div className="flex items-center gap-1 px-3 py-1 bg-purple-500/10 rounded-full text-xs font-semibold text-purple-400">
                                                <Eye className="w-3.5 h-3.5" />
                                                {link.total_clicks || 0} scans
                                            </div>
                                            <div className="text-xs text-white/40">{formatDate(link.created_at)}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        /* Detail View */
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-purple-400 transition-colors mb-4"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Voltar para lista
                            </button>

                            {selectedLink && stats && (
                                <>
                                    {/* Header */}
                                    <div className="mb-6 pb-4 border-b border-white/10">
                                        <h3 className="text-lg font-semibold text-white mb-1">
                                            {selectedLink.title || 'Sem título'}
                                        </h3>
                                        <p className="text-sm text-white/40">
                                            Destino: <a href={selectedLink.original_url} target="_blank" className="text-purple-400 hover:underline">{selectedLink.original_url}</a>
                                        </p>
                                        <p className="text-sm text-white/40">
                                            Tracking: <a href={selectedLink.trackingUrl} target="_blank" className="text-purple-400 hover:underline">{selectedLink.trackingUrl}</a>
                                        </p>
                                        <button
                                            onClick={copyStatsUrl}
                                            className="mt-3 flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white/70 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                                        >
                                            <Copy className="w-3.5 h-3.5" />
                                            Copiar Link do Dashboard
                                        </button>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        <div className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-lg text-center">
                                            <div className="text-3xl font-bold text-purple-400">{stats.totalClicks}</div>
                                            <div className="text-xs text-white/40 uppercase tracking-wider">Total de Scans</div>
                                        </div>
                                        <div className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-lg text-center">
                                            <div className="text-3xl font-bold text-purple-400">{stats.uniqueScans || 0}</div>
                                            <div className="text-xs text-white/40 uppercase tracking-wider">Visitantes Únicos</div>
                                        </div>
                                        <div className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-lg text-center">
                                            <div className="text-3xl font-bold text-purple-400">{stats.todayScans || 0}</div>
                                            <div className="text-xs text-white/40 uppercase tracking-wider">
                                                Hoje {stats.todayScans > stats.yesterdayScans ? '📈' : stats.todayScans < stats.yesterdayScans ? '📉' : '➡️'}
                                            </div>
                                        </div>
                                        <div className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-lg text-center">
                                            <div className="text-3xl font-bold text-purple-400">{stats.clicksByCountry?.length || 0}</div>
                                            <div className="text-xs text-white/40 uppercase tracking-wider">Países</div>
                                        </div>
                                    </div>

                                    {/* First/Last Scan */}
                                    {stats.firstScan && (
                                        <div className="flex gap-6 text-xs text-white/40 mb-6">
                                            <span>📅 Primeiro scan: {formatDateTime(stats.firstScan)}</span>
                                            <span>🕐 Último scan: {formatDateTime(stats.lastScan)}</span>
                                        </div>
                                    )}

                                    {/* Charts */}
                                    {stats.clicksByDay?.length > 0 && (
                                        <div className="mb-6">
                                            <h4 className="text-sm font-semibold text-white/70 mb-3">📊 Scans por Dia</h4>
                                            <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-4 min-h-[200px]">
                                                <div className="flex items-end justify-around h-[150px] gap-2">
                                                    {stats.clicksByDay.slice(0, 7).reverse().map((day, i) => {
                                                        const maxCount = Math.max(...stats.clicksByDay.slice(0, 7).map(d => d.count), 1);
                                                        const height = (day.count / maxCount) * 100;
                                                        return (
                                                            <div
                                                                key={i}
                                                                className="chart-bar relative"
                                                                style={{ height: `${Math.max(height, 3)}%` }}
                                                                title={`${day.count} scans`}
                                                            >
                                                                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-white/40 whitespace-nowrap">
                                                                    {new Date(day.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Countries & Cities */}
                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        {stats.clicksByCountry?.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-white/70 mb-3">🌍 Por País</h4>
                                                <div className="space-y-2">
                                                    {stats.clicksByCountry.map((item, i) => (
                                                        <div key={i} className="flex items-center justify-between p-3 bg-white/[0.03] rounded-md">
                                                            <span className="text-sm text-white/70">{getCountryFlag(item.country)} {item.country}</span>
                                                            <span className="text-sm font-semibold text-purple-400">{item.count} scans</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {stats.clicksByDevice?.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-white/70 mb-3">📱 Por Dispositivo</h4>
                                                <div className="space-y-2">
                                                    {stats.clicksByDevice.map((item, i) => (
                                                        <div key={i} className="flex items-center justify-between p-3 bg-white/[0.03] rounded-md">
                                                            <span className="flex items-center gap-2 text-sm text-white/70">
                                                                {getDeviceIcon(item.device_type)} {item.device_type}
                                                            </span>
                                                            <span className="text-sm font-semibold text-purple-400">{item.count} scans</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Recent Clicks */}
                                    {stats.recentClicks?.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-white/70 mb-3">🕐 Últimos Scans</h4>
                                            <div className="max-h-[300px] overflow-y-auto space-y-2">
                                                {stats.recentClicks.map((click, i) => (
                                                    <div key={i} className="flex items-center justify-between p-3 border-b border-white/[0.08] last:border-0">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg text-white/40">
                                                                {getDeviceIcon(click.device_type)}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm text-white/70 font-medium">
                                                                    {click.country}{click.city && click.city !== 'unknown' ? `, ${click.city}` : ''}
                                                                </div>
                                                                <div className="text-xs text-white/40">{click.browser} • {click.os}</div>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs text-white/40">{formatDateTime(click.clicked_at)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {stats.totalClicks === 0 && (
                                        <div className="text-center py-12 text-white/40">
                                            <p>Nenhum scan registrado ainda</p>
                                            <span className="text-sm">Escaneie o QR Code para ver as estatísticas</span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
