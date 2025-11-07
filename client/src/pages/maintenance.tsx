import { Construction } from "lucide-react";
import { motion } from "framer-motion";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-8">
            <img
              src="/attached_assets/logo/studioleflow-transparent.png"
              alt="Studio LeFlow"
              className="h-32 w-auto filter invert"
            />
          </div>

          <Construction className="w-24 h-24 text-primary mx-auto mb-6" />
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-[Montserrat]">
            Sajt je u pripremi
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            Trenutno radimo na unapređenju naših servisa. Uskoro se vraćamo!
          </p>

          <div className="bg-muted rounded-lg p-6 max-w-md mx-auto">
            <p className="text-sm text-muted-foreground">
              Možete nas kontaktirati putem:
            </p>
            <div className="mt-4 space-y-2">
              <p className="font-medium">
                Email: <a href="mailto:info@studioleflow.com" className="text-primary hover:underline">info@studioleflow.com</a>
              </p>
              <p className="font-medium">
                Telefon: <a href="tel:+381637347023" className="text-primary hover:underline">+381 63 734 7023</a>
              </p>
              <p className="font-medium">
                Instagram: <a href="https://instagram.com/studioleflow" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@studioleflow</a>
              </p>
            </div>
          </div>

          <div className="mt-12">
            <a 
              href="/auth" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Admin Prijava
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
