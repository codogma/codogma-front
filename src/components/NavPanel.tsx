'use client';
import ArticleIcon from '@mui/icons-material/Article';
import CategoryIcon from '@mui/icons-material/Category';
import { useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link';

export const NavPanel = () => {
  const theme = useTheme();
  const isMin = useMediaQuery(theme.breakpoints.down('lg'));
  const drawerWidth = isMin ? `calc(${theme.spacing(7)} + 1px)` : 200;

  return (
    <Box
      component='nav'
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label='mailbox folders'
    >
      <Drawer
        variant='permanent'
        sx={{
          display: { xs: 'none', sm: 'block' },
          flexShrink: 0,
          whiteSpace: 'nowrap',
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            top: 'initial',
            left: 'initial',
            bottom: 'initial',
          },
        }}
        open
      >
        <List>
          {['Articles', 'Categories'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  !isMin
                    ? {
                        justifyContent: 'initial',
                      }
                    : {
                        justifyContent: 'center',
                      },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                    },
                    !isMin
                      ? {
                          mr: 3,
                        }
                      : {
                          mr: 'auto',
                        },
                  ]}
                >
                  {index % 2 === 0 ? (
                    <Tooltip title={'Articles'}>
                      <Link href={`/articles`}>
                        <ArticleIcon />
                      </Link>
                    </Tooltip>
                  ) : (
                    <Tooltip title={'Categories'}>
                      <Link href={`/categories`}>
                        <CategoryIcon />
                      </Link>
                    </Tooltip>
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={[
                    !isMin
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};
