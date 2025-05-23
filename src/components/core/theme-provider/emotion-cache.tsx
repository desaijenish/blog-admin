import * as React from 'react';
import createCache from '@emotion/cache';
import type { EmotionCache, Options as OptionsOfCreateCache } from '@emotion/cache';
import { CacheProvider as DefaultCacheProvider } from '@emotion/react';

interface Registry {
  cache: EmotionCache;
  flush: () => { name: string; isGlobal: boolean }[];
}

export interface EmotionCacheProviderProps {
  options: Omit<OptionsOfCreateCache, 'insertionPoint'>;
  CacheProvider?: (props: { value: EmotionCache; children: React.ReactNode }) => React.JSX.Element | null;
  children: React.ReactNode;
}

export default function EmotionCacheProvider(props: EmotionCacheProviderProps): React.JSX.Element {
  const { options, CacheProvider = DefaultCacheProvider, children } = props;

  const [registry] = React.useState<Registry>(() => {
    const cache = createCache(options);
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: { name: string; isGlobal: boolean }[] = [];
    cache.insert = (...args) => {
      const [selector, serialized] = args;

      if (cache.inserted[serialized.name] === undefined) {
        inserted.push({ name: serialized.name, isGlobal: !selector });
      }

      return prevInsert(...args);
    };
    const flush = (): { name: string; isGlobal: boolean }[] => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  // Mimic server-side insertion using an effect hook
  React.useEffect(() => {
    const inserted = registry.flush();

    if (inserted.length > 0) {
      let styles = '';
      let dataEmotionAttribute = registry.cache.key;

      const globals: { name: any; style: any }[] = [];

      inserted.forEach(({ name, isGlobal }:any) => {
        const style = registry.cache.inserted[name];

        if (typeof style !== 'boolean') {
          if (isGlobal) {
            globals.push({ name ,style});
          } else {
            styles += style;
            dataEmotionAttribute += ` ${name}`;
          }
        }
      });

      // Inject global styles and local styles into the document head
      globals.forEach(({ name, style }) => {
        const globalStyleElement = document.createElement('style');
        globalStyleElement.setAttribute('data-emotion', `${registry.cache.key}-global ${name}`);
        globalStyleElement.innerHTML = style;
        document.head.appendChild(globalStyleElement);
      });

      if (styles) {
        const styleElement = document.createElement('style');
        styleElement.setAttribute('data-emotion', dataEmotionAttribute);
        styleElement.innerHTML = styles;
        document.head.appendChild(styleElement);
      }
    }
  }, [registry]);

  return <CacheProvider value={registry.cache}>{children}</CacheProvider>;
}
