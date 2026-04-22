/* ============================================================
   PRICE PREFIX — make "fra kr" smaller than the number
   ============================================================ */
document.querySelectorAll('.service-card__price').forEach(el => {
  el.innerHTML = el.textContent.replace(/^(fra kr\s*)/, '<span class="price-prefix">$1</span>');
});

/* ============================================================
   HEADER — scroll state
   ============================================================ */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 48);
}, { passive: true });

/* ============================================================
   HAMBURGER / MOBILE NAV
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

hamburger.addEventListener('click', () => {
  const willOpen = !mobileNav.classList.contains('open');
  hamburger.classList.toggle('open', willOpen);
  mobileNav.classList.toggle('open', willOpen);
  hamburger.setAttribute('aria-expanded', willOpen);
  mobileNav.setAttribute('aria-hidden', !willOpen);
  document.body.style.overflow = willOpen ? 'hidden' : '';
});

mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});

/* ============================================================
   SERVICE TABS
   ============================================================ */
const tabs = document.querySelectorAll('.tab');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Deactivate all
    tabs.forEach(t => {
      t.classList.remove('tab--active');
      t.setAttribute('aria-selected', 'false');
    });
    document.querySelectorAll('.services-grid').forEach(g => g.classList.add('hidden'));

    // Activate clicked
    tab.classList.add('tab--active');
    tab.setAttribute('aria-selected', 'true');

    const grid = document.getElementById('tab-' + tab.dataset.tab);
    grid.classList.remove('hidden');

    // Staggered re-animation for newly shown cards
    grid.querySelectorAll('.service-card').forEach((card, i) => {
      card.style.animation = 'none';
      void card.offsetHeight; // force reflow
      card.style.animation = `cardIn 0.28s ease ${i * 0.035}s both`;
    });
  });
});

// Stagger the initial tab's cards on first load
document.querySelectorAll('#tab-klipp .service-card').forEach((card, i) => {
  card.style.animationDelay = `${i * 0.04}s`;
});

/* ============================================================
   SCROLL REVEAL (IntersectionObserver)
   ============================================================ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   GALLERY CAROUSEL — progress indicator
   ============================================================ */
const galleryTrack = document.getElementById('gallery-track');
const progressThumb = document.getElementById('gallery-progress-thumb');

if (galleryTrack && progressThumb) {
  const updateProgress = () => {
    const { scrollLeft, scrollWidth, clientWidth } = galleryTrack;
    const maxScroll = scrollWidth - clientWidth;
    const thumbWidthPct = (clientWidth / scrollWidth) * 100;
    const thumbLeftPct = maxScroll > 0 ? (scrollLeft / maxScroll) * (100 - thumbWidthPct) : 0;
    progressThumb.style.width = thumbWidthPct + '%';
    progressThumb.style.left = thumbLeftPct + '%';
  };
  galleryTrack.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
const lightbox       = document.getElementById('lightbox');
const lightboxImg    = document.getElementById('lightbox-img');
const lightboxClose  = document.getElementById('lightbox-close');
const lightboxPrev   = document.getElementById('lightbox-prev');
const lightboxNext   = document.getElementById('lightbox-next');
const galleryImgs    = [...document.querySelectorAll('.gallery-item img')];
let lightboxIndex    = 0;

const setLightboxImg = (index, fade) => {
  if (fade) lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = galleryImgs[index].src;
    lightboxImg.alt = galleryImgs[index].alt;
    lightboxImg.style.opacity = '1';
  }, fade ? 120 : 0);
};

const openLightbox = (index) => {
  lightboxIndex = index;
  setLightboxImg(index, false);
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

const showLightboxPrev = () => {
  lightboxIndex = (lightboxIndex - 1 + galleryImgs.length) % galleryImgs.length;
  setLightboxImg(lightboxIndex, true);
};

const showLightboxNext = () => {
  lightboxIndex = (lightboxIndex + 1) % galleryImgs.length;
  setLightboxImg(lightboxIndex, true);
};

galleryImgs.forEach((img, i) => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => openLightbox(i));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showLightboxPrev);
lightboxNext.addEventListener('click', showLightboxNext);

lightbox.addEventListener('click', e => {
  if (e.target === lightbox || e.target === lightboxImg.parentElement) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   showLightboxPrev();
  if (e.key === 'ArrowRight')  showLightboxNext();
});

/* ============================================================
   SMOOTH ANCHOR — close mobile nav before scroll
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});
