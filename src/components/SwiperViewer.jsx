import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
    Navigation,
    Pagination,
    Zoom,
    Keyboard,
    Mousewheel,
    Scrollbar,
} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import 'swiper/css/scrollbar';

const imageUrls = [
    '/images/img1.png',
    '/images/img2.png',
    '/images/img3.png',
];

export default function SwiperViewer() {
    const [rotations, setRotations] = useState([]);
    const [images, setImages] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef(null);

    useEffect(() => {
        const fetchImages = async () => {
            const blobs = await Promise.all(
                imageUrls.map(async (url) => {
                    const res = await fetch(url);
                    const blob = await res.blob();
                    return URL.createObjectURL(blob);
                })
            );
            setImages(blobs);
            setRotations(blobs.map(() => 0));
        };

        fetchImages();

        return () => {
            images.forEach((src) => URL.revokeObjectURL(src));
        };
    }, []);

    const handleRotate = () => {
        setRotations((prev) =>
            prev.map((rot, i) => (i === activeIndex ? (rot + 90) % 360 : rot))
        );
    };

    const goPrev = () => {
        if (swiperRef.current) swiperRef.current.slidePrev();
    };

    const goNext = () => {
        if (swiperRef.current) swiperRef.current.slideNext();
    };

    const setZoomRatio = (ratio) => {
        const container = document.querySelector(
            '.swiper-slide-active .swiper-zoom-container img'
        );
        if (container) {
            container.style.transform = `scale(${ratio}) rotate(${rotations[activeIndex]}deg)`;
        }
    };

    return (
        <div style={{
            width: '100%',
            height: '100vh',
            background: '#111',
            color: '#eee',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
        }}>
            <Swiper
                modules={[
                    Navigation,
                    Pagination,
                    Zoom,
                    Keyboard,
                    Mousewheel,
                    Scrollbar,
                ]}
                direction="vertical"
                slidesPerView={1}
                spaceBetween={30}
                keyboard={{ enabled: true }}
                mousewheel={{ forceToAxis: true }}
                scrollbar={{ draggable: true }}
                // pagination={{ clickable: true }}
                zoom={{ maxRatio: 3, toggle: true }}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                style={{
                    width: '80vw',
                    height: '70vh',
                    background: '#222',
                    borderRadius: 8,
                }}
            >
                {images.map((src, i) => (
                    <SwiperSlide key={i}>
                        <div className="swiper-zoom-container" style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                        }}>
                            <img
                                src={src}
                                alt={`Image ${i + 1}`}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    transform: `rotate(${rotations[i]}deg)`,
                                    transition: 'transform 0.3s ease',
                                    userSelect: 'none',
                                }}
                                draggable={false}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div style={{
                marginTop: 15,
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>
                <button onClick={goPrev} style={{ padding: '8px 12px' }}>Previous</button>
                <button onClick={goNext} style={{ padding: '8px 12px' }}>Next</button>
                <button onClick={handleRotate} style={{ padding: '8px 12px' }}>Rotate 90°</button>
                <button onClick={() => setZoomRatio(1)} style={{ padding: '8px 12px' }}>Zoom 1x</button>
                <button onClick={() => setZoomRatio(1.5)} style={{ padding: '8px 12px' }}>Zoom 1.5x</button>
                <button onClick={() => setZoomRatio(2)} style={{ padding: '8px 12px' }}>Zoom 2x</button>
                <button onClick={() => setZoomRatio(3)} style={{ padding: '8px 12px' }}>Zoom 3x</button>
            </div>
        </div>
    );
}
