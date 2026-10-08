import React, { useState } from 'react';
import { ArrowRight, Factory, PackageCheck, ShieldCheck, TreePine } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../translations';
import { COMPANY_DATA } from '../data/companyData';
import { OFFICIAL_IMAGES } from '../data/timberData';

interface SawmillPowerProps {
  currentLang: Language;
}

export const SawmillPower: React.FC<SawmillPowerProps> = ({ currentLang }) => {
  const t = translations[currentLang].infrastructure;
  const [activeImageIndex, setActiveImageIndex] = useState(1);

  const galleryItems = [
    { url: OFFICIAL_IMAGES.rawMaterialFsc, title: 'Carpathian spruce', stage: '01 · SOURCING', alt: 'Spruce forest in the Carpathian region' },
    { url: OFFICIAL_IMAGES.sortedPiles, title: 'Gălănești mill', stage: '02 · MILL SITE', alt: 'Aerial view of the Gălănești sawmill and timber yard' },
    { url: OFFICIAL_IMAGES.sawingLine, title: 'Sawn timber', stage: '03 · FINISHED STOCK', alt: 'Stacks of sawn timber ready for grading and dispatch' },
    { url: OFFICIAL_IMAGES.logisticsBase, title: 'Container loading', stage: '04 · DISPATCH', alt: 'Timber loaded into a container trailer for dispatch' },
  ];
  const activeItem = galleryItems[activeImageIndex];

  return (
    <section id="sawmill" className="mill-section py-20 relative border-b scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="section-heading section-heading--split">
          <div>
            <span className="section-eyebrow">01 <span aria-hidden="true">/</span> {t.sectionBadge}</span>
            <h2>{t.title}</h2>
          </div>
          <p>{t.subtitle}</p>
        </header>

        <div className="mill-layout">
          <figure className="mill-feature">
            <img src={activeItem.url} alt={activeItem.alt} />
            <figcaption>
              <span>{activeItem.stage}</span>
              <strong>{activeItem.title}</strong>
              <small>Gălănești · Suceava, Romania</small>
            </figcaption>
          </figure>

          <aside className="mill-facts" aria-label="Production at a glance">
            <div className="mill-facts__intro">
              <span className="section-eyebrow">FROM LOG TO EXPORT</span>
              <p>One production base in Gălănești, connected to our export terminal at Agigea.</p>
            </div>

            <dl className="mill-metrics">
              <div><dt>Roundwood intake</dt><dd>100,000 <span>m³ / year</span></dd></div>
              <div><dt>Kiln-drying capacity</dt><dd>3,500 <span>m³ / month</span></dd></div>
              <div><dt>Finished timber</dt><dd>70,000 <span>m³ / year</span></dd></div>
            </dl>

            <ol className="mill-process">
              <li><span>01</span><Factory aria-hidden="true" /><strong>Saw</strong></li>
              <li><span>02</span><TreePine aria-hidden="true" /><strong>Grade & dry</strong></li>
              <li><span>03</span><PackageCheck aria-hidden="true" /><strong>Pack & ship</strong></li>
            </ol>

            <div className="mill-certification">
              <ShieldCheck aria-hidden="true" />
              <span><strong>FSC® chain of custody</strong><small>{COMPANY_DATA.certifications[0].certNumber}</small></span>
              <ArrowRight aria-hidden="true" className="mill-certification__arrow" />
            </div>
          </aside>
        </div>

        <nav className="mill-gallery" aria-label="Production photos">
          {galleryItems.map((item, index) => (
            <button
              key={item.stage}
              type="button"
              onClick={() => setActiveImageIndex(index)}
              aria-pressed={activeImageIndex === index}
              className={activeImageIndex === index ? 'is-active' : ''}
            >
              <img src={item.url} alt="" />
              <span><small>{item.stage}</small><strong>{item.title}</strong></span>
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
};
