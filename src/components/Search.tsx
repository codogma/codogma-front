import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { useTranslations } from 'next-intl';
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useEventListener } from '@/helpers/useEventListener';
import { SearchType } from '@/types';
import { ParsedSearchQuery, parseSearchQuery } from '@/utils/parseSearchQuery';

type SearchProps = {
  readonly onSearchType: (type: SearchType) => void;
  readonly onSearchValue: (value: string) => void;
};

const SEARCH_PARAMS = {
  TYPE: 'type',
  VALUE: 'value',
  QUERY: 'q',
} as const;

export const Search = ({ onSearchType, onSearchValue }: SearchProps) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [searchType, setSearchType] = useState<SearchType>(SearchType.CONTENT);
  const [searchValue, setSearchValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const t = useTranslations();

  const getSearchParams = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      type: params.get(SEARCH_PARAMS.TYPE),
      value: params.get(SEARCH_PARAMS.VALUE),
      query: params.get(SEARCH_PARAMS.QUERY),
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
    window.scrollTo({
      top: 0,
      behavior: 'instant',
    });
    const { type, value, query: fullQuery } = getSearchParams();

    // Handle advanced query syntax
    if (fullQuery) {
      setSearchQuery(fullQuery);
      const parsed = parseSearchQuery(fullQuery);

      // Extract search type and value from parsed query
      if (parsed.type === 'tag') {
        setSearchType(SearchType.TAG);
        onSearchType(SearchType.TAG);
        setSearchValue(parsed.tagValue || '');
        onSearchValue(parsed.tagValue || '');
      } else if (parsed.type === 'simple') {
        setSearchValue(parsed.value || '');
        onSearchValue(parsed.value || '');
        if (type && Object.values(SearchType).includes(type as SearchType)) {
          const newType = type as SearchType;
          setSearchType(newType);
          onSearchType(newType);
        }
      } else if (parsed.type === 'advanced') {
        // For advanced queries, try to extract primary search value
        const tagFilter = parsed.filters?.find((f) => f.type === 'tags');
        const contentFilter = parsed.filters?.find(
          (f) => f.type === 'content' || f.type === 'articles',
        );

        if (tagFilter) {
          setSearchType(SearchType.TAG);
          onSearchType(SearchType.TAG);
          setSearchValue(tagFilter.value);
          onSearchValue(tagFilter.value);
        } else if (contentFilter) {
          setSearchValue(contentFilter.value);
          onSearchValue(contentFilter.value);
          if (type && Object.values(SearchType).includes(type as SearchType)) {
            const newType = type as SearchType;
            setSearchType(newType);
            onSearchType(newType);
          }
        } else {
          // Fallback to first filter value
          const firstFilter = parsed.filters?.[0];
          if (firstFilter) {
            setSearchValue(firstFilter.value);
            onSearchValue(firstFilter.value);
          }
        }
      }
    } else if (value) {
      // Legacy simple search
      setSearchQuery(value);
      setSearchValue(value);
      onSearchValue(value);

      if (type && Object.values(SearchType).includes(type as SearchType)) {
        const newType = type as SearchType;
        setSearchType(newType);
        onSearchType(newType);
      }
    } else {
      // No search
      setSearchQuery('');
      setSearchValue('');
      setSearchType(SearchType.CONTENT);
      onSearchType(SearchType.CONTENT);
      onSearchValue('');
    }

    // Focus input if there's a search value
    if (fullQuery || value) {
      searchInputRef.current?.focus();
    }
  }, [getSearchParams, onSearchType, onSearchValue]);

  useEffect(() => {
    handleSearchChange();
  }, [handleSearchChange]);

  useEventListener('searchOrHashChange', () => handleSearchChange());

  // Listen for performSearch events from SearchDialog
  useEventListener('performSearch', (event) => {
    const customEvent = event as CustomEvent<{
      query: string;
      parsed: ParsedSearchQuery;
    }>;
    const { query, parsed } = customEvent.detail;

    setSearchQuery(query);

    // Extract search value from parsed query
    if (parsed.type === 'tag') {
      setSearchType(SearchType.TAG);
      onSearchType(SearchType.TAG);
      setSearchValue(parsed.tagValue || '');
      onSearchValue(parsed.tagValue || '');
    } else if (parsed.type === 'simple') {
      setSearchValue(parsed.value || '');
      onSearchValue(parsed.value || '');
    } else if (parsed.type === 'advanced') {
      const contentFilter = parsed.filters?.find(
        (f) => f.type === 'content' || f.type === 'articles',
      );
      if (contentFilter) {
        setSearchValue(contentFilter.value);
        onSearchValue(contentFilter.value);
      }
    }
  });

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
      if (searchQuery || searchValue) {
        onSearchType(type);
        updateSearchParams({
          [SEARCH_PARAMS.TYPE]: type,
          [SEARCH_PARAMS.QUERY]: searchQuery,
          [SEARCH_PARAMS.VALUE]: searchQuery || searchValue,
        });
      }
    },
    [
      handleMenuClose,
      onSearchType,
      searchQuery,
      searchValue,
      updateSearchParams,
    ],
  );

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Use advanced query if present, otherwise use simple value
      const queryToUse = searchQuery || searchValue;

      updateSearchParams({
        [SEARCH_PARAMS.TYPE]: searchType,
        [SEARCH_PARAMS.QUERY]: queryToUse,
        [SEARCH_PARAMS.VALUE]: queryToUse,
      });
      onSearchValue(queryToUse);
    },
    [onSearchValue, searchType, searchQuery, searchValue, updateSearchParams],
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchValue('');
    updateSearchParams({
      [SEARCH_PARAMS.TYPE]: '',
      [SEARCH_PARAMS.QUERY]: '',
      [SEARCH_PARAMS.VALUE]: '',
    });
    onSearchValue('');
    searchInputRef.current?.focus();
  }, [updateSearchParams, onSearchValue]);

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
        value={searchQuery || searchValue}
        onChange={(e) => {
          const newValue = e.target.value;
          setSearchQuery(newValue);
          setSearchValue(newValue);
          const parsed = parseSearchQuery(newValue);

          // Update type if tag detected
          if (parsed.type === 'tag') {
            setSearchType(SearchType.TAG);
            onSearchType(SearchType.TAG);
          }
        }}
        sx={{ ml: 1, flex: 1 }}
        size='small'
        placeholder='Try "articles:react AND tags:typescript" or [tag]'
      />
      {(searchQuery || searchValue) && (
        <IconButton onClick={handleClearSearch} size='small' sx={{ p: '8px' }}>
          <CloseIcon fontSize='small' />
        </IconButton>
      )}
      <IconButton type='submit' sx={{ p: '10px' }} aria-label='search'>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};
