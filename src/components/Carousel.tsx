'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Box, Card, CardContent, Typography } from '@mui/material';

interface DataItem {
  type: string;
  title: string;
  description: string;
  author: string;
}

const data: DataItem[] = [
  {
    type: 'Book',
    title: 'Artificial Intelligence of Things (AIoT)',
    description:
      'Artificial Intelligence of Things (AIoT): Current and Future Trends brings together researchers and developers...',
    author: 'By Fadi Al-Turjman, Fahriye Altinay, & Zehra Altinay Gazi',
  },
  {
    type: 'Book',
    title: 'The Internet of Things (IoT)',
    description:
      'A comprehensive introduction to the Internet of Things, covering all major aspects and trends...',
    author: 'By John Doe, Jane Smith',
  },
  {
    type: 'Book',
    title: 'Artificial Intelligence of Things (AIoT)',
    description:
      'Artificial Intelligence of Things (AIoT): Current and Future Trends brings together researchers and developers...',
    author: 'By Fadi Al-Turjman, Fahriye Altinay, & Zehra Altinay Gazi',
  },
  {
    type: 'Book',
    title: 'The Internet of Things (IoT)',
    description:
      'A comprehensive introduction to the Internet of Things, covering all major aspects and trends...',
    author: 'By John Doe, Jane Smith',
  },
  {
    type: 'Book',
    title: 'Artificial Intelligence of Things (AIoT)',
    description:
      'Artificial Intelligence of Things (AIoT): Current and Future Trends brings together researchers and developers...',
    author: 'By Fadi Al-Turjman, Fahriye Altinay, & Zehra Altinay Gazi',
  },
  {
    type: 'Book',
    title: 'The Internet of Things (IoT)',
    description:
      'A comprehensive introduction to the Internet of Things, covering all major aspects and trends...',
    author: 'By John Doe, Jane Smith',
  },
  {
    type: 'Book',
    title: 'Artificial Intelligence of Things (AIoT)',
    description:
      'Artificial Intelligence of Things (AIoT): Current and Future Trends brings together researchers and developers...',
    author: 'By Fadi Al-Turjman, Fahriye Altinay, & Zehra Altinay Gazi',
  },
  {
    type: 'Book',
    title: 'The Internet of Things (IoT)',
    description:
      'A comprehensive introduction to the Internet of Things, covering all major aspects and trends...',
    author: 'By John Doe, Jane Smith',
  },
  {
    type: 'Book',
    title: 'The Internet of Things (IoT)',
    description:
      'A comprehensive introduction to the Internet of Things, covering all major aspects and trends...',
    author: 'By John Doe, Jane Smith',
  },
];

const Carousel: React.FC = (props) => {
  return (
    <Box
      sx={{ width: '100%', maxWidth: 1200, margin: 'auto', padding: '20px 0' }}
    >
      <Typography variant='h5' gutterBottom>
        Recently Added
      </Typography>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={30}
        slidesPerView={3}
        slidesPerGroup={3}
        navigation={true}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 20000,
          disableOnInteraction: false,
        }}
        loop={true}
        className='swiper'
      >
        {data.map((item, index) => (
          <SwiperSlide key={index}>
            <Box sx={{ backgroundColor: '#f5f5f5', borderRadius: 2 }}>
              <Card
                sx={{
                  height: 300,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                variant='outlined'
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant='subtitle1' color='text.secondary'>
                    {item.type}
                  </Typography>
                  <Typography variant='h6' gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 3,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.description}
                  </Typography>
                  <Typography variant='caption' display='block' gutterBottom>
                    {item.author}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default Carousel;
