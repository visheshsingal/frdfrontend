import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';

const MediaGallery = () => {
  const { backendUrl } = useContext(ShopContext);
  const [items, setItems] = useState([]);
  const [visibleIds, setVisibleIds] = useState(new Set());

  useEffect(() => {
    const fetch = async () => {
      try {
        if (!backendUrl) return;
        const res = await axios.get(`${backendUrl}/api/media/list`);
        if (res.data.success) setItems(res.data.media || []);
      } catch (e) { console.error(e); }
    };
    fetch();
  }, [backendUrl]);

  useEffect(() => {
    if (!items || items.length === 0) return;

    const els = Array.from(document.querySelectorAll('[data-media-id]'));
    if (!('IntersectionObserver' in window)) {
      setVisibleIds(new Set(items.map(i => i._id)));
      return;
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-media-id');
          setVisibleIds(prev => new Set(prev).add(id));
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [items]);

  if (!items || items.length === 0) return null;

  return (
    <div className="my-12">
      <h3 className="text-2xl font-semibold text-center mb-8 text-gray-800">Media Gallery</h3>
      
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((it) => {
          const isVisible = visibleIds.has(it._id);
          return (
            <div
              key={it._id}
              data-media-id={it._id}
              className={`rounded-xl overflow-hidden bg-gray-50 shadow-md transform transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              {/* YE LINE CHANGE KI HAI — AB POORI IMAGE DIKHEGI HAR JAGAH */}
              <img 
                loading="lazy" 
                src={it.image} 
                alt={it.caption || 'media image'} 
                className="w-full h-auto object-contain bg-gray-100"
              />
              
              {it.caption && (
                <div className="p-4 text-center text-sm md:text-base text-gray-700 font-medium bg-white">
                  {it.caption}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MediaGallery;