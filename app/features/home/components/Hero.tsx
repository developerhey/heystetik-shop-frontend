import { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useOutletContext } from 'react-router';
import type { ContextType } from '~/root';
import type { BannerUI } from '~/features/home/schemas/banner-ui-schema';
import { cn } from '~/lib/utils';
interface HeroProps {
    slides: BannerUI[];
    interval?: number; // in ms
}

export default function Hero({ slides, interval = 3000 }: HeroProps) {
    const { isMobile } = useOutletContext<ContextType>()
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: interval })]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('select', onSelect);
        onSelect(); // initial selection
    }, [emblaApi, onSelect]);

    return (
        <section className="overflow-hidden relative" ref={emblaRef}>
            <div className="flex">
                {slides.map((slide, index) => (
                    <div
                        className="flex-[0_0_100%] relative"
                        key={index}
                    >
                        <img
                            src={slide.image}
                            alt={slide.alt || `Slide ${index}`}
                            className={cn("w-full object-fit", isMobile ? "h-[25vh]" : "h-[90vh]")}
                            loading='lazy'
                        />
                    </div>
                ))}
            </div>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => emblaApi?.scrollTo(index)}
                        className={cn(
                            isMobile ? "w-1.5 h-1.5" : "w-2 h-2",
                            "rounded-full",
                            index === selectedIndex ? 'bg-primary' : 'bg-white/50')
                        }
                    />
                ))}
            </div>
        </section>
    );
}