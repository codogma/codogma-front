"use client";
import React from 'react';
import {styled} from '@mui/material/styles';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, Navigation, Pagination} from 'swiper/modules';
import {Box, Button, Card, CardActions, CardContent, IconButtonProps, Typography} from '@mui/material';
import Grid from "@mui/material/Grid2";
import Collapse from '@mui/material/Collapse';
import IconButton from "@mui/material/IconButton";

interface DataItem {
    type: string;
    title: string;
    description: string;
    author: string;
}

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const data: DataItem[] = [
    {
        type: 'Book',
        title: 'Artificial Intelligence of Things (AIoT)',
        description:
            'Artificial Intelligence of Things (AIoT): Current and Future Trends brings together researchers and developers from a wide range of domains to share ideas on how to implement technical advances...',
        author: 'By Fadi Al-Turjman, Fahriye Altinay, & Zehra Altinay Gazi',
    },
    {
        type: 'Book',
        title: 'Artificial Intelligence of Things (AIoT)',
        description:
            'Artificial Intelligence of Things (AIoT): Current and Future Trends brings together researchers and developers from a wide range of domains to share ideas on how to implement technical advances...',
        author: 'By Fadi Al-Turjman, Fahriye Altinay, & Zehra Altinay Gazi',
    },
    {
        type: 'Book',
        title: 'Artificial Intelligence of Things (AIoT)',
        description:
            'Artificial Intelligence of Things (AIoT): Current and Future Trends brings together researchers and developers from a wide range of domains to share ideas on how to implement technical advances...',
        author: 'By Fadi Al-Turjman, Fahriye Altinay, & Zehra Altinay Gazi',
    }
];

const ExpandMore = styled((props: ExpandMoreProps) => {
    const {expand, ...other} = props;
    return <IconButton {...other} />;
})(({theme}) => ({
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
    variants: [
        {
            props: ({expand}) => !expand,
            style: {
                transform: 'rotate(0deg)',
            },
        },
        {
            props: ({expand}) => !!expand,
            style: {
                transform: 'rotate(180deg)',
            },
        },
    ],
}));


const RecentlyAdded: React.FC = () => {
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Box sx={{maxWidth: 800, margin: 'auto', paddingTop: '20px'}}>
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                loop={true}
            >
                <SwiperSlide>
                    <Box sx={{padding: 2, backgroundColor: '#f5f5f5', borderRadius: 2}}>
                        <Typography variant="h5" gutterBottom>
                            Recently Added
                        </Typography>
                        <Grid container spacing={2}>
                            {data.map((item: DataItem, index: number) => (
                                <Grid size={{xs: 12, md: 4}} key={index}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="subtitle1" color="text.secondary">
                                                {item.type}
                                            </Typography>
                                            <Typography variant="h6" gutterBottom>
                                                {item.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {item.description}
                                            </Typography>
                                            <Typography variant="caption" display="block" gutterBottom>
                                                {item.author}
                                            </Typography>
                                        </CardContent>
                                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                                            <CardActions>
                                                <Button size="small">Learn More</Button>
                                            </CardActions>
                                        </Collapse>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </SwiperSlide>
            </Swiper>
        </Box>
    );
};

export default RecentlyAdded;
