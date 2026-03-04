import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';

/**
 * Универсальный Tooltip для элементов навигации.
 * Адаптирован под светлую/тёмную тему проекта.
 *
 * @param props – все стандартные пропсы Tooltip (title, placement, children и т.д.)
 */
export const NavTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip
    {...props}
    arrow
    classes={{ popper: className }}
    slots={{ transition: Zoom }}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.mode === 'dark' ? '#1e293b' : '#ffffff',
    '&:before': {
      border: `1px solid ${theme.palette.divider}`,
    },
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.mode === 'dark' ? '#1e293b' : '#ffffff',
    color: theme.palette.mode === 'dark' ? '#f8fafc' : '#1e293b',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '6px',
    fontSize: 12,
    fontWeight: 500,
    maxWidth: 200,
    boxShadow: theme.shadows[4],
    padding: '8px 12px',
    letterSpacing: '0.02em',
  },
}));
