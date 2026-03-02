import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppWidget({ clinic }: { clinic: any }) {
    const WHATSAPP_NUMBER = "442071234567"; // Replace with actual clinic number
    const MESSAGE = encodeURIComponent("Hello! I'd like to inquire about a dental treatment.");
    const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${MESSAGE}`;

    return (
        <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[100] w-14 h-14 md:w-16 md:h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl transition-shadow hover:shadow-[#25D366]/40 flex"
            title="Chat with us on WhatsApp"
        >
            <MessageCircle className="w-8 h-8" fill="white" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
            </span>
        </motion.a>
    );
}
