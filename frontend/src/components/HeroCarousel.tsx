// components/HeroCarousel.tsx
'use client';

import { Carousel } from 'react-bootstrap';
import styles from './HeroCarousel.module.css';
import Image from 'next/image';

const images = [
    '/imagen1.jpg',
    '/imagen2.jpg',
    '/imagen3.jpg',
    '/imagen4.jpg',
    '/imagen5.jpg',
    '/imagen6.jpg',
];

export default function HeroCarousel() {
    return (
        <div className={styles.hero}>
            <Carousel controls={false} indicators={false} fade interval={1000}>
                {images.map((src, index) => (
                    <Carousel.Item key={index}>
                        <div style={{ position: 'relative', width: '100%', height: '500px' }}>
                            <Image
                                src={src}
                                alt={`Imagen ${index + 1}`}
                                layout="fill"
                                objectFit="cover"
                                priority
                            />
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
}
