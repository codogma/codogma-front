import SearchIcon from '@mui/icons-material/Search';
import { SxProps, Theme } from '@mui/material';
import Button, { ButtonProps } from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface SearchButtonProps extends ButtonProps {
  readonly onRef?: React.Ref<HTMLButtonElement>;
  readonly sx?: SxProps<Theme>;
}

type SxItem = Exclude<SxProps<Theme>, readonly unknown[]>;

function normalizeSx(sx?: SxProps<Theme>): readonly SxItem[] {
  if (!sx) return [];
  return Array.isArray(sx) ? (sx as readonly SxItem[]) : [sx as SxItem];
}

export const SearchButton = ({
  onClick,
  onRef,
  sx,
  ...props
}: SearchButtonProps) => {
  const t = useTranslations();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // 1) Стабильное начальное значение (избегает SSR/гидрационной разницы).
  //    По умолчанию — "Ctrl+/" (без доступа к navigator на сервере).
  const [shortcut, setShortcut] = useState<string>('Ctrl+/');

  // Вспомогательная функция для определения Mac-платформы:
  const isMacPlatform = useCallback(() => {
    if (typeof navigator === 'undefined') return false;
    const userAgent = navigator.userAgent.toLowerCase();
    return (
      userAgent.includes('macintosh') ||
      userAgent.includes('mac os') ||
      /iPad|iPhone|iPod/.test(navigator.userAgent)
    );
  }, []);

  // После монтирования корректируем отображаемый ярлык (⌘/ на Mac).
  useEffect(() => {
    if (isMacPlatform()) {
      setShortcut('⌘/');
    } else {
      setShortcut('Ctrl+/');
    }
  }, [isMacPlatform]);

  // Соединяем внешний ref (onRef) и внутренний buttonRef.
  const setRefs = useCallback(
    (node: HTMLButtonElement | null) => {
      buttonRef.current = node;
      if (!onRef) return;
      if (typeof onRef === 'function') {
        onRef(node);
      } else {
        // onRef может быть RefObject
        try {
          (onRef as React.MutableRefObject<HTMLButtonElement | null>).current =
            node;
        } catch {
          // безопасно игнорируем, если присвоение невозможно
        }
      }
    },
    [onRef],
  );

  // Обработчик горячей клавиши Ctrl/Cmd + /
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // проверяем комбинацию
      const isSlash = e.key === '/';
      const modifier = e.ctrlKey || e.metaKey; // ctrl (win/linux) или cmd (mac)
      if (!isSlash || !modifier || e.altKey || e.shiftKey) return;

      // не перехватываем, если фокус в input/textarea/select или contenteditable
      const active = document.activeElement as HTMLElement | null;
      if (active) {
        const tag = active.tagName;
        if (
          tag === 'INPUT' ||
          tag === 'TEXTAREA' ||
          tag === 'SELECT' ||
          active.isContentEditable
        ) {
          return;
        }
      }

      // предотвращаем дефолт (например, браузерные действия)
      e.preventDefault();

      // не вызываем, если кнопка отсутствует или disabled
      if (buttonRef.current && !buttonRef.current.disabled) {
        buttonRef.current.click();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const extraSx = normalizeSx(sx);

  return (
    <Button
      ref={setRefs}
      onClick={onClick}
      disabled={!onClick}
      aria-labelledby='app-search-label'
      // подсказка для ассистивных технологий: aria-keyshortcuts
      aria-keyshortcuts={shortcut ?? undefined}
      sx={[
        (theme) => ({
          height: 30,
          width: 160,
          margin: 0,
          paddingLeft: theme.spacing(1),
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          position: 'relative',
          color: 'inherit',
          fontSize: theme.typography.pxToRem(14),
          border: `1px solid ${theme.palette.grey[200]}`,
          borderRadius: theme.shape.borderRadius,
          '&:hover': {
            backgroundColor: alpha(theme.palette.grey[100], 0.5),
            boxShadow: 'none',
            color:
              theme.palette.mode === 'dark'
                ? theme.palette.grey[900]
                : theme.palette.text.secondary,
          },
          '&:focus-visible': {
            outline: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
            outlineOffset: '2px',
          },
        }),
        ...extraSx,
      ]}
      {...props}
    >
      <SearchIcon color='inherit' sx={{ fontSize: '1.125rem' }} />
      <span
        id='app-search-label'
        style={{
          marginRight: 'auto',
          marginBottom: '1px',
          color: 'inherit',
          opacity: 0.7,
          lineHeight: 1,
        }}
      >
        {t('search')}
      </span>
      {shortcut && (
        <kbd
          aria-hidden='true'
          style={{
            all: 'unset',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            lineHeight: '19px',
            marginLeft: '4px',
            border: '1px solid',
            borderColor: 'inherit',
            backgroundColor: 'inherit',
            padding: '0 4px',
            borderRadius: 7,
          }}
        >
          {shortcut}
        </kbd>
      )}
    </Button>
  );
};
