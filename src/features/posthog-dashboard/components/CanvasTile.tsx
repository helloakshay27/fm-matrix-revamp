import React, { useRef } from 'react';
import { useCanvas } from '../context/CanvasContext';

interface CanvasTileProps {
  id: string;
  title?: string;
  defaultCs?: number;
  children: React.ReactNode;
}

export function CanvasTile({ id, title, defaultCs = 6, children }: CanvasTileProps) {
  const { sizes, updateSize } = useCanvas();
  const tileRef = useRef<HTMLDivElement>(null);
  
  const size = sizes[id] || { cs: defaultCs, h: 0 };
  const displayName = title || id;

  const handleResizePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const h = e.currentTarget as HTMLElement;
    const tile = tileRef.current;
    if (!tile) return;
    
    const grid = tile.parentElement;
    if (!grid) return;
    
    // Default config values
    const cols = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cols')) || 12;
    const gap = 12; // var(--gap)
    const gw = grid.getBoundingClientRect().width;
    const colW = (gw - gap * (cols - 1)) / cols;
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startCs = size.cs;
    const startH = tile.getBoundingClientRect().height;
    
    const tag = document.createElement('div');
    tag.className = 'sizetag';
    document.body.appendChild(tag);
    document.body.classList.add('is-resizing');
    h.setPointerCapture(e.pointerId);

    let newCs = startCs;
    let newH = startH;

    const onPointerMove = (ev: PointerEvent) => {
      const dCols = Math.round((ev.clientX - startX) / (colW + gap));
      newCs = Math.max(1, Math.min(cols, startCs + dCols));
      newH = Math.max(120, Math.round((startH + (ev.clientY - startY)) / 10) * 10);
      
      tile.style.setProperty('--cs', String(newCs));
      tile.style.setProperty('--h', String(newH));
      tile.setAttribute('data-h', 'true');
      
      tag.textContent = `${newCs}/${cols} wide · ${newH}px`;
      tag.style.left = Math.min(ev.clientX + 14, window.innerWidth - 150) + 'px';
      tag.style.top = Math.min(ev.clientY + 16, window.innerHeight - 40) + 'px';
    };

    const onPointerUp = (ev: PointerEvent) => {
      document.body.classList.remove('is-resizing');
      tag.remove();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      
      if (newCs !== startCs || newH !== startH) {
        updateSize(id, newCs, newH);
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    onPointerMove(e.nativeEvent);
  };

  const handleDragPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const grip = e.currentTarget as HTMLElement;
    const tile = tileRef.current;
    if (!tile) return;
    
    const r = tile.getBoundingClientRect();
    const ph = document.createElement('div');
    ph.className = 'ph';
    ph.style.setProperty('--cs', String(size.cs));
    ph.style.height = r.height + 'px';
    
    if (tile.parentNode) {
      tile.parentNode.insertBefore(ph, tile);
    }
    
    const dx = e.clientX - r.left;
    const dy = e.clientY - r.top;
    
    tile.classList.add('dragging');
    tile.style.width = r.width + 'px';
    tile.style.height = r.height + 'px';
    tile.style.left = r.left + 'px';
    tile.style.top = r.top + 'px';
    document.body.classList.add('is-dragging');
    grip.setPointerCapture(e.pointerId);
    
    let moved = false;

    const onPointerMove = (ev: PointerEvent) => {
      moved = true;
      tile.style.left = (ev.clientX - dx) + 'px';
      tile.style.top = (ev.clientY - dy) + 'px';
      
      const EDGE = 60;
      if (ev.clientY < EDGE) window.scrollBy(0, -Math.ceil((EDGE - ev.clientY) / 5));
      else if (ev.clientY > window.innerHeight - EDGE) window.scrollBy(0, Math.ceil((ev.clientY - (window.innerHeight - EDGE)) / 5));
      
      const under = document.elementFromPoint(ev.clientX, ev.clientY);
      if (!under || tile.contains(under)) return;
      
      const over = under.closest('.ctile') as HTMLElement;
      if (over && over !== tile) {
        const rect = over.getBoundingClientRect();
        const overCsText = over.style.getPropertyValue('--cs') || getComputedStyle(over).getPropertyValue('--cs');
        const overCs = parseInt(overCsText) || 6;
        
        const before = overCs >= 10 
          ? ev.clientY < rect.top + rect.height / 2 
          : ev.clientX < rect.left + rect.width / 2;
        
        const grid = over.parentNode;
        if (grid) {
          if (before) grid.insertBefore(ph, over);
          else grid.insertBefore(ph, over.nextSibling);
        }
        return;
      }
      
      const grid = under.closest('.zone-grid');
      if (grid && ph.parentNode !== grid) {
        grid.appendChild(ph);
      }
    };

    const onPointerUp = (ev: PointerEvent) => {
      if (ph.parentNode) {
        ph.parentNode.insertBefore(tile, ph);
        ph.remove();
      }
      tile.classList.remove('dragging');
      tile.style.width = '';
      tile.style.height = '';
      tile.style.left = '';
      tile.style.top = '';
      document.body.classList.remove('is-dragging');
      
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      
      if (moved) {
        const grid = tile.closest('.zone-grid');
        if (grid) {
          grid.dispatchEvent(new CustomEvent('canvas-order-changed', { bubbles: true }));
        }
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  return (
    <div 
      ref={tileRef}
      className="ctile" 
      data-card={id} 
      style={{ '--cs': size.cs, '--h': size.h } as React.CSSProperties}
      data-h={size.h > 0 ? "true" : undefined}
    >
      <button type="button" className="grip" onPointerDown={handleDragPointerDown} title="Drag to move">
        <svg className="dots" viewBox="0 0 10 14" width="7" height="10" aria-hidden="true" fill="currentColor">
          <circle cx="2" cy="2" r="1.1"/><circle cx="8" cy="2" r="1.1"/>
          <circle cx="2" cy="7" r="1.1"/><circle cx="8" cy="7" r="1.1"/>
          <circle cx="2" cy="12" r="1.1"/><circle cx="8" cy="12" r="1.1"/>
        </svg>
        <span>{displayName}</span>
      </button>
      {children}
      <button type="button" className="rsz" onPointerDown={handleResizePointerDown} title="Drag to resize" />
    </div>
  );
}
