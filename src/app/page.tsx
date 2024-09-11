"use client"

import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Grid2';
import NavTabs, {LinkTabProps} from "@/components/NavTabs";
import React from "react";
import Banner from "@/components/Banner";

export default function Page() {


    const tabs: LinkTabProps[] = [
        {label: 'History', href: `/`},
        {label: 'Bookmarks', href: `/`},
        {label: 'Subscriptions', href: `/`}
    ];


    return (
        <section>
            <Banner/>
            <section className="your-interest">
                <Typography variant="h3" className="your-interest-h3">Your interest</Typography>
                <NavTabs tabs={tabs}/>
            </section>
            <section className="carousels-section">
                <section className="recent-added">
                    <Grid container spacing={2}>
                        <Grid size={8}>
                            <Typography variant="h3">Recently added</Typography>
                        </Grid>
                    </Grid>
                </section>
                <section className="recommended">
                    <Typography variant="h3">Recommended for you</Typography>
                </section>
                <section className="popular">
                    <Typography variant="h3">Most popular</Typography>
                </section>
            </section>
        </section>
    );
}