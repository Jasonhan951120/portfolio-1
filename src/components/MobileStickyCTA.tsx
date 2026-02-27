import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

export default function MobileStickyCTA() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling 300px
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleClick = () => {
        const element = document.getElementById("lead-form");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-6 right-6 z-[60] lg:hidden"
                >
                    <button
                        onClick={handleClick}
                        className="w-full bg-accent text-black py-4 rounded-2xl font-bold uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 border border-black/5"
                    >
                        <Calendar className="w-5 h-5" />
                        Book My Session Now
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
