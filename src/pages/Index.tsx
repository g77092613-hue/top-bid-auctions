import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Catalog from "@/components/Catalog";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Catalog />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
