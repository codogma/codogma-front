import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SearchIcon from '@mui/icons-material/Search';
import {
  Backdrop,
  Button,
  Dialog,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import { devConsoleWarn } from '@/helpers/devConsoleLogs';

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

  // Состояния для истории поиска
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<string[]>([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [selectedPrefix, setSelectedPrefix] = useState('articles:');
  const inputRef = useRef<HTMLInputElement>(null);

  // Определение префикса из пути
  const getPrefixFromPath = () => {
    const path = window.location.pathname;
    const prefixes = ['articles', 'categories', 'compilations', 'authors'];
    for (const prefix of prefixes) {
      if (path.includes(prefix)) return `${prefix}:`;
    }
    return 'articles:';
  };

  // Установка префикса при открытии диалога
  useEffect(() => {
    if (open) {
      setSelectedPrefix(getPrefixFromPath());
    }
  }, [open]);

  // Разбор поискового запроса
  const parseSearchQuery = (query: string) => {
    const searchValue = query;

    // Обработка тегов
    const isTagSearch =
      searchValue.startsWith('[') && searchValue.endsWith(']');

    return isTagSearch ? searchValue : `${selectedPrefix}${searchValue}`;
  };

  // Загрузка истории из localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
          setSearchHistory(parsedHistory);
          setFilteredHistory(parsedHistory);
        }
      } catch (e) {
        devConsoleWarn('Failed to parse search history', e);
      }
    }
  }, []);

  // Обновление отфильтрованной истории
  useEffect(() => {
    if (open) {
      setFilteredHistory(searchHistory);
    }
  }, [open, searchHistory]);

  // Обработчик поиска
  const handleSearch = (query: string, alreadyFormatted = false) => {
    const formattedQuery = alreadyFormatted
      ? query
      : parseSearchQuery(query.trim());
    if (!formattedQuery) return;
    onClose();
    setCurrentQuery('');

    // Сохраняем отформатированный запрос в историю
    if (!searchHistory.includes(formattedQuery)) {
      const newHistory = [formattedQuery, ...searchHistory].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }

    // Триггерим событие поиска (будет обработано в других компонентах)
    const event = new CustomEvent('performSearch', { detail: formattedQuery });
    window.dispatchEvent(event);
  };

  // Удаление элемента истории
  const handleDeleteItem = (index: number) => {
    const newHistory = [...searchHistory];
    newHistory.splice(index, 1);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  // Очистка истории
  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // Обработчик ввода
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentQuery(value);
    setFilteredHistory(
      value
        ? searchHistory.filter((item) =>
            item.toLowerCase().includes(value.toLowerCase()),
          )
        : searchHistory,
    );
  };

  // Автофокус на поле ввода при открытии диалога
  useEffect(() => {
    if (open) {
      devConsoleWarn('SearchDialog open focusing input...');
      // Увеличена задержка для гарантии работы
      const timer = setTimeout(() => {
        devConsoleWarn('Attempting focus on inputRef:', inputRef.current);
        if (inputRef.current) {
          inputRef.current.focus();
          devConsoleWarn('Focus set successfully');
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

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
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            maxHeight: '80vh',
            position: 'absolute',
            top: anchorEl
              ? `${anchorEl.getBoundingClientRect().top - anchorEl.getBoundingClientRect().height}px`
              : '50%',
            transform: 'translateX(-50%, -50%)',
          },
        }}
      >
        <TextField
          inputRef={inputRef}
          placeholder='Поиск'
          variant='outlined'
          size='small'
          fullWidth
          value={currentQuery}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch(currentQuery);
            }
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon fontSize='small' />
                  <Select
                    value={selectedPrefix}
                    onChange={(e) => setSelectedPrefix(e.target.value)}
                    variant='standard'
                    disableUnderline
                    sx={{
                      fontSize: '1rem',
                      '& .MuiSelect-select': {
                        paddingLeft: '8px',
                      },
                    }}
                  >
                    <MenuItem value='articles:'>articles:</MenuItem>
                    <MenuItem value='categories:'>categories:</MenuItem>
                    <MenuItem value='compilations:'>compilations:</MenuItem>
                    <MenuItem value='authors:'>authors:</MenuItem>
                  </Select>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={onClose} size='small'>
                    <CloseIcon fontSize='small' />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { padding: '0px 6px' },
            },
          }}
          sx={{
            '& fieldset': { border: 'none' },
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        />
        {filteredHistory.length > 0 && (
          <div
            style={{
              maxHeight: 'calc(70vh - 56px)',
              overflowY: 'auto',
              padding: '8px',
            }}
          >
            <List>
              {filteredHistory.map((item, index) => (
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
                    sx={{ paddingLeft: 0, paddingRight: 0 }}
                  >
                    <ListItemIcon sx={{ minWidth: 0 }}>
                      <AccessTimeIcon fontSize='small' />
                    </ListItemIcon>
                    <ListItemText
                      primary={item}
                      onClick={() => {
                        // Автоматически определяем префикс из элемента истории
                        const prefixMatch = item.match(
                          /^(articles:|categories:|compilations:|authors:)/,
                        );
                        if (prefixMatch) {
                          setSelectedPrefix(prefixMatch[0]);
                        }
                        // Указываем что запрос уже отформатирован
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
              ))}
            </List>
            <Button
              fullWidth
              variant='outlined'
              color='secondary'
              onClick={handleClearHistory}
            >
              Очистить историю
            </Button>
          </div>
        )}
      </Dialog>
    </>
  );
};
