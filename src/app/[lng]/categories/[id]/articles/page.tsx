'use client';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useQuery } from '@tanstack/react-query';
import React, { FormEvent, useState } from 'react';

import Articles from '@/components/Articles';
import { getArticles, GetArticlesDTO } from '@/helpers/articleApi';

type PageParams = {
  id: number;
  lng: string;
};

type PageProps = {
  params: PageParams;
};

export default function Layout({ params: { id, lng } }: PageProps) {
  const categoryId = id;
  const resultsPerPage10 = 10;
  const resultsPerPage20 = 20;
  const resultsPerPage30 = 30;
  const minPages = 2;
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] =
    useState<number>(resultsPerPage10);
  const [searchValue, setSearchValue] = useState<string>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchType, setSearchType] = useState<'content' | 'tag'>('content');

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (type: 'content' | 'tag') => {
    setSearchType(type);
    setAnchorEl(null);
  };

  const { data, isPending } = useQuery<GetArticlesDTO>({
    queryKey: [
      'articles',
      categoryId,
      currentPage,
      resultsPerPage,
      searchType,
      searchValue,
    ],
    queryFn: () => {
      const byTag = searchType === 'tag' ? searchValue : undefined;
      const byContent = searchType === 'content' ? searchValue : undefined;
      return getArticles(
        categoryId,
        currentPage,
        resultsPerPage,
        byTag,
        byContent,
      );
    },
  });

  const articles = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchValue = formData.get('search') as string;
    setSearchValue(searchValue);
    setCurrentPage(0);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setCurrentPage(value - 1);
  };

  const handleArticlesCountChange = (event: SelectChangeEvent) => {
    setResultsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };

  const handlePageChangeInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = Number(event.target.value);
    if (value > 0 && value <= totalPages) {
      setCurrentPage(value - 1);
    }
    if (value === 0) {
      setCurrentPage(0);
    }
    if (value > totalPages) {
      setCurrentPage(totalPages - 1);
    }
  };

  return (
    <>
      <Paper
        component='form'
        sx={{
          p: '6px',
          m: '0px auto 8px auto',
          display: 'flex',
          alignItems: 'center',
        }}
        onSubmit={handleSearchSubmit}
      >
        <IconButton
          sx={{ p: '10px' }}
          aria-label='menu'
          onClick={handleMenuOpen}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => handleMenuClose(searchType)}
        >
          <MenuItem onClick={() => handleMenuClose('content')}>
            By content
          </MenuItem>
          <MenuItem onClick={() => handleMenuClose('tag')}>By tag</MenuItem>
        </Menu>
        <TextField
          label={`Search articles by ${searchType}`}
          id='search-input'
          sx={{ ml: 1, flex: 1 }}
          size='small'
          name='search'
        />
        <IconButton type='submit' sx={{ p: '10px' }} aria-label='search'>
          <SearchIcon />
        </IconButton>
      </Paper>
      <Articles lang={lng} articles={articles} loading={isPending} />
      {totalPages < minPages ? null : (
        <Stack
          spacing={2}
          sx={{
            display: 'flex',
            alignItems: 'center',
            pb: 5,
            pt: 5,
            justifyContent: 'center',
            flexDirection: 'row',
            '& .MuiTextField-root': { m: 0, ml: 1 },
            '& .MuiFormControl-root': { m: 0, ml: 1 },
          }}
        >
          <Pagination
            count={totalPages}
            page={currentPage + 1}
            onChange={handlePageChange}
            variant='outlined'
            shape='rounded'
          />
          <TextField
            label='Success'
            id='page'
            size='small'
            defaultValue={currentPage + 1}
            value={currentPage + 1}
            sx={{ width: 100 }}
            onChange={handlePageChangeInput}
          />
          <FormControl
            sx={{ width: 100 }}
            size='small'
            disabled={totalElements <= resultsPerPage10}
          >
            <InputLabel id='select-label'>View Results</InputLabel>
            <Select
              labelId='select-label'
              id='simple-select'
              value={String(resultsPerPage)}
              label='View Results'
              onChange={handleArticlesCountChange}
              variant='standard'
            >
              <MenuItem value={resultsPerPage10}>{resultsPerPage10}</MenuItem>
              {totalElements > resultsPerPage10 && (
                <MenuItem value={resultsPerPage20}>{resultsPerPage20}</MenuItem>
              )}
              {totalElements > resultsPerPage20 && (
                <MenuItem value={resultsPerPage30}>{resultsPerPage30}</MenuItem>
              )}
            </Select>
          </FormControl>
        </Stack>
      )}
    </>
  );
}
