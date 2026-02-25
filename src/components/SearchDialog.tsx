import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SearchIcon from '@mui/icons-material/Search';
import {
  Backdrop,
  Box,
  Button,
  Chip,
  Dialog,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import {
  formatSearchQueryForDisplay,
  parseSearchQuery,
  SearchFilterType,
  validateSearchQuery,
} from '@/utils/parseSearchQuery';

export const SearchDialog = ({
  open,
  onClose,
  anchorEl,
}: {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly anchorEl: HTMLButtonElement | null;
}) => {
  const theme = useTheme();
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  // Search state
  const [currentQuery, setCurrentQuery] = useState('');
  const [selectedPrefix, setSelectedPrefix] =
    useState<SearchFilterType>('articles');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<string[]>([]);
  const [showSyntaxHelp, setShowSyntaxHelp] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Available prefixes for autocomplete
  const prefixOptions = [
    { label: 'articles:', value: 'articles' },
    { label: 'categories:', value: 'categories' },
    { label: 'compilations:', value: 'compilations' },
    { label: 'authors:', value: 'authors' },
    { label: 'tags:', value: 'tags' },
    { label: 'content:', value: 'content' },
    { label: 'info:', value: 'info' },
  ];

  // Set prefix when dialog opens based on current route
  useEffect(() => {
    if (open) {
      const path = pathname;
      if (path.includes('/articles')) setSelectedPrefix('articles');
      else if (path.includes('/categories')) setSelectedPrefix('categories');
      else if (path.includes('/compilations'))
        setSelectedPrefix('compilations');
      else if (path.includes('/authors') || path.includes('/users'))
        setSelectedPrefix('authors');
      else setSelectedPrefix('articles');
    }
  }, [open, pathname]);

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory) as unknown[];
        if (Array.isArray(parsedHistory)) {
          setSearchHistory(parsedHistory as string[]);
          setFilteredHistory(parsedHistory as string[]);
        }
      } catch {
        // Silently ignore parse errors
      }
    }
  }, []);

  // Update filtered history when dialog opens
  useEffect(() => {
    if (open) {
      setFilteredHistory(searchHistory);
    }
  }, [open, searchHistory]);

  // Auto-focus on input when dialog opens
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Hide syntax help when user starts typing
  useEffect(() => {
    if (currentQuery.trim()) {
      setShowSyntaxHelp(false);
    }
  }, [currentQuery]);

  // Format query with prefix if needed
  const formatQuery = (query: string): string => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) return '';

    // Tag search - no prefix needed
    if (trimmedQuery.startsWith('[') && trimmedQuery.endsWith(']')) {
      return trimmedQuery;
    }

    // Advanced query with operators or multiple prefixes - use as-is
    if (
      /\b(AND|OR|NOT)\b/i.test(trimmedQuery) ||
      /\b[a-z]+:/i.test(trimmedQuery)
    ) {
      return trimmedQuery;
    }

    // Simple query - add prefix
    return `${selectedPrefix}:${trimmedQuery}`;
  };

  // Handle search execution
  const handleSearch = (query: string, alreadyFormatted = false) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    const formattedQuery = alreadyFormatted ? query : formatQuery(query);

    // Validate: query must have non-empty value after prefix
    const prefixMatch = /^([a-z]+):(.*)$/i.exec(formattedQuery);
    if (prefixMatch && !prefixMatch[2].trim()) {
      setValidationErrors(['Value after prefix cannot be empty']);
      return;
    }

    // Validate before searching
    const validation = validateSearchQuery(formattedQuery);
    if (!validation.valid) {
      setValidationErrors(validation.errors);
      return;
    }

    // Parse query to determine search type
    const parsed = parseSearchQuery(formattedQuery);
    const searchType =
      parsed.type === 'tag' || parsed.filters?.some((f) => f.type === 'tags')
        ? 'tag'
        : 'content';

    // Determine target path from the query prefix (not selectedPrefix)
    let targetPath = pathname;

    // Extract prefix from query to determine route
    const queryPrefixMatch = /^([a-z]+):/i.exec(formattedQuery);
    const prefixToRoute: Record<string, string> = {
      articles: '/articles',
      categories: '/categories',
      compilations: '/compilations',
      authors: '/authors',
    };

    if (queryPrefixMatch) {
      const queryPrefix = queryPrefixMatch[1].toLowerCase();
      const routeForPrefix = prefixToRoute[queryPrefix];
      if (routeForPrefix && !pathname.includes(routeForPrefix)) {
        targetPath = routeForPrefix;
      }
    }

    // Update URL with all required parameters and navigate
    const newParams = new URLSearchParams();
    newParams.set('type', searchType);
    newParams.set('q', formattedQuery);
    newParams.set('value', formattedQuery);

    const newUrl = `${targetPath}?${newParams.toString()}`;

    // Use Next.js router for proper navigation
    router.push(newUrl);

    // Dispatch event for Search component
    const event = new CustomEvent('performSearch', {
      detail: {
        query: formattedQuery,
        parsed,
      },
    });
    window.dispatchEvent(event);

    // Save to history
    if (!searchHistory.includes(formattedQuery)) {
      const newHistory = [formattedQuery, ...searchHistory].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }

    // Close dialog
    setCurrentQuery('');
    onClose();
  };

  // Handle query input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentQuery(value);

    // Filter history
    if (value) {
      setFilteredHistory(
        searchHistory.filter((item) =>
          item.toLowerCase().includes(value.toLowerCase()),
        ),
      );
    } else {
      setFilteredHistory(searchHistory);
    }
  };

  // Handle history item deletion
  const handleDeleteItem = (index: number) => {
    const newHistory = [...searchHistory];
    newHistory.splice(index, 1);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  // Clear search history
  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // Extract prefix from history item
  const extractPrefix = (item: string): SearchFilterType | null => {
    const match =
      /^(articles|categories|compilations|authors|tags|content|info):/i.exec(
        item,
      );
    return match ? (match[1].toLowerCase() as SearchFilterType) : null;
  };

  // Format query for display with syntax highlighting
  const _displayQuery = formatSearchQueryForDisplay(currentQuery);

  return (
    <>
      <Backdrop
        open={open}
        onClick={() => {
          setCurrentQuery('');
          onClose();
        }}
        sx={{
          zIndex: theme.zIndex.modal - 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      />
      <Dialog
        open={open}
        onClose={() => {
          setCurrentQuery('');
          onClose();
        }}
        sx={{
          '& .MuiPaper-root': {
            width: '80vw',
            maxWidth: '800px',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            maxHeight: '80vh',
            position: 'absolute',
            top: anchorEl
              ? `${anchorEl.getBoundingClientRect().top - anchorEl.getBoundingClientRect().height}px`
              : '50%',
            left: '50%',
            transform: 'translateX(-50%)',
          },
        }}
      >
        {/* Search Input */}
        <TextField
          inputRef={inputRef}
          placeholder={t('searchPlaceholder')}
          variant='outlined'
          size='small'
          fullWidth
          value={currentQuery}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              // Prevent search if query is just a prefix with no value
              if (/^[a-z]+:$/i.test(currentQuery.trim())) {
                setValidationErrors(['Value after prefix cannot be empty']);
                return;
              }
              handleSearch(currentQuery);
            }
          }}
          error={validationErrors.length > 0}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon fontSize='small' />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (inputRef.current) {
                      inputRef.current.blur();
                    }
                    setShowSyntaxHelp((prev) => !prev);
                  }}
                  size='small'
                  title='Search syntax help'
                  tabIndex={-1}
                >
                  <HelpOutlineIcon fontSize='small' />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setCurrentQuery('');
                    inputRef.current?.focus();
                  }}
                  size='small'
                >
                  <CloseIcon fontSize='small' />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& fieldset': { border: 'none' },
            borderBottom: '1px solid',
            borderColor: validationErrors.length > 0 ? 'error.main' : 'divider',
          }}
        />

        {/* Prefix Selection Buttons */}
        {!showSyntaxHelp && (
          <Box
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Typography
              variant='caption'
              color='text.secondary'
              sx={{ width: '100%', mb: 0.5 }}
            >
              Select prefix:
            </Typography>
            {prefixOptions.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                onClick={() => {
                  setSelectedPrefix(option.value as SearchFilterType);
                  inputRef.current?.focus();
                }}
                color={selectedPrefix === option.value ? 'primary' : 'default'}
                size='small'
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Box
            sx={{ px: 2, py: 1, bgcolor: 'error.lighter', color: 'error.main' }}
          >
            <Typography variant='caption' component='div'>
              {validationErrors.join(', ')}
            </Typography>
          </Box>
        )}

        {/* Syntax Help */}
        {showSyntaxHelp && (
          <Box
            sx={{
              p: 2,
              bgcolor: 'background.default',
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant='subtitle2' gutterBottom>
              Search Syntax
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              <Chip label='articles:react' size='small' />
              <Chip label='tags:typescript' size='small' />
              <Chip label='authors:username' size='small' />
              <Chip label='[tag]' size='small' />
              <Chip label='query AND other' size='small' />
              <Chip label='query OR other' size='small' />
              <Chip label='query NOT excluded' size='small' />
              <Chip label='"exact phrase"' size='small' />
            </Box>
          </Box>
        )}

        {/* Search History */}
        {filteredHistory.length > 0 && (
          <div
            style={{
              maxHeight: 'calc(70vh - 120px)',
              overflowY: 'auto',
              padding: '8px',
            }}
          >
            <List>
              {filteredHistory.map((item, index) => {
                const prefix = extractPrefix(item);
                const formatted = formatSearchQueryForDisplay(item);

                return (
                  <React.Fragment key={index}>
                    <ListItem
                      secondaryAction={
                        <IconButton
                          edge='end'
                          onClick={() => handleDeleteItem(index)}
                          size='small'
                        >
                          <DeleteForeverIcon fontSize='small' />
                        </IconButton>
                      }
                      sx={{
                        paddingLeft: 0,
                        paddingRight: 0,
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 0, mx: 1 }}>
                        <AccessTimeIcon fontSize='small' color='action' />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            {formatted.parts.map((part, i) => (
                              <Typography
                                key={i}
                                component='span'
                                variant='body2'
                                sx={{
                                  color:
                                    part.type === 'prefix'
                                      ? 'primary.main'
                                      : part.type === 'operator'
                                        ? 'secondary.main'
                                        : part.type === 'tag'
                                          ? 'success.main'
                                          : 'text.primary',
                                  fontWeight:
                                    part.type === 'prefix' ? 600 : 400,
                                }}
                              >
                                {part.value}
                              </Typography>
                            ))}
                          </Box>
                        }
                        onClick={() => {
                          // Set prefix from history item if available
                          if (prefix) {
                            setSelectedPrefix(prefix);
                          }
                          // Execute search with existing query
                          handleSearch(item, true);
                        }}
                        sx={{
                          cursor: 'pointer',
                          marginLeft: '8px',
                          marginRight: 0,
                        }}
                      />
                    </ListItem>
                    {index < filteredHistory.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </List>
            <Button
              fullWidth
              variant='outlined'
              color='secondary'
              onClick={handleClearHistory}
              size='small'
            >
              {t('clearHistory') || 'Clear History'}
            </Button>
          </div>
        )}
      </Dialog>
    </>
  );
};
