"use client"
import { useEffect, useState } from "react";

const useCarousel = (itemsLength: number, initialVisibleItems: number) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleItems, setVisibleItems] = useState(initialVisibleItems);
    const [offset, setOffset] = useState(100);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < itemsLength - visibleItems) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleIndicatorClick = (index: number) => {
        setCurrentIndex(index);
    };

    useEffect(() => {
        const updateVisibleItems = () => {
            if (typeof window !== "undefined") {
                if (window.innerWidth >= 1024) {
                    setVisibleItems(3.5);
                    setOffset(100);
                } else if (window.innerWidth >= 768) {
                    setVisibleItems(2);
                    setOffset(200);
                } else {
                    setVisibleItems(1);
                    setOffset(100);
                }
            }
        };
    
        if (isClient) {
            updateVisibleItems();
            window.addEventListener("resize", updateVisibleItems);
        }
    
        return () => {
            if (isClient) {
                window.removeEventListener("resize", updateVisibleItems);
            }
        };
    }, [isClient]);    

    return {
        currentIndex,
        visibleItems,
        offset,
        handlePrev,
        handleNext,
        handleIndicatorClick,
    };
};

export default useCarousel;