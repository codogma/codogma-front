import MoreVertIcon from '@mui/icons-material/MoreVert';
import { MenuList } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { alpha, styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import { useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { AddToCompilations } from '@/components/AddToCompilations';
import { ArticlesDnD } from '@/components/ArticlesDnD';
import { useAuth } from '@/components/AuthProvider';
import ButtonAlertDialog from '@/components/ButtonAlertDialog';
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
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: 'rgb(55, 65, 81)',
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
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
    }),
  },
}));

type MenuButtonProps = {
  readonly article?: GetArticle;
  readonly lang: Language;
  readonly compilation?: GetCompilation;
  readonly user?: GetUserDTO;
  readonly category?: GetCategory;
  readonly refetch?: () => void;
};

export default function MenuButton({
  article,
  lang,
  compilation,
  user,
  category,
  refetch,
}: MenuButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { state } = useAuth();
  const open = Boolean(anchorEl);
  const { t } = useTranslation(lang);

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
  });

  const userDTO: GetUserDTO = data as GetUserDTO;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (compilationId: number) => {
    deleteCompilation(compilationId);
  };

  const handleDeleteCategory = (categoryId: number) => {
    deleteCategory(categoryId);
  };

  return (
    <>
      <IconButton
        aria-label='more'
        id='long-button'
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='true'
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <StyledMenu
        id='demo-customized-menu'
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
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
            state.user?.username === article?.username &&
            state.user?.role === UserRole.ROLE_AUTHOR && (
              <ButtonAlertDialog
                articleId={article.id}
                lang={lang}
                onClose={handleClose}
              />
            )}
          {article &&
            state.isAuthenticated &&
            state.user?.role !== UserRole.ROLE_ADMIN && (
              <AddToCompilations
                id={article.id}
                username={state.user?.username}
                lang={lang}
                compilations={article.compilations}
                onClose={handleClose}
              />
            )}
          {userDTO && (
            <SubscribeMenuItem
              user={userDTO}
              lang={lang}
              onClose={handleClose}
            />
          )}
          {category && state.user?.role === UserRole.ROLE_ADMIN && (
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
              lang={lang}
              onClose={handleClose}
            />
          )}
          {state.user?.username === compilation?.ownerName && compilation && (
            <ArticlesDnD
              compilationData={compilation}
              lang={lang}
              onClose={handleClose}
              refetch={refetch}
            />
          )}
          {state.user?.username === compilation?.ownerName && compilation && (
            <MenuItem
              onClick={() => handleDelete(compilation.id)}
              disableRipple
            >
              <Typography textAlign='center'>Удалить подборку</Typography>
            </MenuItem>
          )}
          {state.user?.role === UserRole.ROLE_ADMIN && category && (
            <MenuItem
              onClick={() => handleDeleteCategory(category.id)}
              disableRipple
            >
              <Typography textAlign='center'>Удалить категорию</Typography>
            </MenuItem>
          )}
        </MenuList>
      </StyledMenu>
    </>
  );
}
