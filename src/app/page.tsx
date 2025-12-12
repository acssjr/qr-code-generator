'use client';

import { useState, useEffect, useCallback } from 'react';
import { QrCode, Sparkles, X, Download, FileImage, Copy, BarChart3 } from 'lucide-react';
import QRCodeDisplay, { downloadQRCode } from '@/components/QRCodeDisplay';
import CustomizationPanel from '@/components/CustomizationPanel';
import DashboardModal from '@/components/DashboardModal';
import Toast from '@/components/Toast';
import { QRConfig, TrackingData } from '@/types';
import { createTrackingLink, saveToLocalStorage } from '@/lib/api';

const DEFAULT_CONFIG: QRConfig = {
  width: 200,
  height: 200,
  margin: 10,
  downloadSize: 400,
  dotStyle: 'rounded',
  cornerStyle: 'extra-rounded',
  dotColor: '#000000',
  cornerColor: '#000000',
  bgColor: '#ffffff',
  errorCorrectionLevel: 'M',
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
    const hash = window.location.hash;
    if (hash && hash.startsWith('#stats/')) {
      const linkId = hash.replace('#stats/', '');
      if (linkId) {
        setDashboardInitialLinkId(linkId);
        setShowDashboard(true);
      }
    }

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#stats/')) {
        const linkId = hash.replace('#stats/', '');
        if (linkId) {
          setDashboardInitialLinkId(linkId);
          setShowDashboard(true);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }, []);

  const isValidUrl = (string: string) => {
    try {
      const urlObj = new URL(string);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

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

    if (!isValidUrl(processedUrl)) {
      showToast('URL inválida', 'error');
      return;
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

  const handleClear = () => {
    setUrl('');
    setIsGenerated(false);
    setTrackingData(null);
    setTrackingEnabled(false);
  };

  const handleCopyUrl = async () => {
    const urlToCopy = trackingData?.trackingUrl || url;
    await navigator.clipboard.writeText(urlToCopy);
    showToast('Link copiado!', 'success');
  };

  const handleDownloadPNG = async () => {
    const dataUrl = trackingData?.trackingUrl || url;
    await downloadQRCode(dataUrl, config, logo, 'png');
    showToast('PNG baixado com sucesso!', 'success');
  };

  const handleDownloadSVG = async () => {
    const dataUrl = trackingData?.trackingUrl || url;
    await downloadQRCode(dataUrl, config, logo, 'svg');
    showToast('SVG baixado com sucesso!', 'success');
  };

  const handleViewStats = () => {
    if (trackingData) {
      setDashboardInitialLinkId(trackingData.id);
      setShowDashboard(true);
    }
  };

  const qrData = trackingData?.trackingUrl || url || 'https://preview.qr';

  return (
    <div className="flex flex-col items-center px-4 py-8 md:py-20">
      {/* Header */}
      <header className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-400 rounded-xl shadow-lg shadow-purple-500/20">
            <QrCode className="w-8 h-8 text-white" />
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            QR Code <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Pro</span>
          </h1>
        </div>
        <p className="text-white/50 text-base md:text-lg max-w-md mx-auto">
          Transforme links em QR Codes personalizados e rastreáveis em segundos
        </p>
      </header>

      {/* Main Card */}
      <div className="w-full max-w-lg">
        <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 md:p-8 shadow-xl">
          {/* URL Input */}
          <div className="relative mb-6">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="Cole sua URL aqui..."
              className="w-full px-4 py-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-base placeholder-white/30 outline-none transition-all focus:border-purple-500 focus:bg-white/[0.06] focus:ring-2 focus:ring-purple-500/20"
            />
            {url && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-white/30 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Customization Panel */}
          <CustomizationPanel
            config={config}
            onConfigChange={setConfig}
            onLogoChange={setLogo}
            logoPreview={logo}
          />

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold text-base rounded-xl transition-all hover:from-purple-500 hover:to-purple-400 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            Gerar QR Code
          </button>

          {/* QR Code Output */}
          {isGenerated && (
            <div className="mt-8 pt-8 border-t border-white/[0.08] animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-center mb-6">
                <QRCodeDisplay
                  data={qrData}
                  config={config}
                  logo={logo}
                  isPreview={!url}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <button
                  onClick={handleDownloadPNG}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-semibold rounded-lg transition-all hover:from-purple-500 hover:to-purple-400"
                >
                  <Download className="w-4 h-4" />
                  PNG
                </button>
                <button
                  onClick={handleDownloadSVG}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-white text-sm font-semibold rounded-lg transition-all hover:bg-white/10"
                >
                  <FileImage className="w-4 h-4" />
                  SVG
                </button>
                <button
                  onClick={handleCopyUrl}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-white text-sm font-semibold rounded-lg transition-all hover:bg-white/10"
                >
                  <Copy className="w-4 h-4" />
                  Copiar Link
                </button>
                {trackingData && (
                  <button
                    onClick={handleViewStats}
                    className="flex items-center gap-2 px-4 py-2.5 bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-semibold rounded-lg transition-all hover:bg-green-500/20"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Ver Stats
                  </button>
                )}
              </div>

              {/* Tracking Section */}
              <div className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-xl">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={handleTrackingToggle}
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-white/70">
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                    Ativar Rastreamento de Scans
                  </div>
                  <div className={`toggle-switch ${trackingEnabled ? 'active' : ''}`} />
                </div>

                {trackingEnabled && (
                  <div className="mt-4 pt-4 border-t border-white/[0.08] animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="text-xs text-white/40 mb-2">
                      🎯 O QR Code aponta para uma URL de rastreamento que registra cada scan.
                    </p>
                    {isCreatingTracking ? (
                      <div className="text-sm text-purple-400">Criando link...</div>
                    ) : trackingData ? (
                      <div className="p-2 bg-white/[0.03] rounded-md text-xs text-purple-400 font-mono break-all">
                        {trackingData.trackingUrl}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-white/30 text-sm mb-3">
            Desenvolvido com <span className="text-red-400">♥</span> para facilitar sua vida
          </p>
          <button
            onClick={() => {
              setDashboardInitialLinkId(undefined);
              setShowDashboard(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white/50 bg-white/5 border border-white/10 rounded-lg transition-all hover:text-white hover:bg-white/10"
          >
            <BarChart3 className="w-4 h-4" />
            Dashboard de QR Codes
          </button>
        </footer>
      </div>

      {/* Dashboard Modal */}
      <DashboardModal
        isOpen={showDashboard}
        onClose={() => {
          setShowDashboard(false);
          setDashboardInitialLinkId(undefined);
        }}
        initialLinkId={dashboardInitialLinkId}
        onShowToast={showToast}
      />

      {/* Toast */}
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
