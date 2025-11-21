import { useEffect } from 'react';

interface ProtectionLayerProps {
  enabled?: boolean;
  allowedDomains?: string[];
}

/**
 * ProtectionLayer Component
 * 
 * Provides comprehensive content protection including:
 * - Right-click (context menu) blocking
 * - Double-click text selection prevention
 * - Keyboard shortcut blocking (copy, cut, print, dev tools, etc.)
 * - Text selection prevention
 * - Drag & drop blocking
 * - Developer tools access prevention
 * 
 * @param enabled - Whether protection is active (default: true)
 * @param allowedDomains - List of domains where protection should be active
 */
export const ProtectionLayer: React.FC<ProtectionLayerProps> = ({ 
  enabled = true,
  allowedDomains = ['web.gophygital.work', 'vi-web.gophygital.work']
}) => {
  useEffect(() => {
    // Check if protection should be enabled for current domain
    const hostname = window.location.hostname;
    const shouldProtect = enabled && allowedDomains.some(domain => hostname.includes(domain));

    if (!shouldProtect) {
      console.log('🔓 Protection not enabled for this domain:', hostname);
      return;
    }

    // Disable right-click (context menu)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Disable double-click text selection
    const handleDoubleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Disable keyboard shortcuts for copy, cut, paste, save, print, view source
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;
      
      // List of blocked shortcuts
      const blockedShortcuts = [
        // Copy operations
        { key: 'c', ctrl: true },          // Ctrl+C / Cmd+C
        { key: 'C', ctrl: true },          // Ctrl+Shift+C / Cmd+Shift+C
        // Cut operations
        { key: 'x', ctrl: true },          // Ctrl+X / Cmd+X
        { key: 'X', ctrl: true },          // Ctrl+Shift+X / Cmd+Shift+X
        // Save operations
        { key: 's', ctrl: true },          // Ctrl+S / Cmd+S
        { key: 'S', ctrl: true },          // Ctrl+Shift+S / Cmd+Shift+S
        // Print operations
        { key: 'p', ctrl: true },          // Ctrl+P / Cmd+P
        { key: 'P', ctrl: true },          // Ctrl+Shift+P / Cmd+Shift+P
        // View source
        { key: 'u', ctrl: true },          // Ctrl+U / Cmd+U
        { key: 'U', ctrl: true },          // Ctrl+Shift+U / Cmd+Shift+U
        // Developer tools
        { key: 'i', ctrl: true, shift: true }, // Ctrl+Shift+I / Cmd+Shift+I
        { key: 'I', ctrl: true, shift: true },
        { key: 'j', ctrl: true, shift: true }, // Ctrl+Shift+J / Cmd+Shift+J
        { key: 'J', ctrl: true, shift: true },
        { key: 'c', ctrl: true, shift: true }, // Ctrl+Shift+C / Cmd+Shift+C (inspect)
        // Select all
        { key: 'a', ctrl: true },          // Ctrl+A / Cmd+A
        { key: 'A', ctrl: true },          // Ctrl+Shift+A / Cmd+Shift+A
      ];

      // Check if current key combination matches any blocked shortcut
      const isBlocked = blockedShortcuts.some(shortcut => {
        const keyMatch = e.key === shortcut.key;
        const ctrlMatch = shortcut.ctrl ? ctrlKey : true;
        const shiftMatch = shortcut.shift ? e.shiftKey : true;
        return keyMatch && ctrlMatch && shiftMatch;
      });

      // Also block F12 (developer tools)
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      if (isBlocked) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Disable drag operations
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable select start
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      // Allow selection in input, textarea, and contenteditable elements
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return true;
      }
      e.preventDefault();
      return false;
    };

    // Disable copy event
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      // Allow copy in input, textarea, and contenteditable elements
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return true;
      }
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Disable cut event
    const handleCut = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      // Allow cut in input, textarea, and contenteditable elements
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return true;
      }
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Disable text selection via CSS for all browsers
    const disableSelectionStyles = document.createElement('style');
    disableSelectionStyles.id = 'disable-selection-styles';
    disableSelectionStyles.innerHTML = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-user-drag: none !important;
      }
      input, textarea, [contenteditable="true"] {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
      img {
        -webkit-user-drag: none !important;
        -moz-user-drag: none !important;
        -ms-user-drag: none !important;
        user-drag: none !important;
        pointer-events: none !important;
      }
    `;
    
    // Add all event listeners
    document.addEventListener('contextmenu', handleContextMenu, { capture: true });
    document.addEventListener('dblclick', handleDoubleClick, { capture: true });
    document.addEventListener('keydown', handleKeyDown, { capture: true });
    document.addEventListener('dragstart', handleDragStart, { capture: true });
    document.addEventListener('selectstart', handleSelectStart, { capture: true });
    document.addEventListener('copy', handleCopy, { capture: true });
    document.addEventListener('cut', handleCut, { capture: true });
    document.head.appendChild(disableSelectionStyles);

    // Detect OS and browser for logging
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    let os = 'Unknown';
    let browser = 'Unknown';

    // Detect OS
    if (platform.indexOf('Mac') > -1) os = 'macOS';
    else if (platform.indexOf('Win') > -1) os = 'Windows';
    else if (platform.indexOf('Linux') > -1) os = 'Linux';

    // Detect browser
    if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox';
    else if (userAgent.indexOf('Chrome') > -1) browser = 'Chrome';
    else if (userAgent.indexOf('Safari') > -1) browser = 'Safari';
    else if (userAgent.indexOf('Edge') > -1) browser = 'Edge';

    console.log('🔒 Enhanced protection enabled');
    console.log(`   📍 Domain: ${hostname}`);
    console.log(`   💻 OS: ${os}`);
    console.log(`   🌐 Browser: ${browser}`);
    console.log('   ✓ Right-click disabled');
    console.log('   ✓ Double-click disabled');
    console.log('   ✓ Keyboard shortcuts blocked');
    console.log('   ✓ Text selection disabled');
    console.log('   ✓ Drag & drop disabled');
    console.log('   ✓ Developer tools access blocked');

    // Cleanup function
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, { capture: true } as any);
      document.removeEventListener('dblclick', handleDoubleClick, { capture: true } as any);
      document.removeEventListener('keydown', handleKeyDown, { capture: true } as any);
      document.removeEventListener('dragstart', handleDragStart, { capture: true } as any);
      document.removeEventListener('selectstart', handleSelectStart, { capture: true } as any);
      document.removeEventListener('copy', handleCopy, { capture: true } as any);
      document.removeEventListener('cut', handleCut, { capture: true } as any);
      const styleElement = document.getElementById('disable-selection-styles');
      if (styleElement) {
        styleElement.remove();
      }
      console.log('🔓 Protection disabled');
    };
  }, [enabled, allowedDomains]);

  // This component doesn't render anything visible
  return null;
};
