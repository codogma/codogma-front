import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButtonOwnProps, MenuList } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { alpha, styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { useState } from 'react';

import { AddToCompilations } from '@/components/AddToCompilations';
import { ArticlesDnD } from '@/components/ArticlesDnD';
import { ButtonAlertDialog } from '@/components/ButtonAlertDialog';
import { EditCategory } from '@/components/EditCategory';
import { EditCompilation } from '@/components/EditCompilation';
import { SubscribeMenuItem } from '@/components/SubscribeMenuItem';
import { deleteCategory } from '@/helpers/categoryApi';
import { deleteCompilation } from '@/helpers/compilationApi';
import { getUserByUsername } from '@/helpers/userApi';
import {
  GetArticle,
  GetCategory,
  GetCompilation,
  GetUserDTO,
  Language,
  UserRole,
} from '@/types';

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '16px',
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.text.primary,
    border: '1px solid rgba(255, 255, 255, 0.15)',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      borderRadius: '8px',
      mx: 1,
      my: 0.5,
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        background:
          'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        transform: 'translateX(4px)',
      },
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
    ...theme.applyStyles('dark', {
      color: theme.palette.grey[300],
      border: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(25, 25, 25, 0.95)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
      '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
          color: theme.palette.grey[300],
        },
        '&:hover': {
          background:
            'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
        },
      },
    }),
  },
}));

interface MenuButtonProps extends IconButtonOwnProps {
  readonly article?: GetArticle;
  readonly lang: Language;
  readonly compilation?: GetCompilation;
  readonly user?: GetUserDTO;
  readonly category?: GetCategory;
  readonly refetch?: () => void;
}

export const MenuButton = ({
  article,
  lang,
  compilation,
  user,
  category,
  refetch,
  ...props
}: MenuButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { data: state, status } = useSession();
  const open = Boolean(anchorEl);
  const t = useTranslations();

  const { data } = useQuery<GetUserDTO>({
    queryKey: [
      'user',
      article?.username,
      user?.username,
      compilation?.ownerName,
    ],
    queryFn: () =>
      getUserByUsername(
        article?.username ?? user?.username ?? compilation?.ownerName,
      ),
    enabled: !!(article?.username ?? user?.username ?? compilation?.ownerName),
  });

  const userDTO: GetUserDTO = data as GetUserDTO;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteCompilation = (compilationId: number) => {
    deleteCompilation(compilationId).then(() => {
      handleClose();
      if (refetch) {
        refetch();
      }
    });
  };

  const handleDeleteCategory = (categoryId: number) => {
    deleteCategory(categoryId).then(() => {
      handleClose();
      if (refetch) {
        refetch();
      }
    });
  };

  return (
    <>
      <IconButton
        aria-label='more'
        id='long-button'
        color='inherit'
        size='small'
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='true'
        onClick={handleClick}
        sx={{
          height: '34px',
          width: '34px',
          borderRadius: '14px',
          p: 0.5,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '2px solid transparent',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            transform: 'scale(1.05)',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
            border: '2px solid rgba(102, 126, 234, 0.5)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
          ...props.sx,
        }}
        {...props}
      >
        <MoreVertIcon
          sx={{
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </IconButton>
      <StyledMenu
        id='demo-customized-menu'
        slotProps={{
          list: {
            'aria-labelledby': 'demo-customized-button',
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        keepMounted
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuList className='menu-list'>
          {article &&
            state?.user?.name === article?.username &&
            state?.user?.role === UserRole.ROLE_AUTHOR && (
              <ButtonAlertDialog
                article={article}
                lang={lang}
                onClose={handleClose}
              />
            )}
          {article &&
            status === 'authenticated' &&
            state?.user?.role !== UserRole.ROLE_ADMIN && (
              <AddToCompilations
                id={article.id}
                username={state.user?.name ?? ''}
                compilations={article.compilations}
                onClose={handleClose}
              />
            )}
          {userDTO && (
            <SubscribeMenuItem user={userDTO} onClose={handleClose} />
          )}
          {category && state?.user?.role === UserRole.ROLE_ADMIN && (
            <EditCategory
              id={category.id}
              lang={lang}
              refetch={refetch}
              onClose={handleClose}
            />
          )}
          {compilation && (
            <EditCompilation
              compilationData={compilation}
              onClose={handleClose}
            />
          )}
          {state?.user?.name === compilation?.ownerName && compilation && (
            <ArticlesDnD
              compilationData={compilation}
              onClose={handleClose}
              refetch={refetch}
            />
          )}
          {state?.user?.name === compilation?.ownerName && compilation && (
            <MenuItem
              onClick={() => handleDeleteCompilation(compilation.id)}
              disableRipple
            >
              <Typography textAlign='center'>
                {t('deleteCompilation')}
              </Typography>
            </MenuItem>
          )}
          {state?.user?.role === UserRole.ROLE_ADMIN && category && (
            <MenuItem
              onClick={() => handleDeleteCategory(category.id)}
              disableRipple
            >
              <Typography textAlign='center'>{t('deleteCategory')}</Typography>
            </MenuItem>
          )}
        </MenuList>
      </StyledMenu>
    </>
  );
};
