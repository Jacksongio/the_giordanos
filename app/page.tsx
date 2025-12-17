import { Hero } from "@/components/hero"
import { OurStory } from "@/components/our-story"
import { WeddingDetails } from "@/components/wedding-details"
import { Countdown } from "@/components/countdown"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <OurStory />
      <WeddingDetails />
      <Countdown />
      <Footer />
    </main>
  )
}
