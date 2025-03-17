import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useEventListener } from '@/helpers/useEventListener';
import { SearchType } from '@/types';

type SearchProps = {
  readonly lang: string;
  readonly onSearchType: (type: SearchType) => void;
  readonly onSearchValue: (value: string) => void;
};

const SEARCH_PARAMS = {
  TYPE: 'type',
  VALUE: 'value',
} as const;

export const Search = ({ lang, onSearchType, onSearchValue }: SearchProps) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [searchType, setSearchType] = useState<SearchType>(SearchType.CONTENT);
  const [searchValue, setSearchValue] = useState('');
  const { t } = useTranslation(lang);

  const getSearchParams = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      [SEARCH_PARAMS.TYPE]: params.get(SEARCH_PARAMS.TYPE),
      [SEARCH_PARAMS.VALUE]: params.get(SEARCH_PARAMS.VALUE),
    };
  }, []);

  const updateSearchParams = useCallback((params: Record<string, string>) => {
    const newParams = new URLSearchParams(window.location.search);

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    const newUrl = `${window.location.pathname}?${newParams.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, []);

  const handleSearchChange = useCallback(() => {
    const { type, value } = getSearchParams();

    if (type && Object.values(SearchType).includes(type as SearchType)) {
      const newType = type as SearchType;
      setSearchType(newType);
      onSearchType(newType);
    }
    if (value) {
      setSearchValue(value);
      onSearchValue(value);
      searchInputRef.current?.focus();
    } else {
      setSearchType(SearchType.CONTENT);
      setSearchValue('');
      onSearchType(SearchType.CONTENT);
      onSearchValue('');
    }
  }, [getSearchParams, onSearchType, onSearchValue]);

  useEffect(() => {
    handleSearchChange();
  }, [handleSearchChange]);

  useEventListener('searchOrHashChange', () => handleSearchChange());

  const handleMenuOpen = useCallback((e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleMenuSelect = useCallback(
    (type: SearchType) => {
      handleMenuClose();
      setSearchType(type);
      if (searchValue) onSearchType(type);
      updateSearchParams({
        [SEARCH_PARAMS.TYPE]: type,
        [SEARCH_PARAMS.VALUE]: searchValue,
      });
    },
    [handleMenuClose, onSearchType, searchValue, updateSearchParams],
  );

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      updateSearchParams({
        [SEARCH_PARAMS.TYPE]: searchType,
        [SEARCH_PARAMS.VALUE]: searchValue,
      });
      onSearchValue(searchValue);
    },
    [onSearchValue, searchType, searchValue, updateSearchParams],
  );

  return (
    <Paper
      component='form'
      sx={{
        position: 'sticky',
        top: '64px',
        zIndex: 10,
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        p: '6px',
        m: '0px auto 8px auto',
        display: 'flex',
        alignItems: 'center',
      }}
      onSubmit={handleSubmit}
      variant='outlined'
    >
      <IconButton sx={{ p: '10px' }} aria-label='menu' onClick={handleMenuOpen}>
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleMenuSelect(SearchType.CONTENT)}>
          {t('searchContent')}
        </MenuItem>
        <MenuItem onClick={() => handleMenuSelect(SearchType.TAG)}>
          {t('searchTags')}
        </MenuItem>
      </Menu>
      <TextField
        label={`${t('searchBy')}${t(searchType)}`}
        id='search-input'
        inputRef={searchInputRef}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        sx={{ ml: 1, flex: 1 }}
        size='small'
      />
      <IconButton type='submit' sx={{ p: '10px' }} aria-label='search'>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};
