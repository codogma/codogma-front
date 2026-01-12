'use client';
import { alpha, styled } from '@mui/material/styles';
import { ClickScrollPlugin, OverlayScrollbars } from 'overlayscrollbars';
import {
  OverlayScrollbarsComponent,
  OverlayScrollbarsComponentProps,
} from 'overlayscrollbars-react';
import React, {
  createContext,
  CSSProperties,
  ElementType,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

OverlayScrollbars.plugin([ClickScrollPlugin]);

interface CustomOSProps {
  readonly handleColor?: string;
  readonly handleDarkColor?: string;
  readonly handleHoverColor?: string;
  readonly handleDarkHoverColor?: string;
  readonly trackColor?: string;
  readonly trackDarkColor?: string;
  readonly trackHoverColor?: string;
  readonly trackDarkHoverColor?: string;
  readonly resetOnRouteChange?: boolean;
  readonly scrollKey?: string;
}

const CUSTOM_OS_PROPS: readonly (keyof CustomOSProps)[] = [
  'handleColor',
  'handleDarkColor',
  'handleHoverColor',
  'handleDarkHoverColor',
  'trackColor',
  'trackDarkColor',
  'trackHoverColor',
  'trackDarkHoverColor',
  'resetOnRouteChange',
  'scrollKey',
];

type ScrollbarProps = OverlayScrollbarsComponentProps<ElementType> &
  CustomOSProps & {
    readonly style?: CSSProperties;
  };

type ScrollContextType = {
  instance: OverlayScrollbars | undefined;
  scrollToTop: () => void;
};

const ScrollContext = createContext<ScrollContextType>({
  instance: undefined,
  scrollToTop: () => {},
});

const StyledOS = styled(OverlayScrollbarsComponent, {
  shouldForwardProp: (prop) =>
    !(CUSTOM_OS_PROPS as string[]).includes(prop as string),
})<ScrollbarProps>(
  ({
    handleColor,
    handleDarkColor,
    handleHoverColor,
    handleDarkHoverColor,
    trackColor,
    trackDarkColor,
    trackHoverColor,
    trackDarkHoverColor,
    theme,
  }) => ({
    '.os-scrollbar-handle': {
      backgroundColor: handleColor ?? theme.palette.grey[800],
      '&:hover': {
        backgroundColor: handleHoverColor ?? theme.palette.grey[700],
      },
    },
    '.os-scrollbar-track': {
      backgroundColor: trackColor ?? alpha(theme.palette.grey[800], 0.3),
      '&:hover': {
        backgroundColor: trackHoverColor ?? alpha(theme.palette.grey[700], 0.5),
      },
    },
    '.dark & .os-scrollbar-handle': {
      backgroundColor: handleDarkColor ?? theme.palette.grey[200],
      '&:hover': {
        backgroundColor: handleDarkHoverColor ?? theme.palette.grey[400],
      },
    },
    '.dark & .os-scrollbar-track': {
      backgroundColor: trackDarkColor ?? alpha(theme.palette.grey[200], 0.3),
      '&:hover': {
        backgroundColor:
          trackDarkHoverColor ?? alpha(theme.palette.grey[400], 0.5),
      },
    },
  }),
);

export const Scrollbar = ({
  defer,
  style,
  options,
  children,
  handleColor,
  handleDarkColor,
  handleHoverColor,
  handleDarkHoverColor,
  trackColor,
  trackDarkColor,
  trackHoverColor,
  trackDarkHoverColor,
  resetOnRouteChange = true,
  scrollKey,
  ...props
}: ScrollbarProps) => {
  const [scrollInstance, setScrollInstance] = useState<OverlayScrollbars>();
  const previousScrollKey = useRef<string | undefined>(scrollKey);

  const handleInitialized = useCallback((instance: OverlayScrollbars) => {
    setScrollInstance(instance);
  }, []);

  const scrollToTop = useCallback(() => {
    scrollInstance
      ?.elements()
      .viewport.scrollTo({ top: 0, behavior: 'smooth' });
  }, [scrollInstance]);

  useEffect(() => {
    if (
      resetOnRouteChange &&
      scrollInstance &&
      scrollKey &&
      previousScrollKey.current &&
      previousScrollKey.current !== scrollKey
    ) {
      scrollInstance.elements().viewport.scrollTo({ top: 0 });
    }
    previousScrollKey.current = scrollKey;
  }, [scrollKey, scrollInstance, resetOnRouteChange]);

  const scrollContextValue = useMemo(
    () => ({ instance: scrollInstance, scrollToTop }),
    [scrollInstance, scrollToTop],
  );

  return (
    <ScrollContext.Provider value={scrollContextValue}>
      <StyledOS
        defer={defer ?? true}
        options={
          options ?? {
            scrollbars: {
              clickScroll: true,
              dragScroll: true,
            },
          }
        }
        style={style ?? { height: '100vh' }}
        events={{ initialized: handleInitialized }}
        handleColor={handleColor}
        handleDarkColor={handleDarkColor}
        handleHoverColor={handleHoverColor}
        handleDarkHoverColor={handleDarkHoverColor}
        trackColor={trackColor}
        trackDarkColor={trackDarkColor}
        trackHoverColor={trackHoverColor}
        trackDarkHoverColor={trackDarkHoverColor}
        {...props}
      >
        {children}
      </StyledOS>
    </ScrollContext.Provider>
  );
};

export const useScrollContext = () => useContext(ScrollContext);
