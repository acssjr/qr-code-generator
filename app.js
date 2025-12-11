/**
 * QR Code Generator Pro
 * Advanced QR code customization with real-time preview
 */

// DOM Elements
const urlInput = document.getElementById('url-input');
const clearBtn = document.getElementById('clear-btn');
const generateBtn = document.getElementById('generate-btn');
const qrCodeContainer = document.getElementById('qr-code');
const qrContainer = document.getElementById('qr-container');
const actionsContainer = document.getElementById('actions');
const downloadBtn = document.getElementById('download-btn');
const downloadSvgBtn = document.getElementById('download-svg-btn');
const copyBtn = document.getElementById('copy-btn');
const copyText = document.getElementById('copy-text');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// Customization Panel Elements
const panelToggle = document.getElementById('panel-toggle');
const panelContent = document.getElementById('panel-content');
const logoInput = document.getElementById('logo-input');
const logoPreview = document.getElementById('logo-preview');
const logoImage = document.getElementById('logo-image');
const removeLogoBtn = document.getElementById('remove-logo-btn');
const marginSlider = document.getElementById('margin-slider');
const marginValue = document.getElementById('margin-value');
const sizeSlider = document.getElementById('size-slider');
const sizeValue = document.getElementById('size-value');
const dotStyleButtons = document.getElementById('dot-style-buttons');
const cornerStyleButtons = document.getElementById('corner-style-buttons');
const dotColorInput = document.getElementById('dot-color');
const cornerColorInput = document.getElementById('corner-color');
const bgColorInput = document.getElementById('bg-color');
const dotColorHex = document.getElementById('dot-color-hex');
const cornerColorHex = document.getElementById('corner-color-hex');
const bgColorHex = document.getElementById('bg-color-hex');

// State
let qrCode = null;
let currentUrl = '';
let logoDataUrl = null;
let isGenerated = false;
let debounceTimer = null;

// Configuration
const config = {
    width: 200,
    height: 200,
    margin: 10,
    downloadSize: 300,
    dotStyle: 'rounded',
    cornerStyle: 'extra-rounded',
    dotColor: '#1a1a2e',
    cornerColor: '#7c3aed',
    bgColor: '#ffffff',
    errorCorrectionLevel: 'Q'
};

// Preview placeholder URL
const PREVIEW_URL = 'https://preview.qr';

/**
 * Get current QR code configuration
 */
function getQRCodeConfig(forPreview = false) {
    const data = forPreview ? PREVIEW_URL : (currentUrl || PREVIEW_URL);

    return {
        width: config.width,
        height: config.height,
        type: 'canvas',
        data: data,
        margin: config.margin,
        qrOptions: {
            errorCorrectionLevel: config.errorCorrectionLevel
        },
        dotsOptions: {
            color: config.dotColor,
            type: config.dotStyle
        },
        cornersSquareOptions: {
            color: config.cornerColor,
            type: config.cornerStyle
        },
        cornersDotOptions: {
            color: config.cornerColor,
            type: 'dot'
        },
        backgroundOptions: {
            color: config.bgColor
        },
        imageOptions: {
            crossOrigin: 'anonymous',
            margin: 5,
            imageSize: 0.4,
            hideBackgroundDots: true
        },
        image: logoDataUrl || undefined
    };
}

/**
 * Initialize QR Code with preview
 */
function initQRCode() {
    qrCode = new QRCodeStyling(getQRCodeConfig(true));
    qrCodeContainer.innerHTML = '';
    qrCode.append(qrCodeContainer);
    qrCodeContainer.classList.add('visible');

    // Add preview indicator
    updatePreviewIndicator(true);
}

/**
 * Update preview indicator
 */
