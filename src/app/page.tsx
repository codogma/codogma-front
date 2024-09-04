"use client"

import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Grid2';

export default function Page() {
    return (
        <section>
            <section className="your-interest">
                <Typography variant="h3" className="your-interest-h3">Ваши интересы</Typography>

            </section>
            <section className="carousels-section">
                <section className="recent-added">
                    <Grid container spacing={2}>
                        <Grid size={8}>
                            <Typography variant="h3">Недавно добавлено</Typography>
                        </Grid>
                    </Grid>
                </section>
                <section className="recommended">
                    <Typography variant="h3">Рекомендуется для вас</Typography>
                </section>
                <section className="popular">
                    <Typography variant="h3">Самое популярное</Typography>
                </section>
            </section>
        </section>
    );
}