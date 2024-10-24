'use client';
import ArticleIcon from '@mui/icons-material/Article';
import CategoryIcon from '@mui/icons-material/Category';
import { Paper } from '@mui/material';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link';
import * as React from 'react';

export default function FixedBottomNavigation() {
  return (
    <Box sx={{ pb: 7 }}>
      <Drawer
        variant='permanent'
        sx={{
          display: { xs: 'block', sm: 'none' },
          flexShrink: 0,
          whiteSpace: 'nowrap',
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 200,
            top: 'initial',
            left: 'initial',
            bottom: 'initial',
          },
        }}
        open
      >
        <Paper
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
          elevation={3}
        >
          <BottomNavigation>
            <Tooltip title={'Articles'}>
              <Link href={`/articles`}>
                <BottomNavigationAction
                  label='Articles'
                  icon={<ArticleIcon />}
                />
              </Link>
            </Tooltip>
            <Tooltip title={'Categories'}>
              <Link href={`/categories`}>
                <BottomNavigationAction
                  label='Categories'
                  icon={<CategoryIcon />}
                />
              </Link>
            </Tooltip>
          </BottomNavigation>
        </Paper>
      </Drawer>
    </Box>
  );
}
