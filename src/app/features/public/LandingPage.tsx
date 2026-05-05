import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';

const fallbackHeroImage = 'https://images.unsplash.com/photo-1648995361141-30676a75fd27?auto=format&fit=crop&fm=jpg&q=80&w=1400';
const unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const heroFadeDurationMs = 1500;

type UnsplashPhoto = {
  urls: {
    regular: string;
  };
  alt_description: string | null;
  user: {
    name: string;
    links: {
      html: string;
    };
  };
  links: {
    html: string;
  };
};

type HeroPhoto = {
  src: string;
  alt: string;
  photographerName?: string;
  photographerUrl?: string;
  photoUrl?: string;
};

const fallbackHeroPhoto: HeroPhoto = {
  src: fallbackHeroImage,
  alt: 'A man running on a treadmill in a gym',
  photographerName: 'sour moha',
  photographerUrl: 'https://unsplash.com/@sour_moha?utm_source=wellness_connect&utm_medium=referral',
  photoUrl: 'https://unsplash.com/photos/a-man-running-on-a-treadmill-in-a-gym-_cUZkx0wTyM?utm_source=wellness_connect&utm_medium=referral',
};

export default function LandingPage() {
  const [heroPhoto, setHeroPhoto] = useState<HeroPhoto>(fallbackHeroPhoto);
  const [nextHeroPhoto, setNextHeroPhoto] = useState<HeroPhoto | null>(null);
  const [isNextHeroPhotoVisible, setIsNextHeroPhotoVisible] = useState(false);
  const isLoadingHeroPhoto = useRef(false);
  const fadeTimeout = useRef<number>();

  useEffect(() => {
    if (!unsplashAccessKey) {
      return;
    }

    const controller = new AbortController();
    const params = new URLSearchParams({
      query: 'wellness meditation therapy',
      orientation: 'landscape',
      content_filter: 'high',
      client_id: unsplashAccessKey,
    });

    function preloadImage(src: string) {
      return new Promise<void>((resolve, reject) => {
        const image = new Image();

        image.onload = () => {
          if (image.decode) {
            image.decode().then(resolve).catch(resolve);
          } else {
            resolve();
          }
        };
        image.onerror = reject;
        image.src = src;
      });
    }

    async function loadRandomHeroPhoto() {
      if (isLoadingHeroPhoto.current) {
        return;
      }

      isLoadingHeroPhoto.current = true;

      try {
        const response = await fetch(`https://api.unsplash.com/photos/random?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Unable to load Unsplash photo');
        }

        const photo = (await response.json()) as UnsplashPhoto;
        const nextHeroPhoto = {
          src: photo.urls.regular,
          alt: photo.alt_description || 'Wellness coaching session',
          photographerName: photo.user.name,
          photographerUrl: `${photo.user.links.html}?utm_source=wellness_connect&utm_medium=referral`,
          photoUrl: `${photo.links.html}?utm_source=wellness_connect&utm_medium=referral`,
        };

        await preloadImage(nextHeroPhoto.src);

        if (controller.signal.aborted) {
          return;
        }

        setNextHeroPhoto(nextHeroPhoto);
        window.requestAnimationFrame(() => {
          if (!controller.signal.aborted) {
            setIsNextHeroPhotoVisible(true);
          }
        });

        fadeTimeout.current = window.setTimeout(() => {
          if (!controller.signal.aborted) {
            setHeroPhoto(nextHeroPhoto);
            setNextHeroPhoto(null);
            setIsNextHeroPhotoVisible(false);
            isLoadingHeroPhoto.current = false;
          }
        }, heroFadeDurationMs);
      } catch (error) {
        if (!controller.signal.aborted) {
          isLoadingHeroPhoto.current = false;
        }
      }
    }

    loadRandomHeroPhoto();
    const intervalId = window.setInterval(loadRandomHeroPhoto, 5000);

    return () => {
      window.clearInterval(intervalId);
      if (fadeTimeout.current) {
        window.clearTimeout(fadeTimeout.current);
      }
      controller.abort();
    };
  }, []);

  function renderAttribution(photo: HeroPhoto) {
    if (!photo.photographerName) {
      return null;
    }

    return (
      <figcaption className="absolute bottom-3 right-3 rounded-full bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
        Photo by{' '}
        <a className="underline underline-offset-2" href={photo.photographerUrl} target="_blank" rel="noreferrer">
          {photo.photographerName}
        </a>{' '}
        on{' '}
        <a className="underline underline-offset-2" href={photo.photoUrl} target="_blank" rel="noreferrer">
          Unsplash
        </a>
      </figcaption>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center lg:px-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Wellness Platform</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900 lg:text-5xl">Integrated care for mind, body, and lifestyle.</h1>
          <p className="mt-5 text-lg text-slate-600">A role-based wellness workspace for clients, professionals, operations teams, and admins.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/login" className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700">Login Demo</Link>
            <Link to="/pricing" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-white">View Pricing</Link>
          </div>
        </div>
        <figure className="relative h-[420px] overflow-hidden rounded-3xl shadow-lg">
          <img
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ease-in-out ${isNextHeroPhotoVisible ? 'opacity-0' : 'opacity-100'}`}
            src={heroPhoto.src}
            alt={heroPhoto.alt}
          />
          {nextHeroPhoto ? (
            <img
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ease-in-out ${isNextHeroPhotoVisible ? 'opacity-100' : 'opacity-0'}`}
              src={nextHeroPhoto.src}
              alt={nextHeroPhoto.alt}
            />
          ) : null}
          <div className={`transition-opacity duration-[1500ms] ease-in-out ${isNextHeroPhotoVisible ? 'opacity-0' : 'opacity-100'}`}>
            {renderAttribution(heroPhoto)}
          </div>
          {nextHeroPhoto ? (
            <div className={`transition-opacity duration-[1500ms] ease-in-out ${isNextHeroPhotoVisible ? 'opacity-100' : 'opacity-0'}`}>
              {renderAttribution(nextHeroPhoto)}
            </div>
          ) : null}
        </figure>
      </section>
    </div>
  );
}
