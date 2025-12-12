'use client';

import { useState, useEffect, useCallback } from 'react';
import { QrCode, Sparkles, X, Download, FileImage, Copy, BarChart3, Settings, ChevronRight } from 'lucide-react';
import QRCodeDisplay, { downloadQRCode } from '@/components/QRCodeDisplay';
import CustomizationPanel from '@/components/CustomizationPanel';
import DashboardModal from '@/components/DashboardModal';
import Toast from '@/components/Toast';
import { QRConfig, TrackingData } from '@/types';
import { createTrackingLink, saveToLocalStorage } from '@/lib/api';

const DEFAULT_CONFIG: QRConfig = {
  width: 250,
  height: 250,
  margin: 10,
  downloadSize: 1000,
  dotStyle: 'rounded',
  cornerStyle: 'extra-rounded',
  dotColor: '#ffffff',
  cornerColor: '#ffffff',
  bgColor: '#00000000', // Transparent by default for glass effect
  errorCorrectionLevel: 'H',
};

export default function Home() {
  const [url, setUrl] = useState('');
  const [config, setConfig] = useState<QRConfig>(DEFAULT_CONFIG);
  const [logo, setLogo] = useState<string | null>(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isCreatingTracking, setIsCreatingTracking] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [dashboardInitialLinkId, setDashboardInitialLinkId] = useState<string | undefined>();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Check for deep link on mount
  useEffect(() => {
    const handleDeepLink = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#stats/')) {
        const linkId = hash.replace('#stats/', '');
        if (linkId) {
          setDashboardInitialLinkId(linkId);
          setShowDashboard(true);
        }
      }
    };

    handleDeepLink();
    window.addEventListener('hashchange', handleDeepLink);
    return () => window.removeEventListener('hashchange', handleDeepLink);
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }, []);

  const handleGenerate = async () => {
    if (!url.trim()) {
      showToast('Por favor, insira uma URL', 'error');
      return;
    }

    let processedUrl = url.trim();
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = 'https://' + processedUrl;
      setUrl(processedUrl);
    }

    setIsGenerated(true);

    if (trackingEnabled) {
      await handleCreateTracking(processedUrl);
    }
  };

  const handleCreateTracking = async (targetUrl: string) => {
    setIsCreatingTracking(true);
    try {
      const data = await createTrackingLink(targetUrl, new URL(targetUrl).hostname);
      setTrackingData(data);
      saveToLocalStorage(data);
      showToast('Link de rastreamento criado!', 'success');
    } catch (error) {
      console.error('Error creating tracking link:', error);
      showToast('Erro ao criar link de rastreamento', 'error');
    } finally {
      setIsCreatingTracking(false);
    }
  };

  const handleTrackingToggle = async () => {
    const newValue = !trackingEnabled;
    setTrackingEnabled(newValue);

    if (newValue && isGenerated && url) {
      await handleCreateTracking(url);
    } else if (!newValue) {
      setTrackingData(null);
    }
  };

  const qrData = trackingData?.trackingUrl || url || 'https://qr-generator.pro';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Modern Glass Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.08] bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg shadow-lg shadow-purple-500/20">
              <QrCode className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              QR Code <span className="text-purple-400">Pro</span>
            </span>
          </div>

          <button
            onClick={() => setShowDashboard(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/70 bg-white/5 border border-white/10 rounded-full transition-all hover:text-white hover:bg-white/10 hover:border-white/20"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 pt-24 pb-10 px-4 md:px-6 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-12 gap-8 h-full min-h-[calc(100vh-8rem)]">

          {/* Left Column: Input & Customization */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-col gap-2 mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Crie seu QR Code <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Personalizado & Rastreável
                </span>
              </h1>
              <p className="text-white/40 text-lg">
                Personalize cores, formas e acompanhe as estatísticas de scan em tempo real.
              </p>
            </div>

            {/* URL Input Card */}
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-1 relative group focus-within:border-purple-500/50 transition-all">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="Cole sua URL aqui (ex: https://site.com)"
                className="w-full px-5 py-4 bg-transparent text-white text-lg placeholder-white/20 outline-none"
              />
              <div className="absolute right-2 top-2 bottom-2 flex items-center gap-2">
                {url && (
                  <button
                    onClick={() => { setUrl(''); setIsGenerated(false); }}
                    className="p-2 text-white/30 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={handleGenerate}
                  className="h-full px-6 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-purple-900/20"
                >
                  Gerar
                </button>
              </div>
            </div>

            {/* Config Panels */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Customization Panel */}
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6 text-white/80 font-medium">
                  <Settings className="w-5 h-5 text-purple-400" />
                  Personalização
                </div>
                <CustomizationPanel
                  config={config}
                  onConfigChange={setConfig}
                  onLogoChange={setLogo}
                  logoPreview={logo}
                />
              </div>

              {/* Tracking Toggle */}
              <div
                className={`border rounded-2xl p-6 transition-all cursor-pointer select-none
                    ${trackingEnabled
                    ? 'bg-purple-900/10 border-purple-500/30'
                    : 'bg-white/[0.02] border-white/[0.05] hover:border-white/10'}`}
                onClick={handleTrackingToggle}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-medium text-white/80">
                    <BarChart3 className={`w-5 h-5 ${trackingEnabled ? 'text-purple-400' : 'text-white/40'}`} />
                    Rastreamento de Scans
                  </div>
                  <div className={`w-11 h-6 rounded-full p-1 transition-colors ${trackingEnabled ? 'bg-purple-500' : 'bg-white/10'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${trackingEnabled ? 'translate-x-[18px]' : ''}`} />
                  </div>
                </div>
                <p className="text-sm text-white/40 pl-7">
                  Monitore scans, localização e dispositivos. Gera um link curto trackeável.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Preview (Sticky) */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-28 flex flex-col gap-6">

              {/* Preview Card */}
              <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.1] rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl overflow-hidden group">
                {/* Glass Reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent pointer-events-none" />

                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/20 blur-[80px] -z-10" />

                <div className="relative z-10 p-4 bg-white/5 border border-white/10 rounded-2xl shadow-2xl">
                  <QRCodeDisplay
                    data={qrData}
                    config={config}
                    logo={logo}
                    isPreview={!url}
                  />
                </div>

                {!url && (
                  <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px] bg-black/40 rounded-3xl z-20">
                    <span className="text-white/50 font-medium flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Digite uma URL para começar
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              {isGenerated && (
                <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <button
                    onClick={() => downloadQRCode(qrData, config, logo, 'png')}
                    className="flex flex-col items-center justify-center gap-2 p-4 bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 rounded-2xl transition-all group"
                  >
                    <div className="p-2 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg group-hover:scale-110 transition-transform">
                      <Download className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white/80">Baixar PNG</span>
                  </button>

                  <button
                    onClick={() => downloadQRCode(qrData, config, logo, 'svg')}
                    className="flex flex-col items-center justify-center gap-2 p-4 bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 rounded-2xl transition-all group"
                  >
                    <div className="p-2 bg-white/10 rounded-lg group-hover:scale-110 transition-transform">
                      <FileImage className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white/80">Baixar SVG</span>
                  </button>

                  {trackingData && (
                    <button
                      onClick={() => {
                        const url = `${window.location.origin}${window.location.pathname}#stats/${trackingData.id}`;
                        navigator.clipboard.writeText(url);
                        showToast('Link do dashboard copiado!', 'success');
                      }}
                      className="col-span-2 flex items-center justify-center gap-2 py-3 px-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 rounded-xl text-sm text-white/50 hover:text-white transition-all"
                    >
                      <Copy className="w-4 h-4" />
                      Copiar Link do Dashboard
                    </button>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>
      </main>

      <DashboardModal
        isOpen={showDashboard}
        onClose={() => {
          setShowDashboard(false);
          setDashboardInitialLinkId(undefined);
        }}
        initialLinkId={dashboardInitialLinkId}
        onShowToast={showToast}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
