import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import React, { FormEvent, useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { SearchType } from '@/types';

type SearchProps = {
  readonly lang: string;
  readonly onSearchType: (type: SearchType) => void;
  readonly onSearchValue: (value: string) => void;
};

export const Search = ({ lang, onSearchType, onSearchValue }: SearchProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchType, setSearchType] = useState<SearchType>(SearchType.CONTENT);
  const { t } = useTranslation(lang);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (type: SearchType) => {
    onSearchType(type);
    setSearchType(type);
    setAnchorEl(null);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchValue = formData.get('search') as string;
    onSearchValue(searchValue);
  };

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
      onSubmit={handleSearchSubmit}
      variant='outlined'
    >
      <IconButton sx={{ p: '10px' }} aria-label='menu' onClick={handleMenuOpen}>
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleMenuClose(searchType)}
      >
        <MenuItem onClick={() => handleMenuClose(SearchType.CONTENT)}>
          {t('searchContent')}
        </MenuItem>
        <MenuItem onClick={() => handleMenuClose(SearchType.TAG)}>
          {t('searchTags')}
        </MenuItem>
      </Menu>
      <TextField
        label={`${t('searchBy')}${t(searchType)}`}
        id='search-input'
        sx={{ ml: 1, flex: 1 }}
        size='small'
        name='search'
      />
      <IconButton type='submit' sx={{ p: '10px' }} aria-label='search'>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};