function updatePreviewIndicator(isPreview) {
    let indicator = document.querySelector('.preview-indicator');

    if (isPreview && !isGenerated) {
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'preview-indicator';
            indicator.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                </svg>
                Preview
            `;
            qrContainer.appendChild(indicator);
        }
        indicator.style.display = 'flex';
    } else if (indicator) {
        indicator.style.display = 'none';
    }
}

/**
 * Update QR Code preview in real-time (debounced)
 */
function updatePreview() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        if (!qrCode) return;

        const newConfig = getQRCodeConfig(!isGenerated);
        qrCode.update(newConfig);
    }, 50);
}

/**
 * Validate URL
 */
function isValidUrl(url) {
    if (!url || url.trim() === '') return false;

    let testUrl = url;
    if (!url.match(/^https?:\/\//i)) {
        testUrl = 'https://' + url;
    }

    try {
        new URL(testUrl);
        return true;
    } catch {
        return false;
    }
}

/**
 * Normalize URL
 */
function normalizeUrl(url) {
    if (!url.match(/^https?:\/\//i)) {
        return 'https://' + url;
    }
    return url;
}

/**
 * Generate QR Code (final)
 */
function generateQRCode() {
    const url = urlInput.value.trim();

    if (!isValidUrl(url)) {
        showToast('Por favor, insira um link válido', 'error');
        urlInput.focus();
        return;
    }

    currentUrl = normalizeUrl(url);
    isGenerated = true;

    generateBtn.disabled = true;
    generateBtn.innerHTML = `
        <svg class="btn-icon spinning" viewBox="0 0 24 24" fill="none">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Gerando...
    `;

    // Update QR with real URL
    qrCode.update(getQRCodeConfig(false));

    setTimeout(() => {
        actionsContainer.classList.remove('hidden');
        updatePreviewIndicator(false);

        generateBtn.disabled = false;
        generateBtn.innerHTML = `
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Atualizar QR Code
        `;

        showToast('QR Code gerado com sucesso!', 'success');
    }, 300);
}

/**
 * Handle URL input changes for real-time preview
 */
function handleUrlInput() {
    const url = urlInput.value.trim();

    if (isGenerated && isValidUrl(url)) {
        // Update preview with typed URL
        currentUrl = normalizeUrl(url);
        qrCode.update(getQRCodeConfig(false));
    }
}

/**
 * Download PNG
 */
async function downloadPNG() {
    if (!qrCode || !currentUrl) return;

    try {
        const downloadConfig = getQRCodeConfig(false);
        downloadConfig.width = config.downloadSize;
        downloadConfig.height = config.downloadSize;

        const downloadQR = new QRCodeStyling(downloadConfig);
        await downloadQR.download({ name: 'qrcode', extension: 'png' });
        showToast('Download PNG realizado!', 'success');
    } catch (error) {
        showToast('Erro ao fazer download', 'error');
        console.error('Download error:', error);
    }
}

/**
 * Download SVG with embedded logo
 * Fixes Illustrator compatibility by ensuring image is inline base64
 */
async function downloadSVG() {
    if (!qrCode || !currentUrl) return;

    try {
        showToast('Gerando SVG...', 'success');

        const downloadConfig = getQRCodeConfig(false);
        downloadConfig.width = config.downloadSize;
        downloadConfig.height = config.downloadSize;
        downloadConfig.type = 'svg';

        const downloadQR = new QRCodeStyling(downloadConfig);

        // Get SVG as blob
        const svgBlob = await downloadQR.getRawData('svg');

        // Read blob as text
        const svgText = await svgBlob.text();

        // Parse and fix the SVG
        let fixedSvg = svgText;

        // If there's a logo, ensure it's embedded as base64
        if (logoDataUrl) {
            // The logo should already be base64 from our optimizeLogo function
            // Check if the SVG has an image with xlink:href or href
            fixedSvg = fixedSvg.replace(
                /xlink:href="(?!data:)[^"]*"/g,
                `xlink:href="${logoDataUrl}"`
            );
            fixedSvg = fixedSvg.replace(
                /href="(?!data:)(?!#)[^"]*"/g,
                `href="${logoDataUrl}"`
            );
        }

        // Create downloadable blob
        const blob = new Blob([fixedSvg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);

        // Download
        const link = document.createElement('a');
        link.href = url;
        link.download = 'qrcode.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showToast('Download SVG realizado!', 'success');
    } catch (error) {
        showToast('Erro ao fazer download', 'error');
        console.error('Download error:', error);
    }
}


/**
 * Copy URL to clipboard
 */
async function copyToClipboard() {
    if (!currentUrl) return;

    try {
        await navigator.clipboard.writeText(currentUrl);
        copyText.textContent = 'Copiado!';
        copyBtn.style.borderColor = 'var(--purple-500)';
        copyBtn.style.color = 'var(--purple-400)';

        setTimeout(() => {
            copyText.textContent = 'Copiar Link';
            copyBtn.style.borderColor = '';
            copyBtn.style.color = '';
        }, 2000);

        showToast('Link copiado!', 'success');
    } catch (error) {
        showToast('Erro ao copiar link', 'error');
    }
}

/**
 * Toggle customization panel
 */
function togglePanel() {
    panelToggle.classList.toggle('active');
    panelContent.classList.toggle('visible');
}

/**
 * Optimize and compress logo image
 * @param {string} dataUrl - Original image data URL
 * @param {number} maxSize - Maximum dimension (width/height)
 * @param {number} quality - JPEG quality (0-1)
 * @returns {Promise<string>} - Optimized image data URL
 */
function optimizeLogo(dataUrl, maxSize = 150, quality = 0.8) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Scale down if larger than maxSize
            if (width > maxSize || height > maxSize) {
                if (width > height) {
                    height = Math.round((height * maxSize) / width);
                    width = maxSize;
                } else {
                    width = Math.round((width * maxSize) / height);
                    height = maxSize;
                }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');

            // White background for transparency
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);

            // Draw image
            ctx.drawImage(img, 0, 0, width, height);

            // Export as PNG for best compatibility with SVG
            const optimizedDataUrl = canvas.toDataURL('image/png', quality);
            resolve(optimizedDataUrl);
        };
        img.src = dataUrl;
    });
}

/**
 * Handle logo upload
 */
async function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showToast('Por favor, selecione uma imagem', 'error');
        return;
    }

    // Check file size (warn if > 1MB)
    if (file.size > 1024 * 1024) {
        showToast('Otimizando imagem grande...', 'success');
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        // Optimize the logo
        const originalDataUrl = e.target.result;
        logoDataUrl = await optimizeLogo(originalDataUrl, 150, 0.85);

        logoImage.src = logoDataUrl;
        logoImage.style.display = 'block';
        logoPreview.classList.add('has-logo');
        logoPreview.querySelector('.upload-icon').style.display = 'none';
        removeLogoBtn.style.display = 'flex';

        // Auto-set high error correction when logo is added
        config.errorCorrectionLevel = 'H';
        document.querySelector('input[name="errorCorrection"][value="H"]').checked = true;

        updatePreview();
        showToast('Logo otimizado e adicionado!', 'success');
    };
    reader.readAsDataURL(file);
}

/**
 * Remove logo
 */
function removeLogo() {
    logoDataUrl = null;
    logoImage.src = '';
    logoImage.style.display = 'none';
    logoPreview.classList.remove('has-logo');
    logoPreview.querySelector('.upload-icon').style.display = 'block';
    removeLogoBtn.style.display = 'none';
    logoInput.value = '';

    updatePreview();
    showToast('Logo removido', 'success');
}

/**
 * Handle slider changes
 */
function handleMarginChange() {
    config.margin = parseInt(marginSlider.value);
    marginValue.textContent = config.margin + 'px';
    updatePreview();
}

function handleSizeChange() {
    config.downloadSize = parseInt(sizeSlider.value);
    sizeValue.textContent = config.downloadSize + 'px';
}

/**
 * Handle style button clicks
 */
function handleDotStyleClick(event) {
    const btn = event.target.closest('.style-btn');
    if (!btn) return;

    dotStyleButtons.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    config.dotStyle = btn.dataset.style;
    updatePreview();
}

function handleCornerStyleClick(event) {
    const btn = event.target.closest('.style-btn');
    if (!btn) return;

    cornerStyleButtons.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    config.cornerStyle = btn.dataset.style;
    updatePreview();
}

/**
 * Handle color changes
 */
function handleDotColorChange() {
    config.dotColor = dotColorInput.value;
    dotColorHex.textContent = config.dotColor;
    updatePreview();
}

function handleCornerColorChange() {
    config.cornerColor = cornerColorInput.value;
    cornerColorHex.textContent = config.cornerColor;
    updatePreview();
}

function handleBgColorChange() {
    config.bgColor = bgColorInput.value;
    bgColorHex.textContent = config.bgColor;

    // Update container background to match
    qrContainer.style.backgroundColor = config.bgColor;
    updatePreview();
}

/**
 * Handle error correction change
 */
function handleErrorCorrectionChange(event) {
    if (event.target.type === 'radio') {
        config.errorCorrectionLevel = event.target.value;
        updatePreview();
    }
}

/**
 * Clear input
 */
function clearInput() {
    urlInput.value = '';
    currentUrl = '';
    isGenerated = false;
    actionsContainer.classList.add('hidden');

    // Reset to preview mode
    qrCode.update(getQRCodeConfig(true));
    updatePreviewIndicator(true);

    // Reset button text
    generateBtn.innerHTML = `
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Gerar QR Code
    `;

    urlInput.focus();
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    toastMessage.textContent = message;

    const toastIcon = toast.querySelector('.toast-icon');
    if (type === 'error') {
        toastIcon.innerHTML = `<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
        toastIcon.style.color = '#ef4444';
    } else {
        toastIcon.innerHTML = `<path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
        toastIcon.style.color = 'var(--purple-400)';
    }

    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 3000);
}

/**
 * Handle Enter key
 */
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        generateQRCode();
    }
}

// Add styles
const style = document.createElement('style');
style.textContent = `
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .spinning { animation: spin 1s linear infinite; }
    
    .preview-indicator {
        position: absolute;
        bottom: 8px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 10px;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 20px;
        font-size: 11px;
        font-weight: 500;
        color: #a855f7;
        pointer-events: none;
    }
    
    .preview-indicator svg {
        width: 12px;
        height: 12px;
    }
`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initQRCode();

    // Main actions
    generateBtn.addEventListener('click', generateQRCode);
    clearBtn.addEventListener('click', clearInput);
    downloadBtn.addEventListener('click', downloadPNG);
    downloadSvgBtn.addEventListener('click', downloadSVG);
    copyBtn.addEventListener('click', copyToClipboard);
    urlInput.addEventListener('keypress', handleKeyPress);
    urlInput.addEventListener('input', handleUrlInput);

    // Panel toggle
    panelToggle.addEventListener('click', togglePanel);

    // Logo
    logoInput.addEventListener('change', handleLogoUpload);
    removeLogoBtn.addEventListener('click', removeLogo);

    // Sliders
    marginSlider.addEventListener('input', handleMarginChange);
    sizeSlider.addEventListener('input', handleSizeChange);

    // Style buttons
    dotStyleButtons.addEventListener('click', handleDotStyleClick);
    cornerStyleButtons.addEventListener('click', handleCornerStyleClick);

    // Colors
    dotColorInput.addEventListener('input', handleDotColorChange);
    cornerColorInput.addEventListener('input', handleCornerColorChange);
    bgColorInput.addEventListener('input', handleBgColorChange);

    // Error correction
    document.getElementById('error-correction').addEventListener('change', handleErrorCorrectionChange);

    urlInput.focus();
});
