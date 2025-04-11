import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';

import { useTranslation } from '@/app/i18n/client';

type PaginationProps = {
  readonly lang: string;
  readonly totalPages: number;
  readonly totalElements: number;
  readonly resultsPerPageStart?: number;
  readonly onCurrentPageChange: (value: number) => void;
  readonly onResultsPerPageChange: (value: number) => void;
};

export const CustomPagination = ({
  lang,
  totalPages = 0,
  totalElements = 0,
  resultsPerPageStart = 10,
  onCurrentPageChange,
  onResultsPerPageChange,
}: PaginationProps) => {
  const resultsPerPage1 = resultsPerPageStart;
  const resultsPerPage2 = resultsPerPageStart * 2;
  const resultsPerPage3 = resultsPerPageStart * 3;
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] =
    useState<number>(resultsPerPageStart);
  const { t } = useTranslation(lang);

  useEffect(() => {
    onCurrentPageChange(currentPage);
  }, [currentPage, onCurrentPageChange]);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setCurrentPage(value - 1);
  };

  const handleResultsPerPageChange = (event: SelectChangeEvent) => {
    const perPage = Number(event.target.value);
    setResultsPerPage(perPage);
    setCurrentPage(0);
    onResultsPerPageChange(perPage);
  };

  const handlePageChangeInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = Number(event.target.value);
    let newPage = 0;
    if (value > 0 && value <= totalPages) {
      newPage = value - 1;
    } else if (value > totalPages) {
      newPage = totalPages - 1;
    }
    setCurrentPage(newPage);
  };

  return (
    <>
      {totalElements <= resultsPerPageStart ? null : (
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
            label={t('layout')}
            id='page'
            size='small'
            value={currentPage + 1}
            sx={{ width: 100 }}
            onChange={handlePageChangeInput}
          />
          <FormControl
            sx={{ width: 150 }}
            size='small'
            disabled={totalElements <= resultsPerPage1}
          >
            <InputLabel id='select-label'>{t('paginationPages')}</InputLabel>
            <Select
              labelId='select-label'
              id='simple-select'
              value={String(resultsPerPage)}
              label='View Results'
              onChange={handleResultsPerPageChange}
              variant='standard'
            >
              <MenuItem value={resultsPerPage1}>{resultsPerPage1}</MenuItem>
              {totalElements > resultsPerPage1 && (
                <MenuItem value={resultsPerPage2}>{resultsPerPage2}</MenuItem>
              )}
              {totalElements > resultsPerPage2 && (
                <MenuItem value={resultsPerPage3}>{resultsPerPage3}</MenuItem>
              )}
            </Select>
          </FormControl>
        </Stack>
      )}
    </>
  );
};
