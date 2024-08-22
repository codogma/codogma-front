"use client";
import * as React from 'react';
import {useEffect} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {usePathname, useRouter} from "next/navigation";

function samePageLinkNavigation(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
) {
    if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey
    ) {
        return false;
    }
    return true;
}

export interface LinkTabProps {
    label: string;
    href: string;
    selected?: boolean;
}

const linkTabs: LinkTabProps[] = [
    {label: 'Articles', href: '/articles'},
    {label: 'Categories', href: '/categories'},
    {label: 'Authors', href: '/users'},
]

function LinkTab(props: LinkTabProps) {
    return (
        <Tab
            component="a"
            onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                if (samePageLinkNavigation(event)) {
                    event.preventDefault();
                }
            }}
            aria-current={props.selected && 'page'}
            {...props}
        />
    );
}

type NavTabsProps = {
    tabs?: LinkTabProps[]
    shouldShow?: boolean
}

const NavTabs: React.FC<NavTabsProps> = ({tabs = linkTabs, shouldShow}) => {
    const pathname = usePathname();
    const router = useRouter();
    const [value, setValue] = React.useState<number>(0);

    useEffect(() => {
        const index = tabs.findIndex(tab => tab.href === pathname);
        setValue(index !== -1 ? index : 0);
    }, [pathname, tabs]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        const href = event.currentTarget.getAttribute('href');
        if (href) {
            router.push(href);
        }
    };

    const shouldShowNavTabs = shouldShow ? true : tabs.map(link => link.href).some(path => pathname.endsWith(path));

    if (!shouldShow) return null;

    return (
        <div className="nav-tabs">
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="nav tabs example"
                role="navigation"
                className="tabs"
            >
                {tabs.map((link, index) => (<LinkTab key={index} label={link.label} href={link.href}/>))}
            </Tabs>
        </div>
    );
}

export default NavTabs;