'use client';
import React from 'react';
import {usePathname} from 'next/navigation';
import Link from 'next/link';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export interface LinkTabProps {
    label: string;
    href: string;
}

type NavTabsProps = {
    tabs?: LinkTabProps[];
};

const linkTabs: LinkTabProps[] = [
    {label: 'Articles', href: '/articles'},
    {label: 'Categories', href: '/categories'},
    {label: 'Authors', href: '/users'},
]

const NavTabs: React.FC<NavTabsProps> = ({tabs = linkTabs}) => {
    const pathname = usePathname();

    const shouldShowNavTabs = tabs.some(tab => {
        const basePath = tab.href;
        return pathname.startsWith(basePath) && pathname === basePath;
    });

    if (!shouldShowNavTabs) return null;

    return (
        <div className="nav-tabs">
            <Tabs value={pathname} className="tabs">
                {tabs.map((tab, index) => (
                    <Tab
                        key={index}
                        component={Link}
                        href={tab.href}
                        label={tab.label}
                        value={tab.href}
                    />
                ))}
            </Tabs>
        </div>
    );
};

export default NavTabs;