"use client";
import * as React from 'react';
import {useEffect} from 'react';
import Box from '@mui/material/Box';
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

interface LinkTabProps {
    label?: string;
    href?: string;
    selected?: boolean;
}

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

const NavTabs: React.FC = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [value, setValue] = React.useState<number>(0);

    useEffect(() => {
        switch (pathname) {
            case "/posts":
                setValue(0);
                break;
            case "/categories":
                setValue(1);
                break;
            case "/users":
                setValue(2);
                break;
            default:
                setValue(0);
        }
    }, [pathname]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        const href = event.currentTarget.getAttribute('href');
        if (href) {
            router.push(href);
        }
    };

    const shouldShowNavTabs = ["/posts", "/categories", "/users"].some(path => pathname.endsWith(path));

    if (!shouldShowNavTabs) return null;

    return (
        <Box className="mb-5">
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="nav tabs example"
                role="navigation"
                className="pl-5 pr-5"
            >
                <LinkTab label="Posts" href="/posts"/>
                <LinkTab label="Categories" href="/categories"/>
                <LinkTab label="Users" href="/users"/>
            </Tabs>
        </Box>
    );
}

export default NavTabs;